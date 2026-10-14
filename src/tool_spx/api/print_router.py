"""Label Pro & Batch Shipping Label Printing API router."""

from datetime import datetime
import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from tool_spx.db.session import get_db
from tool_spx.db.models import Order, ShippingLabelPrintJob, User, OrderStatus
from tool_spx.security.auth import get_current_user, require_roles, log_audit

router = APIRouter(prefix="/api/print", tags=["Batch Printing & Label Pro"])

class BatchPrintPreviewRequest(BaseModel):
    order_sns: List[str]
    paper_size: str = "THERMAL_100x150"  # or A4

class ConfirmPrintedRequest(BaseModel):
    order_sns: List[str]
    paper_size: str = "THERMAL_100x150"

@router.post("/batch-preview")
def get_batch_print_preview(
    req: BatchPrintPreviewRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate high-fidelity Label Pro thermal waybill preview data for selected orders."""
    if not req.order_sns:
        raise HTTPException(status_code=400, detail="Vui lòng chọn ít nhất 1 đơn hàng để in.")

    orders = db.query(Order).filter(Order.order_sn.in_(req.order_sns)).all()
    if not orders:
        raise HTTPException(status_code=404, detail="Không tìm thấy các đơn hàng đã chọn.")

    labels = []
    for o in orders:
        items_summary = []
        for it in o.items:
            items_summary.append({
                "item_name": it.item_name,
                "model_name": it.model_name or "Chuẩn",
                "quantity": it.quantity,
                "price": it.item_price
            })

        is_cod = "COD" in (o.payment_method or "").upper() or "KHI NHẬN" in (o.payment_method or "").upper()
        cod_amount = o.total_amount if is_cod else 0.0

        labels.append({
            "order_sn": o.order_sn,
            "tracking_number": o.tracking_number or f"SPX{o.order_sn[-8:]}VN",
            "shipping_carrier": o.shipping_carrier or "SPX Express",
            "shop_name": o.shop.shop_name if o.shop else "SPX Flagship Store",
            "sender": {
                "name": o.shop.shop_name if o.shop else "SPX Store",
                "phone": "024 3888 9999",
                "address": o.warehouse.address if o.warehouse else "Kho Tổng Hà Nội"
            },
            "recipient": {
                "name": o.customer.name if o.customer else "Khách nhận",
                "phone": o.customer.phone if o.customer else "",
                "address": o.customer.shipping_address if o.customer else "Theo địa chỉ hệ thống Shopee"
            },
            "total_amount": o.total_amount,
            "cod_amount": cod_amount,
            "is_cod": is_cod,
            "payment_method": o.payment_method,
            "items": items_summary,
            "sorting_code": f"VN-{o.order_sn[-4:]}-SPX",
            "created_date": o.created_at.strftime("%d/%m/%Y %H:%M") if o.created_at else "",
            "print_count": o.print_count + 1
        })

    return {
        "success": True,
        "total_labels": len(labels),
        "paper_size": req.paper_size,
        "labels": labels
    }

@router.post("/confirm-printed")
def confirm_batch_printed(
    req: ConfirmPrintedRequest,
    current_user: User = Depends(require_roles(["ADMIN", "MANAGER", "WAREHOUSE_STAFF"])),
    db: Session = Depends(get_db)
):
    """Mark orders as printed and record print history job."""
    if not req.order_sns:
        raise HTTPException(status_code=400, detail="Danh sách đơn rỗng.")

    orders = db.query(Order).filter(Order.order_sn.in_(req.order_sns)).all()
    now = datetime.utcnow()

    for o in orders:
        o.is_printed = True
        o.print_count += 1
        o.printed_at = now
        o.printed_by = current_user.id
        if o.order_status == OrderStatus.READY_TO_SHIP.value:
            o.order_status = OrderStatus.PROCESSED.value

    # Create Print Job Record
    batch_code = f"BATCH-{now.strftime('%Y%m%d%H%M%S')}"
    job = ShippingLabelPrintJob(
        batch_code=batch_code,
        paper_size=req.paper_size,
        total_orders=len(orders),
        order_sns_json=json.dumps(req.order_sns),
        status="COMPLETED",
        printed_by=current_user.id,
        created_at=now
    )
    db.add(job)
    db.commit()

    log_audit(db, current_user.id, "BATCH_PRINT_LABELS", "PRINT_JOB", batch_code, f"Đã in {len(orders)} vận đơn (Khổ {req.paper_size})")

    return {
        "success": True,
        "message": f"Đã xác nhận in thành công {len(orders)} vận đơn.",
        "batch_code": batch_code
    }

@router.get("/jobs")
def list_print_jobs(
    limit: int = 30,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve history of print jobs."""
    jobs = db.query(ShippingLabelPrintJob).order_by(ShippingLabelPrintJob.created_at.desc()).limit(limit).all()
    results = []
    for j in jobs:
        results.append({
            "id": j.id,
            "batch_code": j.batch_code,
            "paper_size": j.paper_size,
            "total_orders": j.total_orders,
            "printed_by_name": j.user.full_name if j.user else "Hệ thống",
            "status": j.status,
            "created_at": j.created_at.strftime("%d/%m/%Y %H:%M:%S") if j.created_at else ""
        })
    return {"success": True, "jobs": results}
