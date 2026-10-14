"""Product Catalog and SKU Management API router."""

from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from tool_spx.db.session import get_db
from tool_spx.db.models import Product, ProductSku, Inventory, Warehouse, ShopeeShop, User
from tool_spx.security.auth import get_current_user, require_roles, log_audit
from tool_spx.shopee.sync_service import get_shopee_client_for_shop
from tool_spx.security.encryption import decrypt_secret

router = APIRouter(prefix="/api/products", tags=["Products & SKUs"])

class CreateProductRequest(BaseModel):
    name: str
    category_name: str = "Thời trang & Phụ kiện"
    image_url: Optional[str] = None
    sku_code: str
    sku_name: str
    barcode: Optional[str] = None
    cost_price: float
    selling_price: float
    initial_stock: int = 50

class UpdateSkuRequest(BaseModel):
    sku_name: str
    cost_price: float
    selling_price: float
    barcode: Optional[str] = None

@router.get("")
def list_products(
    search: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List products with internal SKUs and stock across all warehouses."""
    query = db.query(Product)
    if search:
        search_fmt = f"%{search.strip()}%"
        query = query.filter(Product.name.ilike(search_fmt))

    products = query.order_by(Product.id.desc()).all()
    results = []

    for p in products:
        skus_data = []
        for s in p.skus:
            total_stock = sum(inv.quantity for inv in s.inventories)
            skus_data.append({
                "id": s.id,
                "sku_code": s.sku_code,
                "model_id": s.model_id,
                "name": s.name,
                "barcode": s.barcode or "Chưa tạo",
                "cost_price": s.cost_price,
                "selling_price": s.selling_price,
                "total_stock": total_stock,
                "inventories": [
                    {
                        "warehouse_name": inv.warehouse.name,
                        "quantity": inv.quantity,
                        "safety_stock": inv.safety_stock,
                        "is_low_stock": inv.quantity <= inv.safety_stock
                    }
                    for inv in s.inventories
                ]
            })

        results.append({
            "id": p.id,
            "spx_item_id": p.spx_item_id or "Chưa liên kết",
            "shop_name": p.shop.shop_name if p.shop else "Nội bộ",
            "name": p.name,
            "category_name": p.category_name,
            "image_url": p.image_url or "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300",
            "item_status": p.item_status,
            "skus": skus_data
        })

    return {"success": True, "products": results}

@router.post("/create")
def create_product(
    req: CreateProductRequest,
    current_user: User = Depends(require_roles(["ADMIN", "MANAGER"])),
    db: Session = Depends(get_db)
):
    """Create a new product with default SKU and initial warehouse stock."""
    if db.query(ProductSku).filter(ProductSku.sku_code == req.sku_code).first():
        raise HTTPException(status_code=400, detail="Mã SKU này đã tồn tại trong hệ thống.")

    default_wh = db.query(Warehouse).filter(Warehouse.is_active == True).first()
    default_shop = db.query(ShopeeShop).first()

    prod = Product(
        name=req.name,
        category_name=req.category_name,
        image_url=req.image_url,
        shop_id=default_shop.id if default_shop else None
    )
    db.add(prod)
    db.flush()

    sku = ProductSku(
        product_id=prod.id,
        sku_code=req.sku_code,
        name=req.sku_name,
        barcode=req.barcode,
        cost_price=req.cost_price,
        selling_price=req.selling_price
    )
    db.add(sku)
    db.flush()

    if default_wh:
        inv = Inventory(
            sku_id=sku.id,
            warehouse_id=default_wh.id,
            quantity=req.initial_stock,
            safety_stock=10
        )
        db.add(inv)

    db.commit()

    log_audit(db, current_user.id, "CREATE_PRODUCT", "PRODUCT", str(prod.id), f"Tạo sản phẩm {prod.name} (SKU: {req.sku_code})")

    return {"success": True, "message": f"Đã tạo thành công sản phẩm {prod.name}."}

@router.put("/skus/{sku_id}")
def update_sku(
    sku_id: int,
    req: UpdateSkuRequest,
    current_user: User = Depends(require_roles(["ADMIN", "MANAGER"])),
    db: Session = Depends(get_db)
):
    """Update SKU pricing and barcode."""
    sku = db.query(ProductSku).filter(ProductSku.id == sku_id).first()
    if not sku:
        raise HTTPException(status_code=404, detail="Không tìm thấy SKU.")

    sku.name = req.sku_name
    sku.cost_price = req.cost_price
    sku.selling_price = req.selling_price
    if req.barcode:
        sku.barcode = req.barcode

    db.commit()

    log_audit(db, current_user.id, "UPDATE_SKU", "SKU", sku.sku_code, f"Cập nhật giá bán: {req.selling_price}")

    return {"success": True, "message": f"Đã cập nhật SKU {sku.sku_code} thành công."}

@router.post("/skus/{sku_id}/push-stock")
async def push_sku_stock_to_shopee(
    sku_id: int,
    current_user: User = Depends(require_roles(["ADMIN", "MANAGER", "WAREHOUSE_STAFF"])),
    db: Session = Depends(get_db)
):
    """Push local warehouse stock to Shopee Open Platform via update_stock API."""
    sku = db.query(ProductSku).filter(ProductSku.id == sku_id).first()
    if not sku or not sku.product:
        raise HTTPException(status_code=404, detail="Không tìm thấy SKU.")

    prod = sku.product
    if not prod.spx_item_id or not prod.shop:
        raise HTTPException(status_code=400, detail="Sản phẩm chưa liên kết với Shopee Shop.")

    total_stock = sum(inv.quantity for inv in sku.inventories)
    client = get_shopee_client_for_shop(db, prod.shop)
    access_token = decrypt_secret(prod.shop.access_token_encrypted)

    stock_list = [{"model_id": sku.model_id or 0, "normal_stock": total_stock}]
    res = await client.update_stock(
        shop_id=prod.shop.shop_id,
        access_token=access_token,
        item_id=prod.spx_item_id,
        stock_list=stock_list
    )

    if res.get("error"):
        raise HTTPException(status_code=400, detail=res.get("message", "Lỗi cập nhật tồn kho Shopee"))

    log_audit(db, current_user.id, "PUSH_STOCK_SHOPEE", "SKU", sku.sku_code, f"Đẩy tồn kho {total_stock} lên Shopee Item {prod.spx_item_id}")

    return {
        "success": True,
        "message": f"Đã đồng bộ tồn kho ({total_stock}) của SKU {sku.sku_code} lên Shopee thành công!",
        "item_id": prod.spx_item_id,
        "stock": total_stock
    }
