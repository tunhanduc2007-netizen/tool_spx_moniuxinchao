"""Shopee Synchronization Engine for Orders, Products, and Inventory."""

from datetime import datetime
import time
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from tool_spx.db.models import (
    ShopeeShop, ShopeeAppConfig, Order, OrderItem, Product, ProductSku,
    Inventory, Customer, Warehouse, ShopeeSyncLog, CustomerTier, OrderStatus
)
from tool_spx.security.encryption import decrypt_secret
from tool_spx.shopee.client import ShopeeClient

def get_shopee_client_for_shop(db: Session, shop: ShopeeShop) -> ShopeeClient:
    """Instantiate a ShopeeClient configured with app secrets and mock/live mode."""
    config = db.query(ShopeeAppConfig).first()
    if not config:
        config = ShopeeAppConfig(partner_id=1000001, mock_mode=True, is_configured=False)
        db.add(config)
        db.commit()

    partner_key = decrypt_secret(config.partner_key_encrypted) if config.partner_key_encrypted else ""
    return ShopeeClient(
        partner_id=config.partner_id,
        partner_key=partner_key,
        environment=config.api_environment,
        mock_mode=config.mock_mode or not bool(partner_key)
    )

def _update_customer_tier(customer: Customer):
    """Recalculate customer tier based on total spent."""
    spent = customer.total_spent
    if spent >= 30_000_000:
        customer.rank_tier = CustomerTier.VIP.value
    elif spent >= 15_000_000:
        customer.rank_tier = CustomerTier.PLATINUM.value
    elif spent >= 5_000_000:
        customer.rank_tier = CustomerTier.GOLD.value
    elif spent >= 1_000_000:
        customer.rank_tier = CustomerTier.SILVER.value
    else:
        customer.rank_tier = CustomerTier.BRONZE.value

async def sync_orders_for_shop(db: Session, shop_id_db: int, triggered_by: str = "MANUAL") -> Dict[str, Any]:
    """Sync orders from Shopee Open Platform to internal database."""
    shop = db.query(ShopeeShop).filter(ShopeeShop.id == shop_id_db).first()
    if not shop:
        return {"success": False, "message": "Shop không tồn tại"}

    client = get_shopee_client_for_shop(db, shop)
    access_token = decrypt_secret(shop.access_token_encrypted)

    now_ts = int(time.time())
    time_from = now_ts - (14 * 86400) # Past 14 days

    # 1. Fetch order list
    list_res = await client.get_order_list(
        shop_id=shop.shop_id,
        access_token=access_token,
        time_from=time_from,
        time_to=now_ts
    )

    if list_res.get("error"):
        error_msg = list_res.get("message", "Lỗi không xác định từ Shopee")
        shop.last_error = error_msg
        db.commit()
        # Log failure
        log = ShopeeSyncLog(
            shop_id=shop.id,
            sync_type="ORDERS",
            status="FAILED",
            records_processed=0,
            records_failed=1,
            details=error_msg,
            triggered_by=triggered_by
        )
        db.add(log)
        db.commit()
        return {"success": False, "message": error_msg}

    order_list_raw = list_res.get("response", {}).get("order_list", [])
    if not order_list_raw:
        return {"success": True, "message": "Không có đơn hàng mới nào cần đồng bộ", "synced_count": 0}

    order_sns = [o["order_sn"] for o in order_list_raw]

    # 2. Fetch order details in batch
    detail_res = await client.get_order_detail(
        shop_id=shop.shop_id,
        access_token=access_token,
        order_sn_list=order_sns
    )

    orders_data = detail_res.get("response", {}).get("order_list", [])

    # Default warehouse
    default_wh = db.query(Warehouse).filter(Warehouse.is_active == True).first()
    if not default_wh:
        default_wh = Warehouse(code="KHO-HN-01", name="Kho Tổng Hà Nội", address="Hà Nội", is_active=True)
        db.add(default_wh)
        db.commit()

    synced_count = 0
    for o_data in orders_data:
        order_sn = o_data.get("order_sn")
        existing_order = db.query(Order).filter(Order.order_sn == order_sn).first()

        # Handle Customer
        buyer_uid = o_data.get("buyer_user_id")
        recipient = o_data.get("recipient_address", {})
        customer_name = recipient.get("name") or o_data.get("buyer_username") or f"Khách hàng {buyer_uid}"
        customer_phone = recipient.get("phone", "")
        customer_addr = recipient.get("full_address", "")

        customer = None
        if buyer_uid:
            customer = db.query(Customer).filter(Customer.buyer_user_id == buyer_uid).first()
        if not customer and customer_phone:
            customer = db.query(Customer).filter(Customer.phone == customer_phone).first()

        if not customer:
            customer = Customer(
                buyer_user_id=buyer_uid,
                name=customer_name,
                phone=customer_phone,
                shipping_address=customer_addr,
                total_orders=0,
                total_spent=0.0
            )
            db.add(customer)
            db.flush()

        order_status = o_data.get("order_status", OrderStatus.READY_TO_SHIP.value)
        total_amount = float(o_data.get("total_amount", 0.0))
        carrier = o_data.get("shipping_carrier", "SPX Express")
        tracking_num = o_data.get("tracking_number", "")

        if not existing_order:
            # Create new order (Prevent duplicate!)
            new_order = Order(
                order_sn=order_sn,
                shop_id=shop.id,
                warehouse_id=default_wh.id,
                customer_id=customer.id,
                order_status=order_status,
                shipping_carrier=carrier,
                tracking_number=tracking_num,
                total_amount=total_amount,
                shipping_fee=float(o_data.get("shipping_fee", 0.0)),
                payment_method=o_data.get("payment_method", "ShopeePay"),
                is_printed=False,
                print_count=0
            )
            db.add(new_order)
            db.flush()

            # Add items
            for it in o_data.get("item_list", []):
                item_name = it.get("item_name", "Sản phẩm Shopee")
                model_name = it.get("model_name", "")
                qty = it.get("model_quantity_purchased", 1)
                price = float(it.get("model_discounted_price", 0.0))

                # Check if internal SKU exists
                sku_code = f"SKU-{it.get('item_id', 0)}-{it.get('model_id', 0)}"
                sku = db.query(ProductSku).filter(ProductSku.sku_code == sku_code).first()
                if not sku:
                    # Auto create product and SKU
                    prod = db.query(Product).filter(Product.spx_item_id == it.get("item_id")).first()
                    if not prod:
                        prod = Product(
                            spx_item_id=it.get("item_id"),
                            shop_id=shop.id,
                            name=item_name
                        )
                        db.add(prod)
                        db.flush()
                    sku = ProductSku(
                        product_id=prod.id,
                        sku_code=sku_code,
                        model_id=it.get("model_id"),
                        name=f"{item_name} - {model_name}" if model_name else item_name,
                        selling_price=price,
                        cost_price=price * 0.6
                    )
                    db.add(sku)
                    db.flush()

                    # Create default inventory
                    inv = Inventory(
                        sku_id=sku.id,
                        warehouse_id=default_wh.id,
                        quantity=100,
                        safety_stock=10
                    )
                    db.add(inv)

                order_item = OrderItem(
                    order_id=new_order.id,
                    sku_id=sku.id,
                    item_name=item_name,
                    model_name=model_name,
                    shopee_item_id=it.get("item_id"),
                    shopee_model_id=it.get("model_id"),
                    quantity=qty,
                    item_price=price
                )
                db.add(order_item)

            # Update customer totals
            customer.total_orders += 1
            customer.total_spent += total_amount
            customer.loyalty_points += int(total_amount / 1000)
            _update_customer_tier(customer)
            synced_count += 1
        else:
            # Update status if changed
            existing_order.order_status = order_status
            if tracking_num:
                existing_order.tracking_number = tracking_num
            synced_count += 1

    shop.last_sync_at = datetime.utcnow()
    shop.last_error = None

    # Log success
    log = ShopeeSyncLog(
        shop_id=shop.id,
        sync_type="ORDERS",
        status="SUCCESS",
        records_processed=synced_count,
        records_failed=0,
        details=f"Đã đồng bộ {synced_count} đơn hàng từ Shopee",
        triggered_by=triggered_by
    )
    db.add(log)
    db.commit()

    return {"success": True, "message": f"Đã đồng bộ thành công {synced_count} đơn hàng", "synced_count": synced_count}

async def sync_products_for_shop(db: Session, shop_id_db: int, triggered_by: str = "MANUAL") -> Dict[str, Any]:
    """Sync product catalog from Shopee to internal database."""
    shop = db.query(ShopeeShop).filter(ShopeeShop.id == shop_id_db).first()
    if not shop:
        return {"success": False, "message": "Shop không tồn tại"}

    client = get_shopee_client_for_shop(db, shop)
    access_token = decrypt_secret(shop.access_token_encrypted)

    item_res = await client.get_item_list(shop_id=shop.shop_id, access_token=access_token)
    if item_res.get("error"):
        error_msg = item_res.get("message", "Lỗi lấy danh sách sản phẩm Shopee")
        log = ShopeeSyncLog(
            shop_id=shop.id,
            sync_type="PRODUCTS",
            status="FAILED",
            records_processed=0,
            records_failed=1,
            details=error_msg,
            triggered_by=triggered_by
        )
        db.add(log)
        db.commit()
        return {"success": False, "message": error_msg}

    raw_items = item_res.get("response", {}).get("item", [])
    if not raw_items:
        return {"success": True, "message": "Không có sản phẩm nào", "synced_count": 0}

    item_ids = [it["item_id"] for it in raw_items]
    base_res = await client.get_item_base_info(
        shop_id=shop.shop_id,
        access_token=access_token,
        item_id_list=item_ids
    )

    items_data = base_res.get("response", {}).get("item_list", [])
    default_wh = db.query(Warehouse).filter(Warehouse.is_active == True).first()

    synced_count = 0
    for it_data in items_data:
        spx_id = it_data.get("item_id")
        prod = db.query(Product).filter(Product.spx_item_id == spx_id).first()
        name = it_data.get("item_name", f"Sản phẩm {spx_id}")
        image_url = ""
        img_list = it_data.get("image", {}).get("image_url_list", [])
        if img_list:
            image_url = img_list[0]

        price_info = it_data.get("price_info", [{}])[0]
        selling_price = price_info.get("current_price", 100000.0)

        if not prod:
            prod = Product(
                spx_item_id=spx_id,
                shop_id=shop.id,
                name=name,
                image_url=image_url,
                item_status=it_data.get("item_status", "NORMAL")
            )
            db.add(prod)
            db.flush()

            # Create default SKU
            sku_code = f"SPX-SKU-{spx_id}"
            sku = ProductSku(
                product_id=prod.id,
                sku_code=sku_code,
                name=f"{name} (Chuẩn)",
                selling_price=selling_price,
                cost_price=selling_price * 0.6
            )
            db.add(sku)
            db.flush()

            if default_wh:
                inv = Inventory(
                    sku_id=sku.id,
                    warehouse_id=default_wh.id,
                    quantity=80,
                    safety_stock=10
                )
                db.add(inv)
        else:
            prod.name = name
            if image_url:
                prod.image_url = image_url

        synced_count += 1

    log = ShopeeSyncLog(
        shop_id=shop.id,
        sync_type="PRODUCTS",
        status="SUCCESS",
        records_processed=synced_count,
        records_failed=0,
        details=f"Đã đồng bộ {synced_count} sản phẩm",
        triggered_by=triggered_by
    )
    db.add(log)
    db.commit()

    return {"success": True, "message": f"Đã đồng bộ {synced_count} sản phẩm thành công", "synced_count": synced_count}
