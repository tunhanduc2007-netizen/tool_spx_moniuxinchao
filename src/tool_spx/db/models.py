"""SQLAlchemy ORM Models for Shopee Seller Pro."""

from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, Enum
)
from sqlalchemy.orm import relationship
from tool_spx.db.session import Base
import enum

class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"
    MANAGER = "MANAGER"
    WAREHOUSE_STAFF = "WAREHOUSE_STAFF"
    SALES = "SALES"

class OrderStatus(str, enum.Enum):
    UNPAID = "UNPAID"
    READY_TO_SHIP = "READY_TO_SHIP"
    PROCESSED = "PROCESSED"
    SHIPPED = "SHIPPED"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"
    IN_CANCEL = "IN_CANCEL"

class CustomerTier(str, enum.Enum):
    BRONZE = "BRONZE"      # Dưới 1 triệu
    SILVER = "SILVER"      # 1 - 5 triệu
    GOLD = "GOLD"          # 5 - 15 triệu
    PLATINUM = "PLATINUM"  # 15 - 30 triệu
    VIP = "VIP"            # Trên 30 triệu

class StockMovementType(str, enum.Enum):
    INBOUND = "INBOUND"               # Nhập kho
    OUTBOUND_ORDER = "OUTBOUND_ORDER" # Xuất theo đơn hàng
    ADJUSTMENT = "ADJUSTMENT"         # Điều chỉnh kiểm kê (+/-)
    TRANSFER = "TRANSFER"             # Chuyển giữa các kho

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    full_name = Column(String(100), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), default=UserRole.WAREHOUSE_STAFF.value, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    warehouse_id = Column(Integer, ForeignKey("warehouses.id"), nullable=True)
    last_login_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    warehouse = relationship("Warehouse", back_populates="staff_members")
    assigned_orders = relationship("Order", foreign_keys="Order.assigned_staff_id", back_populates="assigned_staff")

class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    token = Column(String(128), unique=True, index=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class ShopeeAppConfig(Base):
    __tablename__ = "shopee_app_config"

    id = Column(Integer, primary_key=True, index=True)
    partner_id = Column(Integer, default=0, nullable=False)
    partner_key_encrypted = Column(Text, default="", nullable=False)
    api_environment = Column(String(20), default="live")  # 'live' or 'test'
    redirect_url = Column(String(255), default="http://127.0.0.1:8000/api/shopee/callback")
    mock_mode = Column(Boolean, default=True)  # True = Cho phép chạy giả lập mẫu khi chưa cấp quyền
    is_configured = Column(Boolean, default=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ShopeeShop(Base):
    __tablename__ = "shopee_shops"

    id = Column(Integer, primary_key=True, index=True)
    shop_id = Column(Integer, unique=True, index=True, nullable=False)
    shop_name = Column(String(150), nullable=False)
    region = Column(String(10), default="VN")
    access_token_encrypted = Column(Text, nullable=False)
    refresh_token_encrypted = Column(Text, nullable=False)
    token_expires_at = Column(DateTime, nullable=False)
    is_connected = Column(Boolean, default=True)
    last_sync_at = Column(DateTime, nullable=True)
    last_error = Column(Text, nullable=True)
    authorized_at = Column(DateTime, default=datetime.utcnow)

    products = relationship("Product", back_populates="shop")
    orders = relationship("Order", back_populates="shop")
    sync_logs = relationship("ShopeeSyncLog", back_populates="shop")

class Warehouse(Base):
    __tablename__ = "warehouses"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(150), nullable=False)
    address = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    staff_members = relationship("User", back_populates="warehouse")
    inventories = relationship("Inventory", back_populates="warehouse")
    orders = relationship("Order", back_populates="warehouse")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    spx_item_id = Column(Integer, unique=True, index=True, nullable=True)  # Shopee item_id
    shop_id = Column(Integer, ForeignKey("shopee_shops.id"), nullable=True)
    name = Column(String(255), nullable=False)
    item_status = Column(String(50), default="NORMAL")  # NORMAL, UNLIST, BANNED
    image_url = Column(Text, nullable=True)
    category_name = Column(String(100), default="Mặc định")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    shop = relationship("ShopeeShop", back_populates="products")
    skus = relationship("ProductSku", back_populates="product", cascade="all, delete-orphan")

class ProductSku(Base):
    __tablename__ = "product_skus"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    sku_code = Column(String(100), unique=True, index=True, nullable=False)
    model_id = Column(Integer, nullable=True)  # Shopee model/variation ID
    name = Column(String(150), nullable=False)
    barcode = Column(String(50), nullable=True)
    cost_price = Column(Float, default=0.0)
    selling_price = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    product = relationship("Product", back_populates="skus")
    inventories = relationship("Inventory", back_populates="sku", cascade="all, delete-orphan")
    order_items = relationship("OrderItem", back_populates="sku")

class Inventory(Base):
    __tablename__ = "inventories"

    id = Column(Integer, primary_key=True, index=True)
    sku_id = Column(Integer, ForeignKey("product_skus.id"), nullable=False)
    warehouse_id = Column(Integer, ForeignKey("warehouses.id"), nullable=False)
    quantity = Column(Integer, default=0, nullable=False)
    reserved_quantity = Column(Integer, default=0, nullable=False)
    safety_stock = Column(Integer, default=10, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    sku = relationship("ProductSku", back_populates="inventories")
    warehouse = relationship("Warehouse", back_populates="inventories")

class StockMovement(Base):
    __tablename__ = "stock_movements"

    id = Column(Integer, primary_key=True, index=True)
    sku_id = Column(Integer, ForeignKey("product_skus.id"), nullable=False)
    warehouse_id = Column(Integer, ForeignKey("warehouses.id"), nullable=False)
    movement_type = Column(String(50), nullable=False)
    quantity_delta = Column(Integer, nullable=False)
    reference_id = Column(String(100), nullable=True)  # Order SN hoặc mã phiếu
    notes = Column(Text, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    sku = relationship("ProductSku")
    warehouse = relationship("Warehouse")
    user = relationship("User")

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    buyer_user_id = Column(Integer, unique=True, index=True, nullable=True)
    name = Column(String(150), nullable=False)
    phone = Column(String(50), nullable=True)
    email = Column(String(100), nullable=True)
    shipping_address = Column(Text, nullable=True)
    total_orders = Column(Integer, default=0)
    total_spent = Column(Float, default=0.0)
    loyalty_points = Column(Integer, default=0)
    rank_tier = Column(String(20), default=CustomerTier.BRONZE.value)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    orders = relationship("Order", back_populates="customer")

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_sn = Column(String(50), unique=True, index=True, nullable=False)
    shop_id = Column(Integer, ForeignKey("shopee_shops.id"), nullable=False)
    warehouse_id = Column(Integer, ForeignKey("warehouses.id"), nullable=False)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    order_status = Column(String(50), default=OrderStatus.READY_TO_SHIP.value, nullable=False)
    shipping_carrier = Column(String(100), default="SPX Express")
    tracking_number = Column(String(100), nullable=True, index=True)
    total_amount = Column(Float, default=0.0)
    shipping_fee = Column(Float, default=0.0)
    payment_method = Column(String(50), default="ShopeePay")
    
    # In vận đơn
    is_printed = Column(Boolean, default=False)
    print_count = Column(Integer, default=0)
    printed_at = Column(DateTime, nullable=True)
    printed_by = Column(Integer, ForeignKey("users.id"), nullable=True)

    # Đóng gói & Xử lý
    packed_at = Column(DateTime, nullable=True)
    packed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    assigned_staff_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    cancel_reason = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    shop = relationship("ShopeeShop", back_populates="orders")
    warehouse = relationship("Warehouse", back_populates="orders")
    customer = relationship("Customer", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    assigned_staff = relationship("User", foreign_keys=[assigned_staff_id], back_populates="assigned_orders")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    sku_id = Column(Integer, ForeignKey("product_skus.id"), nullable=True)
    item_name = Column(String(255), nullable=False)
    model_name = Column(String(150), default="")
    shopee_item_id = Column(Integer, nullable=True)
    shopee_model_id = Column(Integer, nullable=True)
    quantity = Column(Integer, default=1, nullable=False)
    item_price = Column(Float, default=0.0, nullable=False)

    order = relationship("Order", back_populates="items")
    sku = relationship("ProductSku", back_populates="order_items")

class ShippingLabelPrintJob(Base):
    __tablename__ = "shipping_label_print_jobs"

    id = Column(Integer, primary_key=True, index=True)
    batch_code = Column(String(100), unique=True, index=True, nullable=False)
    paper_size = Column(String(50), default="THERMAL_100x150")  # THERMAL_100x150 hoặc A4
    total_orders = Column(Integer, default=0)
    order_sns_json = Column(Text, nullable=False)  # JSON danh sách mã đơn
    status = Column(String(50), default="COMPLETED")
    printed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")

class ShopeeSyncLog(Base):
    __tablename__ = "shopee_sync_logs"

    id = Column(Integer, primary_key=True, index=True)
    shop_id = Column(Integer, ForeignKey("shopee_shops.id"), nullable=True)
    sync_type = Column(String(50), nullable=False)  # ORDERS, PRODUCTS, INVENTORY, LOGISTICS
    status = Column(String(50), default="SUCCESS")   # SUCCESS, PARTIAL, FAILED
    records_processed = Column(Integer, default=0)
    records_failed = Column(Integer, default=0)
    details = Column(Text, nullable=True)
    triggered_by = Column(String(50), default="MANUAL")  # MANUAL, SCHEDULED, WEBHOOK
    created_at = Column(DateTime, default=datetime.utcnow)

    shop = relationship("ShopeeShop", back_populates="sync_logs")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(String(100), nullable=False)
    target_type = Column(String(50), nullable=False)
    target_id = Column(String(100), nullable=True)
    ip_address = Column(String(50), nullable=True)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")

class SystemSetting(Base):
    __tablename__ = "system_settings"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(100), unique=True, index=True, nullable=False)
    value = Column(Text, nullable=False)
    description = Column(String(255), nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
