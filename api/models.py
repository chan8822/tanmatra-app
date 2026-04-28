from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON, BigInteger, Numeric, Date
from sqlalchemy.sql import func
from api.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    phone = Column(String(15), unique=True, nullable=False, index=True)
    name = Column(String(100))
    email = Column(String(100))
    segment = Column(String(50))  # Fitness, Diabetes, Senior, Junior
    dietary_preferences = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class MenuCategory(Base):
    __tablename__ = "menu_categories"
    id = Column(String(50), primary_key=True)
    name = Column(String(100), nullable=False)
    icon = Column(String(50))
    description = Column(Text)
    sort_order = Column(Integer, default=0)

class MenuItem(Base):
    __tablename__ = "menu_items"
    id = Column(String(50), primary_key=True)
    name = Column(String(200), nullable=False)
    description = Column(Text)
    price = Column(Integer, nullable=False)
    non_veg_price = Column(Integer)
    calories = Column(Integer)
    is_vegetarian = Column(Boolean, default=True)
    tags = Column(JSON)
    category_id = Column(String(50), ForeignKey("menu_categories.id"))
    image = Column(String(300))
    in_stock = Column(Boolean, default=True)
    protein = Column(Integer)
    carbs = Column(Integer)
    fat = Column(Integer)
    sodium = Column(Integer)
    fiber = Column(Integer)
    cogs = Column(Integer)  # cost of goods sold
    rd_verified = Column(Boolean, default=True)

class Order(Base):
    __tablename__ = "orders"
    id = Column(String(50), primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    enatega_order_id = Column(String(100))
    erpnext_sales_order = Column(String(100))
    items = Column(JSON)  # [{menu_item_id, qty, price, special_instructions}]
    total = Column(Integer, nullable=False)
    priority = Column(String(20), default="Direct")  # Elite, Direct, Aggregator
    status = Column(String(30), default="received")  # received, preparing, packed, out_for_delivery, delivered, cancelled
    rider_id = Column(Integer, ForeignKey("staff.id"))
    delivery_zone = Column(String(20))
    payment_method = Column(String(50))
    payment_status = Column(String(20), default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    delivered_at = Column(DateTime(timezone=True))
    customer_rating = Column(Integer)
    delivery_rating = Column(Integer)
    rider_rating = Column(Integer)

class CartItem(Base):
    __tablename__ = "cart_items"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    menu_item_id = Column(String(50), ForeignKey("menu_items.id"))
    quantity = Column(Integer, default=1)
    special_instructions = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class InventoryItem(Base):
    __tablename__ = "inventory"
    id = Column(String(50), primary_key=True)
    name = Column(String(200), nullable=False)
    group = Column(String(50))
    uom = Column(String(20))
    stock_qty = Column(Numeric(10, 2), default=0)
    reorder_level = Column(Numeric(10, 2), default=0)
    rate = Column(Integer)
    valuation = Column(Integer)
    batch_number = Column(String(50))
    shelf_life_days = Column(Integer)
    warehouse = Column(String(50), default="Main Kitchen")
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class StockLedger(Base):
    __tablename__ = "stock_ledger"
    id = Column(Integer, primary_key=True)
    item_id = Column(String(50), ForeignKey("inventory.id"))
    transaction_type = Column(String(20))  # Purchase, Consumption, Transfer, Wastage
    qty = Column(Numeric(10, 2))
    reference_doc = Column(String(100))
    warehouse = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"
    id = Column(String(50), primary_key=True)
    vendor_id = Column(Integer, ForeignKey("vendors.id"))
    status = Column(String(20), default="Pending")  # Pending, Partial, Received
    total = Column(Integer)
    items = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Vendor(Base):
    __tablename__ = "vendors"
    id = Column(Integer, primary_key=True)
    name = Column(String(200), nullable=False)
    contact = Column(String(100))
    lead_time_hours = Column(Integer)
    min_order_qty = Column(Numeric(10, 2))
    rating = Column(Numeric(3, 2))
    status = Column(String(20), default="Active")

class Staff(Base):
    __tablename__ = "staff"
    id = Column(Integer, primary_key=True)
    employee_code = Column(String(50), unique=True)
    name = Column(String(100), nullable=False)
    department = Column(String(50))  # Kitchen, Delivery
    role = Column(String(50))
    salary_inr = Column(Integer)
    shift_start = Column(String(10))
    shift_end = Column(String(10))
    hygiene_score = Column(Integer)
    avg_prep_time_min = Column(Numeric(4, 1))
    orders_completed = Column(Integer, default=0)
    status = Column(String(20), default="Active")
    zone = Column(String(100))
    bike = Column(String(50))
    phone = Column(String(15))
    rating = Column(Numeric(3, 1))
    deliveries = Column(Integer, default=0)

class Subscription(Base):
    __tablename__ = "subscriptions"
    id = Column(String(50), primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    razorpay_subscription_id = Column(String(100))
    razorpay_mandate_id = Column(String(100))
    tier = Column(String(20))  # Elite, Standard, Budget
    amount_inr = Column(Integer)
    frequency = Column(String(20))  # weekly, monthly
    status = Column(String(20), default="active")
    next_charge_at = Column(DateTime(timezone=True))
    total_paid = Column(Integer, default=0)
    weeks_active = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class CustomerProfile(Base):
    __tablename__ = "customer_profiles"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    total_orders = Column(Integer, default=0)
    total_spent = Column(Integer, default=0)
    ltv = Column(Integer, default=0)
    rating = Column(Numeric(3, 1), default=5.0)
    last_order_at = Column(DateTime(timezone=True))
    address = Column(Text)
    family_members = Column(JSON)
    wellness_track = Column(String(50))

class Delivery(Base):
    __tablename__ = "deliveries"
    id = Column(Integer, primary_key=True)
    order_id = Column(String(50), ForeignKey("orders.id"))
    rider_id = Column(Integer, ForeignKey("staff.id"))
    rider_name = Column(String(100))
    rider_phone = Column(String(15))
    pickup_time = Column(DateTime(timezone=True))
    delivery_time = Column(DateTime(timezone=True))
    customer_rating = Column(Integer)
    delivery_rating = Column(Integer)
    rider_rating = Column(Integer)
    gps_lat = Column(Numeric(10, 6))
    gps_lng = Column(Numeric(10, 6))
    status = Column(String(20), default="assigned")

class QualityInspection(Base):
    __tablename__ = "quality_inspections"
    id = Column(Integer, primary_key=True)
    item_id = Column(String(50), ForeignKey("inventory.id"))
    inspector = Column(String(100))
    inspection_type = Column(String(20))  # Incoming, In-Process, Outgoing
    hygiene_score = Column(Integer)
    temperature = Column(Numeric(4, 1))
    readings = Column(JSON)
    status = Column(String(20))  # Pass, Fail, Hold
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class KDSStatus(Base):
    __tablename__ = "kds_status"
    id = Column(Integer, primary_key=True)
    order_id = Column(String(50), ForeignKey("orders.id"), unique=True)
    state = Column(String(30), default="RECEIVED")
    priority = Column(String(20), default="Direct")
    progress = Column(Integer, default=0)
    hygiene_score = Column(Integer)
    temperature = Column(Numeric(4, 1))
    station = Column(String(20))
    chef = Column(String(100))
    start_time = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class RecipeBOM(Base):
    __tablename__ = "recipe_boms"
    id = Column(Integer, primary_key=True)
    menu_item_id = Column(String(50), ForeignKey("menu_items.id"))
    name = Column(String(200))
    cogs = Column(Numeric(10, 2))
    selling_price = Column(Integer)
    gm_percent = Column(Integer)
    nutrition = Column(JSON)
    rd_verified = Column(Boolean, default=True)
    ingredients = Column(JSON)
