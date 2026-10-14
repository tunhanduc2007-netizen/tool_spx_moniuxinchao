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
                mock_mode=False,
                is_configured=True
            )
            db.add(app_cfg)
            db.flush()

        db.commit()
        print("Database initialized clean without sample data. Ready for real Shopee Seller connection!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
