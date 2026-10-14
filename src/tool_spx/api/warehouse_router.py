"""Warehouse and Inventory Management API router."""

from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from tool_spx.db.session import get_db
from tool_spx.db.models import (
    Warehouse, Inventory, ProductSku, StockMovement,
    StockMovementType, User, UserRole
)
from tool_spx.security.auth import get_current_user, require_roles, log_audit

router = APIRouter(prefix="/api/warehouse", tags=["Warehouse & Inventory"])

class CreateWarehouseRequest(BaseModel):
    code: str
    name: str
    address: str
    phone: Optional[str] = None

class AdjustStockRequest(BaseModel):
    sku_id: int
    warehouse_id: int
    quantity_delta: int  # Can be positive or negative
    movement_type: str = StockMovementType.ADJUSTMENT.value
    notes: Optional[str] = None

class TransferStockRequest(BaseModel):
    sku_id: int
    from_warehouse_id: int
    to_warehouse_id: int
    quantity: int
    notes: Optional[str] = None

@router.get("/list")
def list_warehouses(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all warehouses with staff and inventory summary."""
    warehouses = db.query(Warehouse).all()
    results = []
    for wh in warehouses:
        total_items = sum(inv.quantity for inv in wh.inventories)
        low_stock_count = sum(1 for inv in wh.inventories if inv.quantity <= inv.safety_stock)
        results.append({
            "id": wh.id,
            "code": wh.code,
            "name": wh.name,
            "address": wh.address,
            "phone": wh.phone or "Chưa cập nhật",
            "is_active": wh.is_active,
            "total_items": total_items,
            "low_stock_count": low_stock_count,
            "staff_count": len(wh.staff_members)
        })
    return {"success": True, "warehouses": results}

@router.post("/create")
def create_warehouse(
    req: CreateWarehouseRequest,
    current_user: User = Depends(require_roles(["ADMIN", "MANAGER"])),
    db: Session = Depends(get_db)
):
    """Add a new warehouse."""
    if db.query(Warehouse).filter(Warehouse.code == req.code).first():
        raise HTTPException(status_code=400, detail="Mã kho này đã tồn tại.")

    wh = Warehouse(
        code=req.code,
        name=req.name,
        address=req.address,
        phone=req.phone,
        is_active=True
    )
    db.add(wh)
    db.commit()

    log_audit(db, current_user.id, "CREATE_WAREHOUSE", "WAREHOUSE", wh.code, f"Tạo kho mới: {wh.name}")

    return {"success": True, "message": f"Đã tạo kho {wh.name} thành công."}

@router.get("/inventory")
def list_inventory(
    warehouse_id: Optional[int] = None,
    low_stock_only: bool = False,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List stock levels per SKU with safety thresholds."""
    query = db.query(Inventory)
    if warehouse_id:
        query = query.filter(Inventory.warehouse_id == warehouse_id)

    if low_stock_only:
        query = query.filter(Inventory.quantity <= Inventory.safety_stock)

    inventories = query.all()
    results = []
    for inv in inventories:
        results.append({
            "id": inv.id,
            "sku_id": inv.sku_id,
            "sku_code": inv.sku.sku_code if inv.sku else "",
            "sku_name": inv.sku.name if inv.sku else "",
            "product_name": inv.sku.product.name if inv.sku and inv.sku.product else "",
            "warehouse_id": inv.warehouse_id,
            "warehouse_name": inv.warehouse.name if inv.warehouse else "",
            "quantity": inv.quantity,
            "reserved_quantity": inv.reserved_quantity,
            "available_quantity": max(0, inv.quantity - inv.reserved_quantity),
            "safety_stock": inv.safety_stock,
            "is_low_stock": inv.quantity <= inv.safety_stock,
            "cost_price": inv.sku.cost_price if inv.sku else 0.0,
            "selling_price": inv.sku.selling_price if inv.sku else 0.0,
            "total_value": inv.quantity * (inv.sku.cost_price if inv.sku else 0.0)
        })
    return {"success": True, "inventory": results}

@router.post("/inventory/adjust")
def adjust_inventory(
    req: AdjustStockRequest,
    current_user: User = Depends(require_roles(["ADMIN", "MANAGER", "WAREHOUSE_STAFF"])),
    db: Session = Depends(get_db)
):
    """Adjust stock level (+/-) with audit record."""
    inv = db.query(Inventory).filter(
        Inventory.sku_id == req.sku_id,
        Inventory.warehouse_id == req.warehouse_id
    ).first()

    if not inv:
        # Create inventory row if doesn't exist
        inv = Inventory(
            sku_id=req.sku_id,
            warehouse_id=req.warehouse_id,
            quantity=0,
            safety_stock=10
        )
        db.add(inv)
        db.flush()

    new_quantity = inv.quantity + req.quantity_delta
    if new_quantity < 0:
        raise HTTPException(status_code=400, detail="Số lượng tồn kho không thể âm.")

    inv.quantity = new_quantity

    movement = StockMovement(
        sku_id=req.sku_id,
        warehouse_id=req.warehouse_id,
        movement_type=req.movement_type,
        quantity_delta=req.quantity_delta,
        reference_id=f"ADJ-{inv.id}",
        notes=req.notes or "Điều chỉnh kiểm kê",
        user_id=current_user.id
    )
    db.add(movement)
    db.commit()

    log_audit(db, current_user.id, "ADJUST_STOCK", "INVENTORY", str(inv.id), f"Thay đổi tồn kho {req.quantity_delta:+} cho SKU {inv.sku.sku_code}")

    return {
        "success": True,
        "message": f"Đã cập nhật tồn kho thành công! Tồn kho hiện tại: {new_quantity}",
        "new_quantity": new_quantity
    }

@router.post("/inventory/transfer")
def transfer_inventory(
    req: TransferStockRequest,
    current_user: User = Depends(require_roles(["ADMIN", "MANAGER"])),
    db: Session = Depends(get_db)
):
    """Transfer stock between two warehouses."""
    if req.from_warehouse_id == req.to_warehouse_id:
        raise HTTPException(status_code=400, detail="Kho xuất và kho nhận phải khác nhau.")

    if req.quantity <= 0:
        raise HTTPException(status_code=400, detail="Số lượng chuyển phải lớn hơn 0.")

    from_inv = db.query(Inventory).filter(
        Inventory.sku_id == req.sku_id,
        Inventory.warehouse_id == req.from_warehouse_id
    ).first()

    if not from_inv or from_inv.quantity < req.quantity:
        raise HTTPException(status_code=400, detail="Số lượng tồn kho xuất không đủ để chuyển.")

    to_inv = db.query(Inventory).filter(
        Inventory.sku_id == req.sku_id,
        Inventory.warehouse_id == req.to_warehouse_id
    ).first()

    if not to_inv:
        to_inv = Inventory(sku_id=req.sku_id, warehouse_id=req.to_warehouse_id, quantity=0, safety_stock=10)
        db.add(to_inv)
        db.flush()

    from_inv.quantity -= req.quantity
    to_inv.quantity += req.quantity

    # Record two movements
    mov_out = StockMovement(
        sku_id=req.sku_id,
        warehouse_id=req.from_warehouse_id,
        movement_type=StockMovementType.TRANSFER.value,
        quantity_delta=-req.quantity,
        reference_id=f"TRANSFER-OUT-TO-{req.to_warehouse_id}",
        notes=req.notes or "Xuất chuyển kho",
        user_id=current_user.id
    )
    mov_in = StockMovement(
        sku_id=req.sku_id,
        warehouse_id=req.to_warehouse_id,
        movement_type=StockMovementType.TRANSFER.value,
        quantity_delta=req.quantity,
        reference_id=f"TRANSFER-IN-FROM-{req.from_warehouse_id}",
        notes=req.notes or "Nhập nhận từ chuyển kho",
        user_id=current_user.id
    )
    db.add_all([mov_out, mov_in])
    db.commit()

    log_audit(db, current_user.id, "TRANSFER_STOCK", "INVENTORY", str(req.sku_id), f"Chuyển {req.quantity} đơn vị từ kho {from_inv.warehouse.name} sang {to_inv.warehouse.name}")

    return {"success": True, "message": f"Đã chuyển {req.quantity} đơn vị thành công."}

@router.get("/movements")
def list_stock_movements(
    sku_id: Optional[int] = None,
    warehouse_id: Optional[int] = None,
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve audit history of all stock movements."""
    query = db.query(StockMovement)
    if sku_id:
        query = query.filter(StockMovement.sku_id == sku_id)
    if warehouse_id:
        query = query.filter(StockMovement.warehouse_id == warehouse_id)

    movements = query.order_by(StockMovement.created_at.desc()).limit(limit).all()
    results = []
    for m in movements:
        results.append({
            "id": m.id,
            "sku_code": m.sku.sku_code if m.sku else "",
            "sku_name": m.sku.name if m.sku else "",
            "warehouse_name": m.warehouse.name if m.warehouse else "",
            "movement_type": m.movement_type,
            "quantity_delta": m.quantity_delta,
            "reference_id": m.reference_id,
            "notes": m.notes,
            "user_name": m.user.full_name if m.user else "Hệ thống",
            "created_at": m.created_at.strftime("%d/%m/%Y %H:%M:%S") if m.created_at else ""
        })
    return {"success": True, "movements": results}
