from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class MenuCategorySchema(BaseModel):
    id: str
    name: str
    icon: str
    description: str

class MenuItemSchema(BaseModel):
    id: str
    name: str
    price: int
    non_veg_price: Optional[int] = None
    calories: int
    is_vegetarian: bool
    tags: List[str]
    category_id: str
    category_name: str
    protein: Optional[int] = None
    carbs: Optional[int] = None
    fat: Optional[int] = None
    in_stock: bool = True

class OrderCreate(BaseModel):
    user_id: int
    items: List[Dict[str, Any]]
    total: int
    priority: str = "Direct"
    delivery_zone: str = "Elite"
    payment_method: str = "UPI"

class OrderResponse(BaseModel):
    id: str
    status: str
    total: int
    priority: str
    created_at: datetime

class CartItemCreate(BaseModel):
    user_id: int
    menu_item_id: str
    quantity: int = 1
    special_instructions: Optional[str] = None

class CartItemResponse(BaseModel):
    id: int
    menu_item: MenuItemSchema
    quantity: int
    special_instructions: Optional[str] = None

class InventoryItemSchema(BaseModel):
    id: str
    name: str
    group: str
    uom: str
    stock_qty: float
    reorder_level: float
    rate: int
    valuation: int
    batch_number: Optional[str] = None

class StaffSchema(BaseModel):
    id: int
    employee_code: str
    name: str
    department: str
    role: str
    shift_start: Optional[str] = None
    shift_end: Optional[str] = None
    status: str
    hygiene_score: Optional[int] = None
    orders_completed: int

class SubscriptionSchema(BaseModel):
    id: str
    tier: str
    amount_inr: int
    frequency: str
    status: str
    next_charge_at: Optional[datetime] = None
    total_paid: int
    weeks_active: int

class CustomerProfileSchema(BaseModel):
    id: int
    user_id: int
    name: str
    phone: str
    segment: Optional[str] = None
    total_orders: int
    total_spent: int
    ltv: int
    rating: float
    last_order_at: Optional[datetime] = None
    address: Optional[str] = None
    wellness_track: Optional[str] = None
    family_members: Optional[List[str]] = None

class KDSStatusSchema(BaseModel):
    order_id: str
    state: str
    priority: str
    progress: int
    hygiene_score: Optional[int] = None
    temperature: Optional[float] = None
    station: Optional[str] = None
    chef: Optional[str] = None

class AnalyticsSummary(BaseModel):
    total_revenue: int
    total_orders: int
    avg_order_value: int
    active_subscribers: int
    top_dishes: List[Dict[str, Any]]
    zone_performance: List[Dict[str, Any]]
    hourly_distribution: List[Dict[str, Any]]
