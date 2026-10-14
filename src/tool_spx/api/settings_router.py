"""System Settings and Audit Trail API router."""

from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from tool_spx.db.session import get_db
from tool_spx.db.models import SystemSetting, AuditLog, User
from tool_spx.security.auth import get_current_user, require_admin, log_audit

router = APIRouter(prefix="/api/settings", tags=["System Settings & Audit"])

class UpdateSettingsRequest(BaseModel):
    settings: Dict[str, str]

@router.get("")
def get_all_settings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve all configurable system settings."""
    records = db.query(SystemSetting).all()
    results = {}
    for r in records:
        results[r.key] = {
            "value": r.value,
            "description": r.description,
            "updated_at": r.updated_at.strftime("%d/%m/%Y %H:%M") if r.updated_at else ""
        }
    return {"success": True, "settings": results}

@router.post("")
def update_settings(
    req: UpdateSettingsRequest,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Admin updates system settings."""
    for key, val in req.settings.items():
        setting = db.query(SystemSetting).filter(SystemSetting.key == key).first()
        if setting:
            setting.value = str(val)
        else:
            setting = SystemSetting(key=key, value=str(val))
            db.add(setting)

    db.commit()

    log_audit(db, current_user.id, "UPDATE_SYSTEM_SETTINGS", "SYSTEM", None, f"Cập nhật cài đặt hệ thống: {list(req.settings.keys())}")

    return {"success": True, "message": "Đã lưu cài đặt hệ thống thành công."}

@router.get("/audit-logs")
def list_audit_logs(
    action: Optional[str] = None,
    target_type: Optional[str] = None,
    limit: int = 50,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Retrieve audit trail timeline."""
    query = db.query(AuditLog)
    if action:
        query = query.filter(AuditLog.action == action)
    if target_type:
        query = query.filter(AuditLog.target_type == target_type)

    logs = query.order_by(AuditLog.created_at.desc()).limit(limit).all()
    results = []

    for l in logs:
        results.append({
            "id": l.id,
            "user_name": l.user.full_name if l.user else "Hệ thống",
            "action": l.action,
            "target_type": l.target_type,
            "target_id": l.target_id,
            "ip_address": l.ip_address or "Local",
            "details": l.details,
            "created_at": l.created_at.strftime("%d/%m/%Y %H:%M:%S") if l.created_at else ""
        })

    return {"success": True, "audit_logs": results}
