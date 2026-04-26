import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { API } from "@/lib/api";
import { ChefHat, CheckCircle, Package, Truck, MapPin, Phone, Clock, ArrowRight } from "lucide-react";

const steps = [
  { key: "received", label: "Received", icon: ChefHat },
  { key: "preparing", label: "Preparing", icon: ChefHat },
  { key: "quality_check", label: "Quality", icon: CheckCircle },
  { key: "packed", label: "Packed", icon: Package },
  { key: "out_for_delivery", label: "En Route", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    API.listOrders()
      .then((data: any) => {
        const orders = data.orders || data || [];
        const found = orders.find((o: any) => String(o.id) === id || o.order_id === id);
        setOrder(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-20 text-white/40 text-sm">Loading...</div>;
  if (!order) return (
    <div className="text-center py-20">
      <p className="text-white/40 text-sm mb-4">Order not found</p>
      <Link to="/orders" className="text-[#D4AF37] text-sm">Back to Orders</Link>
    </div>
  );

  const activeIdx = steps.findIndex((s) => s.key === (order.status || "received").toLowerCase());
  const currentStep = activeIdx >= 0 ? activeIdx : 0;

  return (
    <div className="fade-in pb-10">
      <Header title="Order Details" backTo="/orders" />

      <div className="px-4 py-4 space-y-5">
        {/* Order ID & Status */}
        <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-white/30">Order #{order.id}</p>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${currentStep >= 4 ? "bg-green-500/15 text-green-400" : "bg-[#D4AF37]/10 text-[#D4AF37]"}`}>
              {order.status || "Received"}
            </span>
          </div>
          <p className="text-2xl font-bold text-[#D4AF37]">₹{order.total_amount || order.total || 0}</p>
          <p className="text-xs text-white/40 mt-1">{new Date(order.created_at || order.createdAt || Date.now()).toLocaleString()}</p>
        </div>

        {/* Progress */}
        <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-3 left-0 right-0 h-0.5 bg-white/10" />
            <div className="absolute top-3 left-0 h-0.5 bg-[#D4AF37] transition-all" style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }} />
            {steps.map((s, i) => {
              const Icon = s.icon;
              const done = i <= currentStep;
              return (
                <div key={s.key} className="relative z-10 flex flex-col items-center gap-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${done ? "bg-[#D4AF37]" : "bg-[#0c0f0f] border border-white/20"}`}>
                    <Icon size={12} className={done ? "text-[#0c0f0f]" : "text-white/30"} />
                  </div>
                  <span className={`text-[9px] ${done ? "text-[#D4AF37]" : "text-white/30"}`}>{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Items */}
        <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-semibold text-white">Items</h3>
          {(order.items || []).map((it: any, i: number) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-white/70">{it.name || it.menu_item_id} x{it.quantity || it.qty || 1}</span>
              <span className="text-white">₹{(it.unit_price || it.price || 0) * (it.quantity || it.qty || 1)}</span>
            </div>
          ))}
          <div className="border-t border-white/5 pt-2 flex justify-between text-sm font-bold text-white">
            <span>Total</span><span className="text-[#D4AF37]">₹{order.total_amount || order.total || 0}</span>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4 space-y-2">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2"><MapPin size={14} className="text-[#D4AF37]" /> Delivery</h3>
          <p className="text-xs text-white/60">{order.delivery_address || "Noida, Sector 62"}</p>
          <p className="text-xs text-white/60 flex items-center gap-1"><Phone size={12} /> {order.phone || "Not provided"}</p>
          <p className="text-xs text-white/60 flex items-center gap-1"><Clock size={12} /> Priority: {order.delivery_priority || "Direct"}</p>
        </div>

        {/* Tracking CTA */}
        <Link to={`/track?order=${order.id}`} className="block bg-gradient-to-r from-[#D4AF37]/10 to-[#1a1c1c] border border-[#D4AF37]/20 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-[#D4AF37] mb-0.5">Live Tracking</p>
            <p className="text-sm text-white/70">Track rider location & ETA</p>
          </div>
          <ArrowRight size={18} className="text-[#D4AF37]" />
        </Link>
      </div>
    </div>
  );
}
