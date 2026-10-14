"""Order Management API router."""

from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session
from tool_spx.db.session import get_db
from tool_spx.db.models import Order, OrderItem, OrderStatus, User, UserRole, StockMovement, Inventory
from tool_spx.security.auth import get_current_user, require_roles, log_audit

router = APIRouter(prefix="/api/orders", tags=["Order Management"])

class UpdateOrderStatusRequest(BaseModel):
    order_status: str
    cancel_reason: Optional[str] = None

class AssignStaffRequest(BaseModel):
    staff_id: int

@router.get("")
def list_orders(
    status: Optional[str] = None,
    search: Optional[str] = None,
    is_printed: Optional[bool] = None,
    warehouse_id: Optional[int] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve orders with filters and pagination."""
    query = db.query(Order)

    # Filter by user warehouse if user is warehouse staff
    if current_user.role == UserRole.WAREHOUSE_STAFF.value and current_user.warehouse_id:
        query = query.filter(Order.warehouse_id == current_user.warehouse_id)
    elif warehouse_id:
        query = query.filter(Order.warehouse_id == warehouse_id)

    if status and status != "ALL":
        query = query.filter(Order.order_status == status)

    if is_printed is not None:
        query = query.filter(Order.is_printed == is_printed)

    if search:
        search_fmt = f"%{search.strip()}%"
        query = query.filter(
            (Order.order_sn.ilike(search_fmt)) |
            (Order.tracking_number.ilike(search_fmt))
        )

    total_count = query.count()
    orders = query.order_by(Order.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()

    items = []
    for o in orders:
        items.append({
            "id": o.id,
            "order_sn": o.order_sn,
            "shop_name": o.shop.shop_name if o.shop else "",
            "warehouse_name": o.warehouse.name if o.warehouse else "",
            "customer_name": o.customer.name if o.customer else "Khách vãng lai",
            "customer_phone": o.customer.phone if o.customer else "",
            "customer_tier": o.customer.rank_tier if o.customer else "BRONZE",
            "order_status": o.order_status,
            "shipping_carrier": o.shipping_carrier,
            "tracking_number": o.tracking_number or "Chưa tạo mã",
            "total_amount": o.total_amount,
            "shipping_fee": o.shipping_fee,
            "payment_method": o.payment_method,
            "is_printed": o.is_printed,
            "print_count": o.print_count,
            "assigned_staff_name": o.assigned_staff.full_name if o.assigned_staff else "Chưa gán",
            "items_count": len(o.items),
            "created_at": o.created_at.strftime("%d/%m/%Y %H:%M") if o.created_at else ""
        })

    return {
        "success": True,
        "total": total_count,
        "page": page,
        "page_size": page_size,
        "orders": items
    }

@router.get("/{order_id}")
def get_order_detail(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve complete order details including items and customer."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn hàng.")

    items_data = []
    for it in order.items:
        items_data.append({
            "id": it.id,
            "sku_id": it.sku_id,
            "sku_code": it.sku.sku_code if it.sku else "N/A",
            "item_name": it.item_name,
            "model_name": it.model_name,
            "quantity": it.quantity,
            "item_price": it.item_price,
            "total_price": it.quantity * it.item_price
        })

    return {
        "success": True,
        "order": {
            "id": order.id,
            "order_sn": order.order_sn,
            "shop_name": order.shop.shop_name if order.shop else "",
            "warehouse_name": order.warehouse.name if order.warehouse else "",
            "customer": {
                "id": order.customer.id if order.customer else None,
                "name": order.customer.name if order.customer else "",
                "phone": order.customer.phone if order.customer else "",
                "address": order.customer.shipping_address if order.customer else "",
                "rank_tier": order.customer.rank_tier if order.customer else "BRONZE"
            },
            "order_status": order.order_status,
            "shipping_carrier": order.shipping_carrier,
            "tracking_number": order.tracking_number,
            "total_amount": order.total_amount,
            "shipping_fee": order.shipping_fee,
            "payment_method": order.payment_method,
            "is_printed": order.is_printed,
            "print_count": order.print_count,
            "printed_at": order.printed_at.strftime("%d/%m/%Y %H:%M") if order.printed_at else None,
            "packed_at": order.packed_at.strftime("%d/%m/%Y %H:%M") if order.packed_at else None,
            "assigned_staff_id": order.assigned_staff_id,
            "assigned_staff_name": order.assigned_staff.full_name if order.assigned_staff else None,
            "cancel_reason": order.cancel_reason,
            "created_at": order.created_at.strftime("%d/%m/%Y %H:%M") if order.created_at else "",
            "items": items_data
        }
    }

@router.put("/{order_id}/status")
def update_order_status(
    order_id: int,
    req: UpdateOrderStatusRequest,
    current_user: User = Depends(require_roles(["ADMIN", "MANAGER", "WAREHOUSE_STAFF"])),
    db: Session = Depends(get_db)
):
    """Update order status."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn hàng.")

    valid_statuses = [s.value for s in OrderStatus]
    if req.order_status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Trạng thái không hợp lệ. Chọn: {valid_statuses}")

    old_status = order.order_status
    order.order_status = req.order_status
    if req.cancel_reason:
        order.cancel_reason = req.cancel_reason

    # If transitioning to PROCESSED / PACKED
    if req.order_status == OrderStatus.PROCESSED.value and not order.packed_at:
        order.packed_at = datetime.utcnow()
        order.packed_by = current_user.id

    db.commit()

    log_audit(db, current_user.id, "UPDATE_ORDER_STATUS", "ORDER", order.order_sn, f"Đổi trạng thái từ {old_status} sang {req.order_status}")

    return {"success": True, "message": f"Đã cập nhật trạng thái đơn {order.order_sn} thành {req.order_status}."}

@router.put("/{order_id}/assign-staff")
def assign_order_staff(
    order_id: int,
    req: AssignStaffRequest,
    current_user: User = Depends(require_roles(["ADMIN", "MANAGER"])),
    db: Session = Depends(get_db)
):
    """Assign packing staff to an order."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn hàng.")

    staff = db.query(User).filter(User.id == req.staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Không tìm thấy nhân viên.")

    order.assigned_staff_id = staff.id
    db.commit()

    log_audit(db, current_user.id, "ASSIGN_STAFF_ORDER", "ORDER", order.order_sn, f"Gán nhân viên {staff.full_name} xử lý đơn")

    return {"success": True, "message": f"Đã gán đơn {order.order_sn} cho nhân viên {staff.full_name}."}
