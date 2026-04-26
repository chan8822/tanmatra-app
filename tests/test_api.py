import pytest
import random
from fastapi.testclient import TestClient
from api.main import app
from api.database import get_db
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from api.models import Base

# Test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)

from api.seed import seed_all

# Seed test database with test session
db = TestingSessionLocal()
seed_all(db)
db.close()

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

class TestHealth:
    def test_health_check(self):
        """Health endpoint returns 200 with status healthy"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "version" in data
        assert "environment" in data

class TestAuth:
    def test_otp_send(self):
        """OTP send creates user if not exists"""
        response = client.post("/api/auth/otp/send?phone=%2B91-9876543210")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "user_id" in data

    def test_otp_verify(self):
        """OTP verify returns token and user info"""
        # Ensure user exists
        client.post("/api/auth/otp/send?phone=%2B91-9876543210")
        
        response = client.post("/api/auth/otp/verify?phone=%2B91-9876543210&otp=123456")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "token" in data
        assert "user" in data

    def test_me(self):
        """Auth me returns user profile"""
        # Create user first
        send_resp = client.post("/api/auth/otp/send?phone=%2B91-9876543211")
        user_id = send_resp.json()["user_id"]
        
        response = client.get(f"/api/auth/me?user_id={user_id}")
        assert response.status_code == 200
        data = response.json()
        assert "phone" in data

class TestMenu:
    def test_categories(self):
        """Menu categories returns list with 14 categories"""
        response = client.get("/api/menu/categories")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 14

    def test_menu_items(self):
        """Menu items returns all 83 dishes"""
        response = client.get("/api/menu/items")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 83
        # Verify item structure
        if data:
            item = data[0]
            assert "id" in item
            assert "name" in item
            assert "price" in item
            assert "category_name" in item

    def test_menu_items_filter_by_category(self):
        """Menu items filters by category"""
        # First get a category id
        cats = client.get("/api/menu/categories").json()
        cat_id = cats[0]["id"]
        
        response = client.get(f"/api/menu/items?category_id={cat_id}")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        for item in data:
            assert item["category_id"] == cat_id

class TestCart:
    def test_add_to_cart(self):
        """Add item to cart"""
        # Get first menu item
        items = client.get("/api/menu/items").json()
        item_id = items[0]["id"]
        
        # Clear existing cart for user 1 first
        cart_items = client.get("/api/cart/1").json()
        for ci in cart_items:
            client.delete(f"/api/cart/{ci['id']}")
        
        response = client.post("/api/cart", json={
            "user_id": 1,
            "menu_item_id": item_id,
            "quantity": 2,
            "special_instructions": "Extra spicy"
        })
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert data["quantity"] >= 2

    def test_get_cart(self):
        """Get cart returns items"""
        response = client.get("/api/cart/1")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

class TestOrders:
    def test_create_order(self):
        """Create order with items"""
        # Get menu items
        items = client.get("/api/menu/items").json()
        item = items[0]
        
        response = client.post("/api/orders", json={
            "user_id": 1,
            "items": [
                {"menu_item_id": item["id"], "qty": 1, "price": item["price"], "special_instructions": ""}
            ],
            "total": item["price"] + 40,
            "priority": "Direct",
            "delivery_zone": "Sector 50-62",
            "payment_method": "Razorpay UPI"
        })
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert data["status"] in ["received", "preparing", "packed", "out_for_delivery", "delivered"]

    def test_list_orders(self):
        """List orders for user"""
        response = client.get("/api/orders?user_id=1")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

class TestInventory:
    def test_inventory_list(self):
        """Inventory list returns items"""
        response = client.get("/api/inventory")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        if data:
            assert "id" in data[0]
            assert "name" in data[0]

    def test_low_stock(self):
        """Low stock endpoint returns items below reorder level"""
        response = client.get("/api/inventory/low-stock")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

class TestAdmin:
    def test_analytics_summary(self):
        """Analytics summary returns dashboard data"""
        response = client.get("/api/analytics/summary")
        assert response.status_code == 200
        data = response.json()
        assert "total_orders_today" in data or "active_subscribers" in data
        assert "revenue_today" in data or "avg_order_value" in data

    def test_kds_status(self):
        """KDS status returns kitchen display data"""
        response = client.get("/api/kds/status")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    def test_customers(self):
        """Customers endpoint returns list"""
        response = client.get("/api/customers")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    def test_staff(self):
        """Staff endpoint returns team members"""
        response = client.get("/api/staff")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

class TestPayments:
    def test_create_razorpay_order(self):
        """Razorpay order creation returns order_id"""
        response = client.post("/api/payments/razorpay/order", params={"amount": 299, "receipt": "TEST-001", "user_id": 1})
        assert response.status_code == 200
        data = response.json()
        assert "order_id" in data
        assert data["currency"] == "INR"

    def test_verify_razorpay_payment(self):
        """Razorpay payment verification"""
        response = client.post("/api/payments/razorpay/verify?payment_id=pay_test_001&order_id=order_test_001&signature=test_signature")
        assert response.status_code == 200
        data = response.json()
        assert "verified" in data

class TestDelivery:
    def test_delivery_zones(self):
        """Delivery zones returns 5 Noida zones"""
        response = client.get("/api/delivery/zones")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 5

    def test_delivery_estimate(self):
        """Delivery estimate returns ETA and fee"""
        response = client.get("/api/delivery/estimate?zone=Sector%2050-62&order_total=500&priority=Elite")
        assert response.status_code == 200
        data = response.json()
        assert "estimated_minutes" in data
        assert "delivery_fee" in data

    def test_assign_rider(self):
        """Rider assignment returns rider details"""
        response = client.post("/api/delivery/assign-rider?order_id=ORD-TEST-001&zone=Sector%2050-62&priority=Direct")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "rider" in data

    def test_live_tracking(self):
        """Live tracking returns GPS data"""
        # First assign rider
        client.post("/api/delivery/assign-rider?order_id=ORD-TRACK-001&zone=Sector%2050-62&priority=Direct")
        
        response = client.get("/api/delivery/tracking/ORD-TRACK-001")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data

class TestAI:
    def test_ai_chat(self):
        """AI chat returns response"""
        response = client.post("/api/ai/chat?user_id=1&message=What%20should%20I%20eat%20after%20workout")
        assert response.status_code == 200
        data = response.json()
        assert "text" in data

    def test_ai_recommend(self):
        """AI recommendations return dishes"""
        response = client.post("/api/ai/recommend?user_id=1")
        assert response.status_code == 200
        data = response.json()
        assert "text" in data

class TestRecipeBOM:
    def test_recipe_boms(self):
        """Recipe BOMs return costing data"""
        response = client.get("/api/recipe-boms")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        if data:
            assert "dish" in data[0]
            assert "cogs" in data[0]
            assert "gm" in data[0]

class TestWebhook:
    def test_webhook_acknowledges_events(self):
        """Webhook endpoint acknowledges valid events"""
        # In demo mode, signature verification is bypassed
        unique_id = "TAN-TEST-WEBHOOK-" + str(random.randint(10000, 99999))
        response = client.post("/api/payments/razorpay/webhook", json={
            "event": "order.paid",
            "payload": {
                "payment": {
                    "entity": {
                        "id": "pay_test",
                        "notes": {"order_id": unique_id}
                    }
                }
            }
        })
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"

# Run with: pytest tests/ -v
if __name__ == "__main__":
    pytest.main([__file__, "-v"])
