import random
import json
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional

# Enatega-inspired delivery orchestration
# Simulates third-party delivery platform integration

NOIDA_ZONES = [
    {"name": "Sector 50-62", "lat": 28.5700, "lng": 77.3700, "riders": 4, "avg_delivery_min": 22},
    {"name": "Sector 15-18", "lat": 28.5800, "lng": 77.3300, "riders": 3, "avg_delivery_min": 18},
    {"name": "Sector 44-50", "lat": 28.5600, "lng": 77.3500, "riders": 5, "avg_delivery_min": 20},
    {"name": "Sector 62-76", "lat": 28.6000, "lng": 77.3800, "riders": 3, "avg_delivery_min": 25},
    {"name": "Sector 100-110", "lat": 28.5400, "lng": 77.4000, "riders": 2, "avg_delivery_min": 28},
]

class EnategaDeliveryClient:
    """Simulates Enatega delivery platform integration."""
    
    def __init__(self):
        self.active_deliveries = {}
    
    def estimate_delivery(self, zone: str, order_total: int, priority: str = "Direct") -> Dict[str, Any]:
        """Estimate delivery time and assign zone."""
        zone_data = next((z for z in NOIDA_ZONES if z["name"] == zone), NOIDA_ZONES[0])
        
        base_time = zone_data["avg_delivery_min"]
        # Priority tiers: Elite (-5 min), Direct (base), Aggregator (+8 min)
        priority_adjust = {"Elite": -5, "Direct": 0, "Aggregator": 8}
        adjust = priority_adjust.get(priority, 0)
        
        # Load factor simulation
        load_factor = random.uniform(0.8, 1.4)
        estimated_min = int((base_time + adjust) * load_factor)
        
        return {
            "zone": zone_data["name"],
            "estimated_minutes": max(12, estimated_min),
            "riders_available": max(0, zone_data["riders"] - random.randint(0, 2)),
            "delivery_fee": 0 if priority == "Elite" and order_total > 500 else 40,
            "priority": priority,
            "live_tracking_url": f"/track/delivery/{random.randint(100000, 999999)}",
        }
    
    def assign_rider(self, order_id: str, zone: str, priority: str = "Direct") -> Dict[str, Any]:
        """Assign nearest available rider."""
        riders = [
            {"id": "DLV-002", "name": "Rohit N.", "phone": "98765 43210", "bike": "UP16 AB 1234", "rating": 4.9, "deliveries": 1240, "zone": "Sector 50-62"},
            {"id": "DLV-003", "name": "Amit K.", "phone": "98765 43211", "bike": "UP16 CD 5678", "rating": 4.8, "deliveries": 890, "zone": "Sector 15-18"},
            {"id": "DLV-004", "name": "Sanjay P.", "phone": "98765 43212", "bike": "UP16 EF 9012", "rating": 4.7, "deliveries": 650, "zone": "Sector 44-50"},
            {"id": "DLV-005", "name": "Mohit R.", "phone": "98765 43213", "bike": "UP16 GH 3456", "rating": 4.6, "deliveries": 420, "zone": "Sector 62-76"},
        ]
        
        # Assign best available rider for zone
        available = [r for r in riders if r["zone"] == zone or priority == "Elite"]
        if not available:
            available = riders
        
        rider = random.choice(available)
        eta = random.randint(12, 30)
        
        self.active_deliveries[order_id] = {
            "order_id": order_id,
            "rider": rider,
            "status": "assigned",
            "eta_minutes": eta,
            "assigned_at": datetime.now().isoformat()
        }
        
        return {
            "success": True,
            "order_id": order_id,
            "rider": rider,
            "eta_minutes": eta,
            "pickup_eta": random.randint(5, 12),
            "status": "assigned"
        }
    
    def update_delivery_status(self, order_id: str, status: str) -> Dict[str, Any]:
        """Update delivery status and simulate GPS progress."""
        delivery = self.active_deliveries.get(order_id, {})
        if not delivery:
            delivery = {
                "order_id": order_id,
                "rider": {"id": "DLV-002", "name": "Rohit N.", "phone": "98765 43210"},
                "status": status,
                "eta_minutes": 20
            }
            self.active_deliveries[order_id] = delivery
        
        delivery["status"] = status
        delivery["updated_at"] = datetime.now().isoformat()
        
        # Simulate GPS coordinates
        if status == "picked_up":
            delivery["gps"] = {"lat": 28.5700 + random.uniform(-0.001, 0.001), "lng": 77.3700 + random.uniform(-0.001, 0.001)}
        elif status == "out_for_delivery":
            delivery["gps"] = {"lat": 28.5700 + random.uniform(0.001, 0.003), "lng": 77.3700 + random.uniform(0.001, 0.003)}
        elif status == "delivered":
            delivery["gps"] = {"lat": 28.5720, "lng": 77.3720}
            delivery["delivered_at"] = datetime.now().isoformat()
        
        return {
            "success": True,
            "order_id": order_id,
            "status": status,
            "rider": delivery["rider"],
            "gps": delivery.get("gps"),
            "eta": delivery.get("eta_minutes", 20)
        }
    
    def get_live_tracking(self, order_id: str) -> Dict[str, Any]:
        """Get live tracking data for an order."""
        delivery = self.active_deliveries.get(order_id)
        if not delivery:
            return {
                "order_id": order_id,
                "status": "not_found",
                "message": "Delivery not found or already completed"
            }
        
        # Simulate slight GPS drift
        base_lat, base_lng = 28.5700, 77.3700
        if "gps" in delivery:
            base_lat = delivery["gps"]["lat"]
            base_lng = delivery["gps"]["lng"]
        
        delivery["gps"] = {
            "lat": base_lat + random.uniform(-0.0002, 0.0002),
            "lng": base_lng + random.uniform(-0.0002, 0.0002)
        }
        
        return {
            "order_id": order_id,
            "status": delivery["status"],
            "rider": delivery["rider"],
            "gps": delivery["gps"],
            "eta_minutes": max(0, delivery.get("eta_minutes", 20) - random.randint(0, 3)),
            "last_updated": datetime.now().isoformat()
        }
    
    def zone_analytics(self) -> List[Dict[str, Any]]:
        """Get delivery performance by zone."""
        return [
            {
                "zone": z["name"],
                "avg_delivery_min": z["avg_delivery_min"],
                "riders_on_duty": z["riders"],
                "orders_today": random.randint(20, 80),
                "on_time_pct": random.randint(92, 99),
                "rating": round(random.uniform(4.5, 4.95), 2)
            }
            for z in NOIDA_ZONES
        ]

# Singleton
_enatega_client = None

def get_enatega() -> EnategaDeliveryClient:
    global _enatega_client
    if _enatega_client is None:
        _enatega_client = EnategaDeliveryClient()
    return _enatega_client
