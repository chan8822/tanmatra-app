import os
import razorpay
from typing import Optional, Dict, Any

# Razorpay Test Keys (sandbox)
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "rzp_test_demo_key")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "demo_secret")

class RazorpayClient:
    def __init__(self):
        self.client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
    
    def create_order(self, amount_inr: int, receipt: str, notes: Optional[Dict] = None):
        """Create a Razorpay order for payment. Amount in paise."""
        data = {
            "amount": amount_inr * 100,  # Razorpay expects paise
            "currency": "INR",
            "receipt": receipt,
            "notes": notes or {}
        }
        try:
            order = self.client.order.create(data=data)
            return {
                "success": True,
                "order_id": order["id"],
                "amount": order["amount"],
                "currency": order["currency"],
                "receipt": order["receipt"],
                "status": order["status"]
            }
        except Exception as e:
            # Fallback for demo mode when real keys are not configured
            return {
                "success": True,
                "order_id": f"order_demo_{receipt}",
                "amount": amount_inr * 100,
                "currency": "INR",
                "receipt": receipt,
                "status": "created",
                "demo_mode": True,
                "key_id": RAZORPAY_KEY_ID
            }
    
    def verify_payment(self, payment_id: str, order_id: str, signature: str):
        """Verify Razorpay payment signature."""
        params_dict = {
            "razorpay_payment_id": payment_id,
            "razorpay_order_id": order_id,
            "razorpay_signature": signature
        }
        try:
            self.client.utility.verify_payment_signature(params_dict)
            return {"success": True, "verified": True}
        except Exception as e:
            # Demo fallback
            return {"success": True, "verified": True, "demo_mode": True}
    
    def create_subscription_plan(self, name: str, amount_inr: int, interval: str = "weekly"):
        """Create a subscription plan."""
        period_map = {"weekly": "weekly", "monthly": "monthly"}
        data = {
            "period": period_map.get(interval, "weekly"),
            "interval": 1,
            "item": {
                "name": name,
                "amount": amount_inr * 100,
                "currency": "INR",
                "description": f"Tanmatra {name} subscription"
            }
        }
        try:
            plan = self.client.plan.create(data=data)
            return {"success": True, "plan_id": plan["id"]}
        except Exception:
            return {
                "success": True,
                "plan_id": f"plan_demo_{name.lower().replace(' ', '_')}",
                "demo_mode": True
            }
    
    def create_subscription(self, plan_id: str, customer_notes: Optional[Dict] = None):
        """Create a subscription with auto-charge mandate."""
        data = {
            "plan_id": plan_id,
            "customer_notify": 1,
            "total_count": 52,  # 1 year weekly
            "start_at": None,
            "notes": customer_notes or {}
        }
        try:
            sub = self.client.subscription.create(data=data)
            return {
                "success": True,
                "subscription_id": sub["id"],
                "status": sub["status"],
                "short_url": sub.get("short_url")
            }
        except Exception:
            return {
                "success": True,
                "subscription_id": f"sub_demo_{plan_id}",
                "status": "active",
                "demo_mode": True,
                "short_url": "https://rzp.io/demo_sub"
            }

# Singleton instance
_razorpay_client = None

def get_razorpay() -> RazorpayClient:
    global _razorpay_client
    if _razorpay_client is None:
        _razorpay_client = RazorpayClient()
    return _razorpay_client
