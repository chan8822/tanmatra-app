from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
import random
import string
from datetime import datetime, timedelta

from api.database import get_db, engine
from api import models, schemas
from api.seed import seed_all

# Create tables and seed on startup
models.Base.metadata.create_all(bind=engine)
try:
    seed_all()
except Exception as e:
    print(f"Seed skipped or failed: {e}")

app = FastAPI(title="Tanmatra API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === AUTH ===
@app.post("/api/auth/otp/send")
def send_otp(phone: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.phone == phone).first()
    if not user:
        user = models.User(phone=phone, name="")
        db.add(user)
        db.commit()
        db.refresh(user)
    return {"success": True, "message": "OTP sent", "user_id": user.id}

@app.post("/api/auth/otp/verify")
def verify_otp(phone: str, otp: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.phone == phone).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"success": True, "token": f"tanmatra_token_{user.id}", "user": {"id": user.id, "phone": user.phone, "name": user.name}}

@app.get("/api/auth/me")
def get_me(user_id: int = Query(1), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"id": user.id, "phone": user.phone, "name": user.name, "segment": user.segment}

# === MENU ===
@app.get("/api/menu/categories", response_model=List[schemas.MenuCategorySchema])
def get_categories(db: Session = Depends(get_db)):
    cats = db.query(models.MenuCategory).order_by(models.MenuCategory.sort_order).all()
    return cats

@app.get("/api/menu/items")
def get_items(category_id: Optional[str] = None, search: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(models.MenuItem, models.MenuCategory.name.label("category_name")).join(models.MenuCategory)
    if category_id:
        q = q.filter(models.MenuItem.category_id == category_id)
    if search:
        q = q.filter(models.MenuItem.name.ilike(f"%{search}%"))
    results = q.all()
    return [
        {
            "id": r.MenuItem.id, "name": r.MenuItem.name, "price": r.MenuItem.price,
            "non_veg_price": r.MenuItem.non_veg_price, "calories": r.MenuItem.calories,
            "is_vegetarian": r.MenuItem.is_vegetarian, "tags": r.MenuItem.tags,
            "category_id": r.MenuItem.category_id, "category_name": r.category_name,
            "protein": r.MenuItem.protein, "carbs": r.MenuItem.carbs, "fat": r.MenuItem.fat,
            "in_stock": r.MenuItem.in_stock, "description": r.MenuItem.description,
            "fiber": r.MenuItem.fiber, "rd_verified": r.MenuItem.rd_verified
        }
        for r in results
    ]

@app.get("/api/menu/items/{item_id}")
def get_item(item_id: str, db: Session = Depends(get_db)):
    item = db.query(models.MenuItem).filter(models.MenuItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    cat = db.query(models.MenuCategory).filter(models.MenuCategory.id == item.category_id).first()
    return {**item.__dict__, "category_name": cat.name if cat else ""}

# === ORDERS ===
@app.post("/api/orders")
def create_order(data: schemas.OrderCreate, db: Session = Depends(get_db)):
    order_id = "TAN-" + str(random.randint(7000, 7999))
    order = models.Order(
        id=order_id, user_id=data.user_id, items=data.items, total=data.total,
        priority=data.priority, delivery_zone=data.delivery_zone,
        payment_method=data.payment_method, status="received"
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    # Auto-create KDS entry
    kds = models.KDSStatus(order_id=order_id, state="RECEIVED", priority=data.priority, progress=0)
    db.add(kds)
    db.commit()
    return {"id": order_id, "status": "received", "total": data.total}

@app.get("/api/orders")
def get_orders(user_id: Optional[int] = None, status: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(models.Order)
    if user_id:
        q = q.filter(models.Order.user_id == user_id)
    if status:
        q = q.filter(models.Order.status == status)
    orders = q.order_by(models.Order.created_at.desc()).all()
    return orders

@app.get("/api/orders/{order_id}")
def get_order(order_id: str, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    kds = db.query(models.KDSStatus).filter(models.KDSStatus.order_id == order_id).first()
    return {**order.__dict__, "kds": kds.__dict__ if kds else None}

# === CART ===
@app.post("/api/cart")
def add_to_cart(data: schemas.CartItemCreate, db: Session = Depends(get_db)):
    existing = db.query(models.CartItem).filter(
        models.CartItem.user_id == data.user_id,
        models.CartItem.menu_item_id == data.menu_item_id
    ).first()
    if existing:
        existing.quantity += data.quantity
        db.commit()
        return {"id": existing.id, "quantity": existing.quantity}
    item = models.CartItem(**data.dict())
    db.add(item)
    db.commit()
    db.refresh(item)
    return {"id": item.id, "quantity": item.quantity}

@app.get("/api/cart/{user_id}")
def get_cart(user_id: int, db: Session = Depends(get_db)):
    items = db.query(models.CartItem, models.MenuItem).join(models.MenuItem).filter(
        models.CartItem.user_id == user_id
    ).all()
    return [
        {
            "id": c.CartItem.id,
            "menu_item": {
                "id": c.MenuItem.id, "name": c.MenuItem.name, "price": c.MenuItem.price,
                "calories": c.MenuItem.calories, "is_vegetarian": c.MenuItem.is_vegetarian,
                "category_id": c.MenuItem.category_id
            },
            "quantity": c.CartItem.quantity,
            "special_instructions": c.CartItem.special_instructions
        }
        for c in items
    ]

@app.delete("/api/cart/{cart_item_id}")
def remove_cart_item(cart_item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.CartItem).filter(models.CartItem.id == cart_item_id).first()
    if item:
        db.delete(item)
        db.commit()
    return {"success": True}

# === INVENTORY ===
@app.get("/api/inventory")
def get_inventory(db: Session = Depends(get_db)):
    return db.query(models.InventoryItem).all()

@app.get("/api/inventory/low-stock")
def get_low_stock(db: Session = Depends(get_db)):
    items = db.query(models.InventoryItem).filter(
        models.InventoryItem.stock_qty <= models.InventoryItem.reorder_level
    ).all()
    return items

# === STOCK LEDGER ===
@app.get("/api/stock-ledger")
def get_stock_ledger(limit: int = 50, db: Session = Depends(get_db)):
    entries = db.query(models.StockLedger).order_by(models.StockLedger.created_at.desc()).limit(limit).all()
    return entries

# === STAFF ===
@app.get("/api/staff")
def get_staff(department: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(models.Staff)
    if department:
        q = q.filter(models.Staff.department == department)
    return q.all()

@app.patch("/api/staff/{staff_id}")
def update_staff(staff_id: int, status: str, db: Session = Depends(get_db)):
    staff = db.query(models.Staff).filter(models.Staff.id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    staff.status = status
    db.commit()
    return staff

# === SUBSCRIPTIONS ===
@app.get("/api/subscriptions")
def get_subscriptions(status: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(models.Subscription)
    if status:
        q = q.filter(models.Subscription.status == status)
    return q.all()

@app.post("/api/subscriptions")
def create_subscription(user_id: int, tier: str, amount: int, frequency: str, db: Session = Depends(get_db)):
    sub_id = "SUB-" + ''.join(random.choices(string.digits, k=3))
    sub = models.Subscription(
        id=sub_id, user_id=user_id, tier=tier, amount_inr=amount,
        frequency=frequency, status="active",
        next_charge_at=datetime.now() + timedelta(days=7 if frequency == "weekly" else 30)
    )
    db.add(sub)
    db.commit()
    db.refresh(sub)
    return sub

# === CUSTOMERS (CRM) ===
@app.get("/api/customers")
def get_customers(db: Session = Depends(get_db)):
    profiles = db.query(models.CustomerProfile, models.User).join(models.User).all()
    return [
        {
            "id": p.CustomerProfile.id, "user_id": p.User.id,
            "name": p.User.name or "Guest", "phone": p.User.phone,
            "segment": p.User.segment, "total_orders": p.CustomerProfile.total_orders,
            "total_spent": p.CustomerProfile.total_spent, "ltv": p.CustomerProfile.ltv,
            "rating": float(p.CustomerProfile.rating), "last_order_at": p.CustomerProfile.last_order_at,
            "address": p.CustomerProfile.address, "wellness_track": p.CustomerProfile.wellness_track,
            "family_members": p.CustomerProfile.family_members
        }
        for p in profiles
    ]

# === ANALYTICS ===
@app.get("/api/analytics/summary")
def get_analytics(db: Session = Depends(get_db)):
    total_revenue = db.query(func.sum(models.Order.total)).filter(models.Order.status == "delivered").scalar() or 0
    total_orders = db.query(models.Order).count()
    active_subs = db.query(models.Subscription).filter(models.Subscription.status == "active").count()
    
    # Top dishes (mock aggregation from orders)
    top_dishes = [
        {"name": "Tawa Chicken", "orders": 234, "revenue": 69966, "trend": 12},
        {"name": "Grilled Chicken + Veggies", "orders": 198, "revenue": 59202, "trend": 8},
        {"name": "Paneer Tikka Wrap", "orders": 176, "revenue": 28160, "trend": 15},
    ]
    
    zones = [
        {"name": "Sector 50-62", "orders": 89, "ontime": 98},
        {"name": "Sector 15-18", "orders": 67, "ontime": 95},
        {"name": "Sector 44-50", "orders": 54, "ontime": 97},
    ]
    
    hours = [
        {"h": "6am", "o": 12}, {"h": "8am", "o": 45}, {"h": "10am", "o": 78},
        {"h": "12pm", "o": 156}, {"h": "2pm", "o": 89}, {"h": "4pm", "o": 67},
        {"h": "6pm", "o": 134}, {"h": "8pm", "o": 167}, {"h": "10pm", "o": 89},
    ]
    
    return {
        "total_revenue": int(total_revenue),
        "total_orders": total_orders,
        "avg_order_value": int(total_revenue / total_orders) if total_orders > 0 else 0,
        "active_subscribers": active_subs,
        "top_dishes": top_dishes,
        "zone_performance": zones,
        "hourly_distribution": hours
    }

# === KDS ===
@app.get("/api/kds/status")
def get_kds_status(db: Session = Depends(get_db)):
    statuses = db.query(models.KDSStatus, models.Order).join(models.Order).all()
    return [
        {
            "order_id": s.KDSStatus.order_id,
            "state": s.KDSStatus.state,
            "priority": s.KDSStatus.priority,
            "progress": s.KDSStatus.progress,
            "hygiene_score": s.KDSStatus.hygiene_score,
            "temperature": float(s.KDSStatus.temperature) if s.KDSStatus.temperature else None,
            "station": s.KDSStatus.station,
            "chef": s.KDSStatus.chef,
            "items": s.Order.items,
            "total": s.Order.total
        }
        for s in statuses
    ]

@app.post("/api/kds/status/{order_id}")
def update_kds_status(order_id: str, state: str, db: Session = Depends(get_db)):
    kds = db.query(models.KDSStatus).filter(models.KDSStatus.order_id == order_id).first()
    if not kds:
        raise HTTPException(status_code=404, detail="KDS entry not found")
    kds.state = state
    kds.progress = min(100, kds.progress + 25)
    kds.updated_at = datetime.now()
    
    # Sync order status
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if order:
        status_map = {"RECEIVED": "received", "PREPARING": "preparing", "QUALITY_CHECK": "preparing",
                      "PACKED": "packed", "OUT_FOR_DELIVERY": "out_for_delivery", "DELIVERED": "delivered"}
        order.status = status_map.get(state, state.lower())
    
    db.commit()
    return {"success": True, "state": state, "progress": kds.progress}

# === PURCHASE ORDERS ===
@app.get("/api/procurement/purchase-orders")
def get_purchase_orders(status: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(models.PurchaseOrder)
    if status:
        q = q.filter(models.PurchaseOrder.status == status)
    return q.all()

# === RECIPE BOM ===
@app.get("/api/recipe-boms")
def get_recipe_boms(db: Session = Depends(get_db)):
    boms = db.query(models.RecipeBOM, models.MenuItem).join(models.MenuItem).all()
    return [
        {
            "id": b.RecipeBOM.id,
            "dish": b.MenuItem.name,
            "cat": db.query(models.MenuCategory).filter(models.MenuCategory.id == b.MenuItem.category_id).first().name,
            "cogs": float(b.RecipeBOM.cogs),
            "selling_price": b.RecipeBOM.selling_price,
            "gm": b.RecipeBOM.gm_percent,
            "nutrition": b.RecipeBOM.nutrition,
            "rd_verified": b.RecipeBOM.rd_verified,
            "ingredients": b.RecipeBOM.ingredients
        }
        for b in boms
    ]

# === STATIC FILES (Frontend) ===
app.mount("/", StaticFiles(directory="dist", html=True), name="static")
