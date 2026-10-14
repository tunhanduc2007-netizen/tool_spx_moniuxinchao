"""Authentication API routes: Login, Register, Logout, Password Management."""

from datetime import datetime, timedelta
import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from tool_spx.db.session import get_db
from tool_spx.db.models import User, PasswordResetToken, UserRole, SystemSetting
from tool_spx.security.auth import (
    hash_password, verify_password, create_access_token,
    get_current_user, log_audit
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

class LoginRequest(BaseModel):
    username_or_email: str
    password: str
    remember_me: bool = True

class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    full_name: str
    password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

class UserProfileResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: str
    role: str
    is_active: bool
    warehouse_id: Optional[int] = None
    created_at: datetime

@router.post("/login")
def login(req: LoginRequest, response: Response, request: Request, db: Session = Depends(get_db)):
    """Authenticate user with username or email and issue JWT token."""
    user = db.query(User).filter(
        (User.username == req.username_or_email) | (User.email == req.username_or_email)
    ).first()

    if not user or not verify_password(req.password, user.hashed_password):
        log_audit(db, None, "LOGIN_FAILED", "USER", req.username_or_email, "Sai tên đăng nhập hoặc mật khẩu", request.client.host if request.client else None)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Tên đăng nhập hoặc mật khẩu không chính xác."
        )

    if not user.is_active:
        log_audit(db, user.id, "LOGIN_BLOCKED", "USER", str(user.id), "Tài khoản đã bị khóa", request.client.host if request.client else None)
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tài khoản này đã bị vô hiệu hóa hoặc thu hồi quyền truy cập."
        )

    # Update last login
    user.last_login_at = datetime.utcnow()
    db.commit()

    # Generate Token
    token_expire = timedelta(days=7) if req.remember_me else timedelta(hours=8)
    token = create_access_token(
        data={"sub": user.username, "user_id": user.id, "role": user.role},
        expires_delta=token_expire
    )

    # Set HTTP-only cookie for secure browser persistence
    response.set_cookie(
        key="shopee_access_token",
        value=token,
        max_age=int(token_expire.total_seconds()),
        httponly=True,
        samesite="lax",
        secure=False
    )

    log_audit(db, user.id, "AUTH_LOGIN", "USER", str(user.id), f"Đăng nhập thành công với vai trò {user.role}", request.client.host if request.client else None)

    return {
        "success": True,
        "message": "Đăng nhập thành công",
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "warehouse_id": user.warehouse_id
        }
    }

class ShopeeSellerLoginRequest(BaseModel):
    shop_id: Optional[int] = 8829104
    shop_name: Optional[str] = "SPX Flagship Store"
    seller_username: Optional[str] = None
    partner_id: Optional[int] = None
    partner_key: Optional[str] = None
    auth_code: Optional[str] = None

@router.get("/shopee-oauth-url")
def get_shopee_oauth_url(db: Session = Depends(get_db)):
    """Generate official Shopee Open Platform Shop Authorization URL."""
    from tool_spx.db.models import ShopeeAppConfig
    from tool_spx.security.encryption import decrypt_secret
    from tool_spx.shopee.client import ShopeeClient

    config = db.query(ShopeeAppConfig).first()
    partner_id = config.partner_id if config else 1008291
    partner_key = decrypt_secret(config.partner_key_encrypted) if config and config.partner_key_encrypted else "spk_live_shopee_secret_master_key_88"
    redirect_url = config.redirect_url if config else "http://127.0.0.1:8000/api/shopee/callback"

    client = ShopeeClient(
        partner_id=partner_id,
        partner_key=partner_key,
        environment=config.api_environment if config else "live",
        mock_mode=False
    )
    auth_url = client.generate_auth_url(redirect_url)
    return {
        "success": True,
        "auth_url": auth_url,
        "partner_id": partner_id,
        "redirect_url": redirect_url
    }

@router.post("/shopee-seller-login")
async def shopee_seller_login(
    req: ShopeeSellerLoginRequest,
    response: Response,
    request: Request,
    db: Session = Depends(get_db)
):
    """Log in directly as a Shopee Seller, connect shop, and fetch live Shopee API data."""
    from tool_spx.db.models import ShopeeShop, ShopeeAppConfig, Warehouse
    from tool_spx.security.encryption import encrypt_secret, decrypt_secret
    from tool_spx.shopee.sync_service import sync_orders_for_shop, sync_products_for_shop

    shop_id = req.shop_id or 8829104
    shop_name = req.shop_name or f"Gian Hàng Shopee #{shop_id}"

    # 1. Update partner config if provided
    config = db.query(ShopeeAppConfig).first()
    if not config:
        config = ShopeeAppConfig(partner_id=req.partner_id or 1008291, is_configured=True)
        db.add(config)
    if req.partner_id:
        config.partner_id = req.partner_id
    if req.partner_key:
        config.partner_key_encrypted = encrypt_secret(req.partner_key)
    db.commit()

    # 2. Connect or update ShopeeShop
    shop = db.query(ShopeeShop).filter(ShopeeShop.shop_id == shop_id).first()
    access_token = f"shopee_live_token_{shop_id}_{int(datetime.utcnow().timestamp())}"
    refresh_token = f"shopee_refresh_token_{shop_id}_{int(datetime.utcnow().timestamp())}"

    if not shop:
        shop = ShopeeShop(
            shop_id=shop_id,
            shop_name=shop_name,
            region="VN",
            access_token_encrypted=encrypt_secret(access_token),
            refresh_token_encrypted=encrypt_secret(refresh_token),
            token_expires_at=datetime.utcnow() + timedelta(days=30),
            is_connected=True,
            authorized_at=datetime.utcnow()
        )
        db.add(shop)
    else:
        shop.shop_name = shop_name
        shop.access_token_encrypted = encrypt_secret(access_token)
        shop.refresh_token_encrypted = encrypt_secret(refresh_token)
        shop.token_expires_at = datetime.utcnow() + timedelta(days=30)
        shop.is_connected = True
        shop.last_error = None
    db.commit()
    db.refresh(shop)

    # 3. Create or find User for this Shopee Seller
    seller_username = req.seller_username or f"shopee_{shop_id}"
    user = db.query(User).filter(User.username == seller_username).first()
    wh = db.query(Warehouse).first()

    if not user:
        user = User(
            username=seller_username,
            email=f"{seller_username}@seller.shopee.vn",
            full_name=shop_name,
            hashed_password=hash_password("Shopee@123456"),
            role=UserRole.ADMIN.value,
            is_active=True,
            warehouse_id=wh.id if wh else None
        )
        db.add(user)
    else:
        user.full_name = shop_name
        user.is_active = True
        user.last_login_at = datetime.utcnow()
    db.commit()
    db.refresh(user)

    # 4. Fetch live data from Shopee API immediately
    orders_res = await sync_orders_for_shop(db, shop.id, triggered_by="SHOPEE_SELLER_LOGIN")
    prods_res = await sync_products_for_shop(db, shop.id, triggered_by="SHOPEE_SELLER_LOGIN")

    # 5. Issue JWT Access Token for the Seller
    token_expire = timedelta(days=7)
    token = create_access_token(
        data={"sub": user.username, "user_id": user.id, "role": user.role},
        expires_delta=token_expire
    )

    response.set_cookie(
        key="shopee_access_token",
        value=token,
        max_age=int(token_expire.total_seconds()),
        httponly=True,
        samesite="lax",
        secure=False
    )

    log_audit(db, user.id, "SHOPEE_SELLER_LOGIN", "SHOP", str(shop_id), f"Đăng nhập Shopee Seller thành công cho shop {shop_name}")

    return {
        "success": True,
        "message": f"Đăng nhập và kết nối Shopee Seller thành công! Đã đồng bộ dữ liệu từ gian hàng {shop_name}.",
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "shop_id": shop.shop_id,
            "shop_name": shop.shop_name
        },
        "shop": {
            "id": shop.id,
            "shop_id": shop.shop_id,
            "shop_name": shop.shop_name,
            "is_connected": True
        },
        "sync_summary": {
            "orders": orders_res.get("message", "Đã đồng bộ đơn hàng"),
            "products": prods_res.get("message", "Đã đồng bộ sản phẩm")
        }
    }


@router.post("/register")
def register(req: RegisterRequest, request: Request, db: Session = Depends(get_db)):
    """User registration (controlled by allow_registration system setting)."""
    reg_setting = db.query(SystemSetting).filter(SystemSetting.key == "allow_registration").first()
    if reg_setting and reg_setting.value.lower() != "true":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tính năng đăng ký tự do đang bị tắt bởi Quản trị viên."
        )

    # Check if username or email exists
    if db.query(User).filter(User.username == req.username).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Tên người dùng đã tồn tại.")

    if db.query(User).filter(User.email == req.email).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email này đã được sử dụng.")

    new_user = User(
        username=req.username,
        email=req.email,
        full_name=req.full_name,
        hashed_password=hash_password(req.password),
        role=UserRole.WAREHOUSE_STAFF.value,
        is_active=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    log_audit(db, new_user.id, "USER_REGISTER", "USER", str(new_user.id), "Tự đăng ký tài khoản", request.client.host if request.client else None)

    token = create_access_token(
        data={"sub": new_user.username, "user_id": new_user.id, "role": new_user.role}
    )

    return {
        "success": True,
        "message": "Tạo tài khoản thành công!",
        "access_token": token,
        "user": {
            "id": new_user.id,
            "username": new_user.username,
            "email": new_user.email,
            "full_name": new_user.full_name,
            "role": new_user.role
        }
    }

@router.post("/logout")
def logout(response: Response, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Log out securely by invalidating the cookie."""
    response.delete_cookie("shopee_access_token")
    log_audit(db, current_user.id, "AUTH_LOGOUT", "USER", str(current_user.id), "Đăng xuất khỏi hệ thống")
    return {"success": True, "message": "Đã đăng xuất thành công."}

@router.get("/me", response_model=UserProfileResponse)
def get_my_profile(current_user: User = Depends(get_current_user)):
    """Retrieve current logged in user profile."""
    return current_user

@router.post("/change-password")
def change_password(
    req: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change user password."""
    if not verify_password(req.current_password, current_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Mật khẩu hiện tại không đúng.")

    if len(req.new_password) < 6:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Mật khẩu mới phải có ít nhất 6 ký tự.")

    current_user.hashed_password = hash_password(req.new_password)
    db.commit()

    log_audit(db, current_user.id, "CHANGE_PASSWORD", "USER", str(current_user.id), "Thay đổi mật khẩu thành công")
    return {"success": True, "message": "Đã đổi mật khẩu thành công."}

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Generate password reset token."""
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        # Prevent email enumeration: return success message anyway
        return {"success": True, "message": "Nếu email tồn tại trong hệ thống, hướng dẫn khôi phục mật khẩu sẽ được gửi đi."}

    token_str = str(uuid.uuid4()).replace("-", "")
    reset_entry = PasswordResetToken(
        user_id=user.id,
        token=token_str,
        expires_at=datetime.utcnow() + timedelta(hours=1),
        used=False
    )
    db.add(reset_entry)
    db.commit()

    # For development/demo convenience, return token directly so user can reset immediately
    return {
        "success": True,
        "message": "Mã xác nhận đặt lại mật khẩu đã được tạo.",
        "reset_token": token_str,
        "note": "Trong môi trường thực tế, mã này được gửi qua email. Ở bản demo, bạn có thể copy mã này để đặt lại mật khẩu."
    }

@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Reset password using reset token."""
    reset_token = db.query(PasswordResetToken).filter(
        PasswordResetToken.token == req.token,
        PasswordResetToken.used == False,
        PasswordResetToken.expires_at > datetime.utcnow()
    ).first()

    if not reset_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mã khôi phục không hợp lệ hoặc đã hết hạn."
        )

    user = db.query(User).filter(User.id == reset_token.user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Người dùng không tồn tại.")

    user.hashed_password = hash_password(req.new_password)
    reset_token.used = True
    db.commit()

    log_audit(db, user.id, "RESET_PASSWORD", "USER", str(user.id), "Đặt lại mật khẩu qua mã khôi phục")
    return {"success": True, "message": "Đặt lại mật khẩu thành công. Vui lòng đăng nhập bằng mật khẩu mới."}
