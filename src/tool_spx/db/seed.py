"""Initial Database Seeder for Shopee Seller Pro."""

from datetime import datetime, timedelta
from tool_spx.db.session import engine, SessionLocal, Base
from tool_spx.db.models import (
    User, UserRole, Warehouse, Product, ProductSku, Inventory,
    Customer, CustomerTier, Order, OrderItem, OrderStatus,
    ShopeeAppConfig, ShopeeShop, SystemSetting
)
from tool_spx.security.auth import hash_password
from tool_spx.security.encryption import encrypt_secret

def seed_database():
    """Create all tables and seed realistic production initial data."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. System Settings
        if not db.query(SystemSetting).filter(SystemSetting.key == "store_name").first():
            settings_list = [
                SystemSetting(key="store_name", value="Shopee Seller Pro Flagship", description="Tên chuỗi cửa hàng"),
                SystemSetting(key="allow_registration", value="true", description="Cho phép người dùng tự đăng ký"),
                SystemSetting(key="default_label_format", value="THERMAL_100x150", description="Mẫu in vận đơn mặc định"),
                SystemSetting(key="auto_sync_interval", value="15", description="Chu kỳ tự động đồng bộ (phút)"),
                SystemSetting(key="low_stock_threshold", value="15", description="Ngưỡng cảnh báo tồn kho thấp"),
            ]
            db.add_all(settings_list)

        # 2. Default Warehouses
        wh_hn = db.query(Warehouse).filter(Warehouse.code == "KHO-HN-01").first()
        if not wh_hn:
            wh_hn = Warehouse(
                code="KHO-HN-01",
                name="Kho Tổng Hà Nội (Hoàng Mai)",
                address="Số 88 Ngõ 192 Lê Trọng Tấn, Quận Hoàng Mai, Hà Nội",
                phone="024 3888 9999",
                is_active=True
            )
            db.add(wh_hn)
            db.flush()

        wh_hcm = db.query(Warehouse).filter(Warehouse.code == "KHO-HCM-01").first()
        if not wh_hcm:
            wh_hcm = Warehouse(
                code="KHO-HCM-01",
                name="Kho Trung Chuyển TP.HCM (Tân Bình)",
                address="Số 120 Đường Cộng Hòa, Phường 12, Quận Tân Bình, TP.HCM",
                phone="028 3999 8888",
                is_active=True
            )
            db.add(wh_hcm)
            db.flush()

        # 3. Default Users & Staff
        admin = db.query(User).filter(User.username == "admin").first()
        if not admin:
            admin = User(
                username="admin",
                email="tunhanduc2007@gmail.com",
                full_name="Quản Trị Viên (Admin)",
                hashed_password=hash_password("Admin@123456"),
                role=UserRole.ADMIN.value,
                is_active=True,
                warehouse_id=wh_hn.id
            )
            db.add(admin)

        staff_wh = db.query(User).filter(User.username == "kho_hanoi").first()
        if not staff_wh:
            staff_wh = User(
                username="kho_hanoi",
                email="kho_hanoi@shopeepro.local",
                full_name="Nguyễn Văn Kho",
                hashed_password=hash_password("Staff@123456"),
                role=UserRole.WAREHOUSE_STAFF.value,
                is_active=True,
                warehouse_id=wh_hn.id
            )
            db.add(staff_wh)

        sales_user = db.query(User).filter(User.username == "sales_hn").first()
        if not sales_user:
            sales_user = User(
                username="sales_hn",
                email="sales@shopeepro.local",
                full_name="Trần Thị Bán Hàng",
                hashed_password=hash_password("Sales@123456"),
                role=UserRole.SALES.value,
                is_active=True,
                warehouse_id=wh_hn.id
            )
            db.add(sales_user)
        db.flush()

        # 4. Shopee App Config
        app_cfg = db.query(ShopeeAppConfig).first()
        if not app_cfg:
            app_cfg = ShopeeAppConfig(
                partner_id=1008291,
                partner_key_encrypted=encrypt_secret("spk_live_shopee_secret_master_key_88"),
                api_environment="live",
                redirect_url="http://127.0.0.1:8000/api/shopee/callback",
                mock_mode=True,
                is_configured=True
            )
            db.add(app_cfg)
            db.flush()

        # 5. Shopee Authorized Shop
        shop = db.query(ShopeeShop).filter(ShopeeShop.shop_id == 8829104).first()
        if not shop:
            shop = ShopeeShop(
                shop_id=8829104,
                shop_name="SPX Official Flagship Store VN",
                region="VN",
                access_token_encrypted=encrypt_secret("shopee_access_token_sample_8829104"),
                refresh_token_encrypted=encrypt_secret("shopee_refresh_token_sample_8829104"),
                token_expires_at=datetime.utcnow() + timedelta(days=15),
                is_connected=True,
                last_sync_at=datetime.utcnow()
            )
            db.add(shop)
            db.flush()

        # 6. Sample Products, SKUs & Inventory
        if db.query(Product).count() == 0:
            sample_products = [
                {
                    "item_id": 10001,
                    "name": "Áo Thun Cotton Nam Cao Cấp SPX Pro Form Rộng",
                    "category": "Thời trang Nam",
                    "image": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500",
                    "skus": [
                        {"code": "AT-DEN-M", "name": "Đen / Size M", "cost": 65000, "price": 149000, "barcode": "893850100101"},
                        {"code": "AT-DEN-L", "name": "Đen / Size L", "cost": 65000, "price": 149000, "barcode": "893850100102"},
                        {"code": "AT-TRANG-L", "name": "Trắng / Size L", "cost": 65000, "price": 149000, "barcode": "893850100103"},
                    ]
                },
                {
                    "item_id": 10002,
                    "name": "Bình Giữ Nhiệt Inox 316 Cao Cấp 800ml Khắc Tên",
                    "category": "Gia dụng & Đời sống",
                    "image": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500",
                    "skus": [
                        {"code": "BGN-XANH-800", "name": "Xanh Navy 800ml", "cost": 95000, "price": 229000, "barcode": "893850200201"},
                        {"code": "BGN-BAC-800", "name": "Bạc Ánh Kim 800ml", "cost": 95000, "price": 229000, "barcode": "893850200202"},
                    ]
                },
                {
                    "item_id": 10003,
                    "name": "Tai Nghe Bluetooth Không Dây SPX Wireless Pro",
                    "category": "Thiết bị Điện tử",
                    "image": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500",
                    "skus": [
                        {"code": "TN-PRO-BLACK", "name": "Đen Nhám Chống Ồn", "cost": 180000, "price": 389000, "barcode": "893850300301"},
                        {"code": "TN-PRO-WHITE", "name": "Trắng Tinh Khôi", "cost": 180000, "price": 389000, "barcode": "893850300302"},
                    ]
                },
                {
                    "item_id": 10004,
                    "name": "Balo Laptop Chống Nước Đa Năng Có Cổng Sạc USB",
                    "category": "Túi & Balo",
                    "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
                    "skus": [
                        {"code": "BALO-LAP-DEN", "name": "Balo Đen Công Sở", "cost": 120000, "price": 299000, "barcode": "893850400401"},
                    ]
                }
            ]

            for p_info in sample_products:
                prod = Product(
                    spx_item_id=p_info["item_id"],
                    shop_id=shop.id,
                    name=p_info["name"],
                    category_name=p_info["category"],
                    image_url=p_info["image"]
                )
                db.add(prod)
                db.flush()

                for s_info in p_info["skus"]:
                    sku = ProductSku(
                        product_id=prod.id,
                        sku_code=s_info["code"],
                        name=s_info["name"],
                        cost_price=s_info["cost"],
                        selling_price=s_info["price"],
                        barcode=s_info["barcode"]
                    )
                    db.add(sku)
                    db.flush()

                    # Add stock in both warehouses
                    inv_hn = Inventory(
                        sku_id=sku.id,
                        warehouse_id=wh_hn.id,
                        quantity=85,
                        safety_stock=15
                    )
                    inv_hcm = Inventory(
                        sku_id=sku.id,
                        warehouse_id=wh_hcm.id,
                        quantity=45,
                        safety_stock=10
                    )
                    db.add_all([inv_hn, inv_hcm])

        # 7. Sample Customers with Tiers
        if db.query(Customer).count() == 0:
            customers = [
                Customer(
                    buyer_user_id=892011,
                    name="Hoàng Minh Tuấn",
                    phone="0912345678",
                    email="tuan.hm@gmail.com",
                    shipping_address="Số 45 Phố Huế, Phường Hàng Bài, Hoàn Kiếm, Hà Nội",
                    total_orders=14,
                    total_spent=32500000.0,
                    loyalty_points=32500,
                    rank_tier=CustomerTier.VIP.value,
                    notes="Khách hàng thân thiết VIP, thường mua số lượng lớn cho công ty"
                ),
                Customer(
                    buyer_user_id=892012,
                    name="Lê Thị Thanh Mai",
                    phone="0988776655",
                    email="maile.thanh@gmail.com",
                    shipping_address="Chung cư Vinhomes Central Park, Bình Thạnh, TP.HCM",
                    total_orders=8,
                    total_spent=16200000.0,
                    loyalty_points=16200,
                    rank_tier=CustomerTier.PLATINUM.value,
                    notes="Giao hàng buổi sáng, kiểm tra kỹ bao bì"
                ),
                Customer(
                    buyer_user_id=892013,
                    name="Vũ Đức Anh",
                    phone="0971239988",
                    email="ducanh.vu@yahoo.com",
                    shipping_address="Tòa nhà Keangnam Landmark 72, Nam Từ Liêm, Hà Nội",
                    total_orders=4,
                    total_spent=6800000.0,
                    loyalty_points=6800,
                    rank_tier=CustomerTier.GOLD.value
                ),
                Customer(
                    buyer_user_id=892014,
                    name="Phạm Thu Hà",
                    phone="0905123456",
                    shipping_address="Đường 2/9, Quận Hải Châu, Đà Nẵng",
                    total_orders=2,
                    total_spent=2450000.0,
                    loyalty_points=2450,
                    rank_tier=CustomerTier.SILVER.value
                ),
                Customer(
                    buyer_user_id=892015,
                    name="Đỗ Gia Huy",
                    phone="0933221144",
                    shipping_address="Số 15 Lê Văn Sỹ, Quận 3, TP.HCM",
                    total_orders=1,
                    total_spent=450000.0,
                    loyalty_points=450,
                    rank_tier=CustomerTier.BRONZE.value
                )
            ]
            db.add_all(customers)
            db.flush()

        # 8. Sample Orders for Batch Printing & Management Demo
        if db.query(Order).count() == 0:
            c1 = db.query(Customer).first()
            first_sku = db.query(ProductSku).first()

            orders_init = [
                {
                    "sn": "261014SPX001VN",
                    "status": OrderStatus.READY_TO_SHIP.value,
                    "tracking": "SPX093847291VN",
                    "carrier": "SPX Express",
                    "total": 298000.0,
                    "ship_fee": 22000.0,
                    "pay": "ShopeePay",
                    "printed": False,
                    "print_count": 0
                },
                {
                    "sn": "261014SPX002VN",
                    "status": OrderStatus.READY_TO_SHIP.value,
                    "tracking": "SPX093847292VN",
                    "carrier": "SPX Express",
                    "total": 458000.0,
                    "ship_fee": 25000.0,
                    "pay": "Thanh toán khi nhận hàng (COD)",
                    "printed": False,
                    "print_count": 0
                },
                {
                    "sn": "261014SPX003VN",
                    "status": OrderStatus.READY_TO_SHIP.value,
                    "tracking": "SPX093847293VN",
                    "carrier": "SPX Express",
                    "total": 389000.0,
                    "ship_fee": 0.0,
                    "pay": "Ví ShopeePay",
                    "printed": False,
                    "print_count": 0
                },
                {
                    "sn": "261014SPX004VN",
                    "status": OrderStatus.PROCESSED.value,
                    "tracking": "SPX093847294VN",
                    "carrier": "SPX Express",
                    "total": 688000.0,
                    "ship_fee": 30000.0,
                    "pay": "Thẻ tín dụng Visa",
                    "printed": True,
                    "print_count": 1
                },
                {
                    "sn": "261014SPX005VN",
                    "status": OrderStatus.SHIPPED.value,
                    "tracking": "SPX093847295VN",
                    "carrier": "SPX Express",
                    "total": 149000.0,
                    "ship_fee": 16500.0,
                    "pay": "Ví ShopeePay",
                    "printed": True,
                    "print_count": 2
                },
            ]

            all_custs = db.query(Customer).all()
            for idx, o in enumerate(orders_init):
                cust = all_custs[idx % len(all_custs)]
                order_rec = Order(
                    order_sn=o["sn"],
                    shop_id=shop.id,
                    warehouse_id=wh_hn.id,
                    customer_id=cust.id,
                    order_status=o["status"],
                    shipping_carrier=o["carrier"],
                    tracking_number=o["tracking"],
                    total_amount=o["total"],
                    shipping_fee=o["ship_fee"],
                    payment_method=o["pay"],
                    is_printed=o["printed"],
                    print_count=o["print_count"],
                    assigned_staff_id=staff_wh.id
                )
                db.add(order_rec)
                db.flush()

                # Add item
                item_rec = OrderItem(
                    order_id=order_rec.id,
                    sku_id=first_sku.id,
                    item_name="Áo Thun Cotton Nam Cao Cấp SPX Pro Form Rộng",
                    model_name="Đen / Size L",
                    shopee_item_id=10001,
                    shopee_model_id=20001,
                    quantity=2,
                    item_price=149000.0
                )
                db.add(item_rec)

        db.commit()
        print("Database seeded successfully with initial production data!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
