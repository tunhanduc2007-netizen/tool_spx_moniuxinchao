"""Shopee Open Platform API Management, OAuth and Synchronization router."""

from datetime import datetime, timedelta
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session
from tool_spx.db.session import get_db
from tool_spx.db.models import ShopeeAppConfig, ShopeeShop, ShopeeSyncLog, User
from tool_spx.security.auth import get_current_user, require_admin, require_roles, log_audit
from tool_spx.security.encryption import encrypt_secret, decrypt_secret, mask_secret
from tool_spx.shopee.client import ShopeeClient
from tool_spx.shopee.sync_service import (
    sync_orders_for_shop, sync_products_for_shop, get_shopee_client_for_shop
)
from tool_spx.shopee.inventory_table import SHOPEE_API_INVENTORY

router = APIRouter(prefix="/api/shopee", tags=["Shopee Open Platform"])

class UpdateShopeeConfigRequest(BaseModel):
    partner_id: int
    partner_key: Optional[str] = None  # If not provided, keep current
    api_environment: str = "live"
    redirect_url: str
    mock_mode: bool = False

class ManualAuthShopRequest(BaseModel):
    shop_id: int
    shop_name: str
    code: Optional[str] = None

@router.get("/config")
def get_shopee_app_config(
    current_user: User = Depends(require_roles(["ADMIN", "MANAGER"])),
    db: Session = Depends(get_db)
):
    """Retrieve Shopee Open Platform application config with masked secrets."""
    config = db.query(ShopeeAppConfig).first()
    if not config:
        config = ShopeeAppConfig(partner_id=1000001, mock_mode=True, is_configured=False)
        db.add(config)
        db.commit()
        db.refresh(config)

    raw_key = decrypt_secret(config.partner_key_encrypted) if config.partner_key_encrypted else ""

    return {
        "success": True,
        "config": {
            "partner_id": config.partner_id,
            "partner_key_masked": mask_secret(raw_key),
            "has_partner_key": bool(raw_key),
            "api_environment": config.api_environment,
            "redirect_url": config.redirect_url,
            "mock_mode": config.mock_mode,
            "is_configured": config.is_configured,
            "updated_at": config.updated_at.strftime("%d/%m/%Y %H:%M") if config.updated_at else ""
        }
    }

@router.post("/config")
def update_shopee_app_config(
    req: UpdateShopeeConfigRequest,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Admin updates Shopee Open Platform App credentials."""
    config = db.query(ShopeeAppConfig).first()
    if not config:
        config = ShopeeAppConfig()
        db.add(config)

    config.partner_id = req.partner_id
    if req.partner_key and req.partner_key.strip():
        config.partner_key_encrypted = encrypt_secret(req.partner_key.strip())
        config.is_configured = True

    config.api_environment = req.api_environment
    config.redirect_url = req.redirect_url
    config.mock_mode = req.mock_mode
    config.updated_at = datetime.utcnow()
    db.commit()

    log_audit(db, current_user.id, "UPDATE_SHOPEE_CONFIG", "SHOPEE_CONFIG", str(config.id), "Cập nhật thông tin Shopee Open Platform")

    return {"success": True, "message": "Đã lưu cấu hình Shopee Open Platform an toàn."}

@router.get("/auth-url")
def get_authorization_url(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Generate official OAuth shop authorization URL."""
    config = db.query(ShopeeAppConfig).first()
    if not config or not config.partner_id:
        raise HTTPException(status_code=400, detail="Chưa cấu hình Partner ID.")

    raw_key = decrypt_secret(config.partner_key_encrypted) if config.partner_key_encrypted else ""
    client = ShopeeClient(
        partner_id=config.partner_id,
        partner_key=raw_key,
        environment=config.api_environment,
        mock_mode=config.mock_mode
    )

    auth_url = client.generate_auth_url(config.redirect_url)
    return {
        "success": True,
        "auth_url": auth_url,
        "redirect_url": config.redirect_url,
        "environment": config.api_environment
    }

@router.get("/callback")
async def shopee_oauth_callback(
    code: str,
    shop_id: int,
    db: Session = Depends(get_db)
):
    """Official callback endpoint receiving authorization code from Shopee."""
    config = db.query(ShopeeAppConfig).first()
    raw_key = decrypt_secret(config.partner_key_encrypted) if config and config.partner_key_encrypted else ""

    client = ShopeeClient(
        partner_id=config.partner_id if config else 1000001,
        partner_key=raw_key,
        environment=config.api_environment if config else "live",
        mock_mode=config.mock_mode if config else True
    )

    token_data = await client.get_token(code=code, shop_id=shop_id)
    if token_data.get("error"):
        raise HTTPException(status_code=400, detail=f"Lỗi xác thực Shopee: {token_data.get('message')}")

    access_token = token_data.get("access_token")
    refresh_token = token_data.get("refresh_token")
    expire_in = token_data.get("expire_in", 14400)

    # Get shop info
    info_res = await client.get_shop_info(shop_id=shop_id, access_token=access_token)
    shop_name = info_res.get("response", {}).get("shop_name", f"Shopee Shop #{shop_id}")

    # Save or update shop in DB
    shop = db.query(ShopeeShop).filter(ShopeeShop.shop_id == shop_id).first()
    if not shop:
        shop = ShopeeShop(
            shop_id=shop_id,
            shop_name=shop_name,
            access_token_encrypted=encrypt_secret(access_token),
            refresh_token_encrypted=encrypt_secret(refresh_token),
            token_expires_at=datetime.utcnow() + timedelta(seconds=expire_in),
            is_connected=True,
            authorized_at=datetime.utcnow()
        )
        db.add(shop)
    else:
        shop.shop_name = shop_name
        shop.access_token_encrypted = encrypt_secret(access_token)
        shop.refresh_token_encrypted = encrypt_secret(refresh_token)
        shop.token_expires_at = datetime.utcnow() + timedelta(seconds=expire_in)
        shop.is_connected = True
        shop.last_error = None

    db.commit()

    return {
        "success": True,
        "message": f"Shop {shop_name} ({shop_id}) đã kết nối thành công với hệ thống!",
        "shop_id": shop_id,
        "shop_name": shop_name
    }

@router.post("/manual-connect")
async def manual_connect_shop(
    req: ManualAuthShopRequest,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Admin connects or re-authorizes a shop directly."""
    config = db.query(ShopeeAppConfig).first()
    raw_key = decrypt_secret(config.partner_key_encrypted) if config and config.partner_key_encrypted else ""

    client = ShopeeClient(
        partner_id=config.partner_id if config else 1000001,
        partner_key=raw_key,
        environment=config.api_environment if config else "live",
        mock_mode=config.mock_mode if config else True
    )

    code = req.code or f"manual_auth_code_{req.shop_id}"
    token_data = await client.get_token(code=code, shop_id=req.shop_id)

    access_token = token_data.get("access_token", f"acc_{req.shop_id}")
    refresh_token = token_data.get("refresh_token", f"ref_{req.shop_id}")
    expire_in = token_data.get("expire_in", 14400)

    shop = db.query(ShopeeShop).filter(ShopeeShop.shop_id == req.shop_id).first()
    if not shop:
        shop = ShopeeShop(
            shop_id=req.shop_id,
            shop_name=req.shop_name,
            access_token_encrypted=encrypt_secret(access_token),
            refresh_token_encrypted=encrypt_secret(refresh_token),
            token_expires_at=datetime.utcnow() + timedelta(seconds=expire_in),
            is_connected=True,
            authorized_at=datetime.utcnow()
        )
        db.add(shop)
    else:
        shop.shop_name = req.shop_name
        shop.access_token_encrypted = encrypt_secret(access_token)
        shop.refresh_token_encrypted = encrypt_secret(refresh_token)
        shop.token_expires_at = datetime.utcnow() + timedelta(seconds=expire_in)
        shop.is_connected = True

    db.commit()

    log_audit(db, current_user.id, "CONNECT_SHOPEE_SHOP", "SHOP", str(req.shop_id), f"Kết nối shop {req.shop_name}")

    return {"success": True, "message": f"Đã kết nối shop {req.shop_name} thành công!"}

@router.get("/shops")
def list_connected_shops(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List connected Shopee shops with token expiration and sync statuses."""
    shops = db.query(ShopeeShop).all()
    results = []
    now = datetime.utcnow()

    for s in shops:
        is_token_valid = s.token_expires_at > now if s.token_expires_at else False
        remaining_hours = int((s.token_expires_at - now).total_seconds() / 3600) if is_token_valid else 0

        results.append({
            "id": s.id,
            "shop_id": s.shop_id,
            "shop_name": s.shop_name,
            "region": s.region,
            "is_connected": s.is_connected,
            "is_token_valid": is_token_valid,
            "remaining_token_hours": remaining_hours,
            "token_expires_at": s.token_expires_at.strftime("%d/%m/%Y %H:%M") if s.token_expires_at else "",
            "last_sync_at": s.last_sync_at.strftime("%d/%m/%Y %H:%M") if s.last_sync_at else "Chưa đồng bộ",
            "last_error": s.last_error,
            "orders_count": len(s.orders),
            "products_count": len(s.products)
        })
    return {"success": True, "shops": results}

@router.post("/shops/{shop_id_db}/refresh-token")
async def refresh_shop_token(
    shop_id_db: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Manually refresh Shopee access token."""
    shop = db.query(ShopeeShop).filter(ShopeeShop.id == shop_id_db).first()
    if not shop:
        raise HTTPException(status_code=404, detail="Không tìm thấy shop.")

    client = get_shopee_client_for_shop(db, shop)
    refresh_token = decrypt_secret(shop.refresh_token_encrypted)

    res = await client.refresh_access_token(refresh_token=refresh_token, shop_id=shop.shop_id)
    if res.get("error"):
        error_msg = res.get("message", "Lỗi làm mới token")
        shop.last_error = error_msg
        db.commit()
        raise HTTPException(status_code=400, detail=error_msg)

    new_acc = res.get("access_token")
    new_ref = res.get("refresh_token")
    expire_in = res.get("expire_in", 14400)

    shop.access_token_encrypted = encrypt_secret(new_acc)
    shop.refresh_token_encrypted = encrypt_secret(new_ref)
    shop.token_expires_at = datetime.utcnow() + timedelta(seconds=expire_in)
    shop.last_error = None
    db.commit()

    log_audit(db, current_user.id, "REFRESH_SHOPEE_TOKEN", "SHOP", str(shop.shop_id), "Làm mới Access Token thành công")

    return {"success": True, "message": "Đã làm mới token thành công!"}

@router.post("/shops/{shop_id_db}/sync-orders")
async def sync_shop_orders(
    shop_id_db: int,
    current_user: User = Depends(require_roles(["ADMIN", "MANAGER", "WAREHOUSE_STAFF"])),
    db: Session = Depends(get_db)
):
    """Trigger manual order synchronization for a shop."""
    result = await sync_orders_for_shop(db, shop_id_db, triggered_by=f"MANUAL ({current_user.username})")
    log_audit(db, current_user.id, "SYNC_ORDERS", "SHOP", str(shop_id_db), f"Đồng bộ đơn hàng: {result.get('message')}")
    return result

@router.post("/shops/{shop_id_db}/sync-products")
async def sync_shop_products(
    shop_id_db: int,
    current_user: User = Depends(require_roles(["ADMIN", "MANAGER"])),
    db: Session = Depends(get_db)
):
    """Trigger manual product catalog synchronization for a shop."""
    result = await sync_products_for_shop(db, shop_id_db, triggered_by=f"MANUAL ({current_user.username})")
    log_audit(db, current_user.id, "SYNC_PRODUCTS", "SHOP", str(shop_id_db), f"Đồng bộ sản phẩm: {result.get('message')}")
    return result

@router.delete("/shops/{shop_id_db}/disconnect")
def disconnect_shop(
    shop_id_db: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Disconnect / revoke authorization for a shop."""
    shop = db.query(ShopeeShop).filter(ShopeeShop.id == shop_id_db).first()
    if not shop:
        raise HTTPException(status_code=404, detail="Không tìm thấy shop.")

    shop.is_connected = False
    db.commit()

    log_audit(db, current_user.id, "DISCONNECT_SHOP", "SHOP", str(shop.shop_id), f"Ngắt kết nối shop {shop.shop_name}")

    return {"success": True, "message": f"Đã ngắt kết nối shop {shop.shop_name}."}

@router.get("/sync-logs")
def list_sync_logs(
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve Shopee sync history and error logs."""
    logs = db.query(ShopeeSyncLog).order_by(ShopeeSyncLog.created_at.desc()).limit(limit).all()
    results = []
    for l in logs:
        results.append({
            "id": l.id,
            "shop_name": l.shop.shop_name if l.shop else "Hệ thống",
            "sync_type": l.sync_type,
            "status": l.status,
            "records_processed": l.records_processed,
            "records_failed": l.records_failed,
            "details": l.details,
            "triggered_by": l.triggered_by,
            "created_at": l.created_at.strftime("%d/%m/%Y %H:%M:%S") if l.created_at else ""
        })
    return {"success": True, "logs": results}

@router.get("/api-inventory")
def get_shopee_api_inventory(current_user: User = Depends(get_current_user)):
    """Return the official Shopee Open Platform v2 API Catalog (Requirement 3)."""
    return {
        "success": True,
        "total_endpoints": len(SHOPEE_API_INVENTORY),
        "inventory": SHOPEE_API_INVENTORY
    }
