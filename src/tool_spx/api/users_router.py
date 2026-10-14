"""User Management and RBAC API routes (Admin & Managers)."""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from tool_spx.db.session import get_db
from tool_spx.db.models import User, UserRole, Warehouse
from tool_spx.security.auth import (
    get_current_user, require_admin, require_roles, hash_password, log_audit
)

router = APIRouter(prefix="/api/users", tags=["User Management"])

class CreateUserRequest(BaseModel):
    username: str
    email: EmailStr
    full_name: str
    password: str
    role: str
    warehouse_id: Optional[int] = None

class UpdateUserRoleRequest(BaseModel):
    role: str

class AssignWarehouseRequest(BaseModel):
    warehouse_id: Optional[int] = None

@router.get("")
def list_users(
    role: Optional[str] = None,
    current_user: User = Depends(require_roles([UserRole.ADMIN.value, UserRole.MANAGER.value])),
    db: Session = Depends(get_db)
):
    """List all system users with roles and assigned warehouses."""
    query = db.query(User)
    if role:
        query = query.filter(User.role == role)
    users = query.order_by(User.id.asc()).all()

    results = []
    for u in users:
        results.append({
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "full_name": u.full_name,
            "role": u.role,
            "is_active": u.is_active,
            "warehouse_id": u.warehouse_id,
            "warehouse_name": u.warehouse.name if u.warehouse else "Toàn quyền / Không gán",
            "last_login_at": u.last_login_at.strftime("%d/%m/%Y %H:%M") if u.last_login_at else "Chưa đăng nhập",
            "created_at": u.created_at.strftime("%d/%m/%Y %H:%M") if u.created_at else ""
        })
    return {"success": True, "users": results}

@router.post("/create")
def create_user_by_admin(
    req: CreateUserRequest,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Admin creates a new user and assigns role and warehouse."""
    if db.query(User).filter(User.username == req.username).first():
        raise HTTPException(status_code=400, detail="Tên người dùng đã tồn tại.")

    if db.query(User).filter(User.email == req.email).first():
        raise HTTPException(status_code=400, detail="Email này đã được sử dụng.")

    if req.role not in [r.value for r in UserRole]:
        raise HTTPException(status_code=400, detail=f"Vai trò không hợp lệ. Chọn một trong: {[r.value for r in UserRole]}")

    if req.warehouse_id:
        wh = db.query(Warehouse).filter(Warehouse.id == req.warehouse_id).first()
        if not wh:
            raise HTTPException(status_code=400, detail="Kho được gán không tồn tại.")

    new_user = User(
        username=req.username,
        email=req.email,
        full_name=req.full_name,
        hashed_password=hash_password(req.password),
        role=req.role,
        is_active=True,
        warehouse_id=req.warehouse_id
    )
    db.add(new_user)
    db.commit()

    log_audit(db, current_user.id, "CREATE_USER", "USER", str(new_user.id), f"Tạo người dùng {new_user.username} với vai trò {new_user.role}")

    return {"success": True, "message": f"Đã tạo thành công tài khoản {new_user.username}."}

@router.put("/{user_id}/toggle-active")
def toggle_user_active(
    user_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Lock/Revoke or Unlock user account."""
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Không thể tự khóa tài khoản của chính mình.")

    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="Không tìm thấy người dùng.")

    target_user.is_active = not target_user.is_active
    status_text = "kích hoạt" if target_user.is_active else "khóa/thu hồi quyền"
    db.commit()

    log_audit(db, current_user.id, "TOGGLE_USER_ACTIVE", "USER", str(user_id), f"Đã {status_text} tài khoản {target_user.username}")

    return {
        "success": True,
        "message": f"Đã {status_text} tài khoản {target_user.username} thành công.",
        "is_active": target_user.is_active
    }

@router.put("/{user_id}/change-role")
def change_user_role(
    user_id: int,
    req: UpdateUserRoleRequest,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Update role for a user."""
    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="Không tìm thấy người dùng.")

    if req.role not in [r.value for r in UserRole]:
        raise HTTPException(status_code=400, detail="Vai trò không hợp lệ.")

    old_role = target_user.role
    target_user.role = req.role
    db.commit()

    log_audit(db, current_user.id, "CHANGE_USER_ROLE", "USER", str(user_id), f"Đổi vai trò từ {old_role} sang {req.role}")

    return {"success": True, "message": f"Đã cập nhật vai trò của {target_user.username} thành {req.role}."}

@router.put("/{user_id}/assign-warehouse")
def assign_warehouse(
    user_id: int,
    req: AssignWarehouseRequest,
    current_user: User = Depends(require_roles([UserRole.ADMIN.value, UserRole.MANAGER.value])),
    db: Session = Depends(get_db)
):
    """Assign or unassign warehouse for a staff member."""
    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="Không tìm thấy người dùng.")

    if req.warehouse_id:
        wh = db.query(Warehouse).filter(Warehouse.id == req.warehouse_id).first()
        if not wh:
            raise HTTPException(status_code=400, detail="Kho không tồn tại.")
        wh_name = wh.name
    else:
        wh_name = "Tất cả các kho"

    target_user.warehouse_id = req.warehouse_id
    db.commit()

    log_audit(db, current_user.id, "ASSIGN_WAREHOUSE", "USER", str(user_id), f"Gán kho: {wh_name}")

    return {"success": True, "message": f"Đã gán kho cho nhân viên {target_user.username}: {wh_name}"}
