import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { API } from "@/lib/api";
import { Clock, ChevronRight, Package, Truck, CheckCircle, ChefHat } from "lucide-react";

const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
  received: { icon: ChefHat, color: "text-blue-400", label: "Received" },
  preparing: { icon: ChefHat, color: "text-yellow-400", label: "Preparing" },
  quality_check: { icon: CheckCircle, color: "text-purple-400", label: "Quality Check" },
  packed: { icon: Package, color: "text-orange-400", label: "Packed" },
  out_for_delivery: { icon: Truck, color: "text-cyan-400", label: "Out for Delivery" },
  delivered: { icon: CheckCircle, color: "text-green-400", label: "Delivered" },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.listOrders()
      .then((data: any) => {
        setOrders(data.orders || data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="fade-in pb-10">
      <Header title="My Orders" backTo="/" />

      {loading ? (
        <div className="text-center py-20 text-white/40 text-sm">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <Package size={48} className="text-white/10 mx-auto mb-4" />
          <p className="text-white/40 text-sm mb-2">No orders yet</p>
          <Link to="/menu" className="text-[#D4AF37] text-sm">Order your first meal</Link>
        </div>
      ) : (
        <div className="px-4 py-3 space-y-3">
          {orders.map((o) => {
            const cfg = statusConfig[o.status?.toLowerCase()] || statusConfig.received;
            const Icon = cfg.icon;
            return (
              <Link key={o.id} to={`/order/${o.id}`} className="block bg-[#1a1c1c] border border-white/5 rounded-xl p-4 active:bg-white/5 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs text-white/30">{o.id}</p>
                    <p className="text-sm font-semibold text-white mt-0.5">{o.items?.length || 0} items · ₹{o.total_amount || o.total || 0}</p>
                  </div>
                  <div className={`flex items-center gap-1 text-xs ${cfg.color}`}>
                    <Icon size={14} /> {cfg.label}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-white/40">
                  <div className="flex items-center gap-1">
                    <Clock size={12} /> {new Date(o.created_at || o.createdAt || Date.now()).toLocaleDateString()}
                  </div>
                  <ChevronRight size={14} className="text-white/20" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
