"""Customer CRM and Ranking Tier Management API router."""

from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from tool_spx.db.session import get_db
from tool_spx.db.models import Customer, CustomerTier, Order, User
from tool_spx.security.auth import get_current_user, require_roles, log_audit

router = APIRouter(prefix="/api/customers", tags=["Customers & CRM"])

class UpdateCustomerNotesRequest(BaseModel):
    notes: str

@router.get("")
def list_customers(
    tier: Optional[str] = None,
    search: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List CRM customers with spend totals, loyalty points and tier."""
    query = db.query(Customer)
    if tier and tier != "ALL":
        query = query.filter(Customer.rank_tier == tier)

    if search:
        search_fmt = f"%{search.strip()}%"
        query = query.filter(
            (Customer.name.ilike(search_fmt)) |
            (Customer.phone.ilike(search_fmt)) |
            (Customer.email.ilike(search_fmt))
        )

    customers = query.order_by(Customer.total_spent.desc()).all()
    results = []

    for c in customers:
        results.append({
            "id": c.id,
            "buyer_user_id": c.buyer_user_id,
            "name": c.name,
            "phone": c.phone or "Chưa cập nhật",
            "email": c.email or "Chưa cập nhật",
            "shipping_address": c.shipping_address or "",
            "total_orders": c.total_orders,
            "total_spent": c.total_spent,
            "loyalty_points": c.loyalty_points,
            "rank_tier": c.rank_tier,
            "notes": c.notes or "",
            "created_at": c.created_at.strftime("%d/%m/%Y") if c.created_at else ""
        })

    return {"success": True, "customers": results}

@router.get("/rankings")
def get_customer_rankings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get customer tiers leaderboard and distribution statistics."""
    all_custs = db.query(Customer).order_by(Customer.total_spent.desc()).all()

    tier_policies = [
        {"tier": CustomerTier.VIP.value, "label": "VIP Kim Cương", "min_spend": 30_000_000, "perks": "Chiết khấu 10%, Quà tri ân sinh nhật, Miễn phí vận chuyển SPX toàn quốc, Ưu tiên giao hàng"},
        {"tier": CustomerTier.PLATINUM.value, "label": "Bạch Kim (Platinum)", "min_spend": 15_000_000, "perks": "Chiết khấu 7%, Tặng voucher 200k định kỳ mỗi tháng"},
        {"tier": CustomerTier.GOLD.value, "label": "Vàng (Gold)", "min_spend": 5_000_000, "perks": "Chiết khấu 5%, Tích lũy x1.5 điểm thưởng Shopee"},
        {"tier": CustomerTier.SILVER.value, "label": "Bạc (Silver)", "min_spend": 1_000_000, "perks": "Chiết khấu 3%, Quà tặng đơn hàng đầu tiên trong tháng"},
        {"tier": CustomerTier.BRONZE.value, "label": "Đồng (Bronze)", "min_spend": 0, "perks": "Tích lũy 1 điểm cho mỗi 1.000đ chi tiêu"}
    ]

    tier_counts = {t["tier"]: 0 for t in tier_policies}
    leaderboard = []

    for idx, c in enumerate(all_custs):
        tier_counts[c.rank_tier] = tier_counts.get(c.rank_tier, 0) + 1
        if idx < 10:  # Top 10
            leaderboard.append({
                "rank": idx + 1,
                "name": c.name,
                "phone": f"{c.phone[:4]}***{c.phone[-3:]}" if c.phone and len(c.phone) >= 7 else c.phone,
                "total_orders": c.total_orders,
                "total_spent": c.total_spent,
                "loyalty_points": c.loyalty_points,
                "rank_tier": c.rank_tier
            })

    return {
        "success": True,
        "tier_policies": tier_policies,
        "tier_distribution": tier_counts,
        "top_customers": leaderboard,
        "total_customers": len(all_custs)
    }

@router.get("/{customer_id}")
def get_customer_detail(
    customer_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve single customer profile with all order history."""
    cust = db.query(Customer).filter(Customer.id == customer_id).first()
    if not cust:
        raise HTTPException(status_code=404, detail="Không tìm thấy khách hàng.")

    orders = db.query(Order).filter(Order.customer_id == cust.id).order_by(Order.created_at.desc()).all()
    orders_data = []
    for o in orders:
        orders_data.append({
            "id": o.id,
            "order_sn": o.order_sn,
            "order_status": o.order_status,
            "total_amount": o.total_amount,
            "tracking_number": o.tracking_number,
            "created_at": o.created_at.strftime("%d/%m/%Y %H:%M") if o.created_at else ""
        })

    return {
        "success": True,
        "customer": {
            "id": cust.id,
            "name": cust.name,
            "phone": cust.phone,
            "email": cust.email,
            "shipping_address": cust.shipping_address,
            "total_orders": cust.total_orders,
            "total_spent": cust.total_spent,
            "loyalty_points": cust.loyalty_points,
            "rank_tier": cust.rank_tier,
            "notes": cust.notes,
            "orders": orders_data
        }
    }

@router.put("/{customer_id}/notes")
def update_customer_notes(
    customer_id: int,
    req: UpdateCustomerNotesRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update CRM staff notes for a customer."""
    cust = db.query(Customer).filter(Customer.id == customer_id).first()
    if not cust:
        raise HTTPException(status_code=404, detail="Không tìm thấy khách hàng.")

    cust.notes = req.notes
    db.commit()

    log_audit(db, current_user.id, "UPDATE_CUSTOMER_NOTES", "CUSTOMER", str(cust.id), f"Ghi chú khách hàng {cust.name}")

    return {"success": True, "message": "Đã lưu ghi chú khách hàng thành công."}
