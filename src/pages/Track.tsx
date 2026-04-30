import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Clock, Bike, Package, MapPin, RotateCcw, Home, Star } from "lucide-react";
import { orderStore, cartStore } from "@/lib/store";
import { ROUTES } from "@/lib/routes";
import { p, statusLabel } from "@/lib/format";
import { useState, useEffect } from "react";

const steps = [
  { key: "confirmed", label: "Order Confirmed", icon: CheckCircle },
  { key: "preparing", label: "Preparing", icon: Clock },
  { key: "ready", label: "Ready for Pickup", icon: Package },
  { key: "out_for_delivery", label: "Out for Delivery", icon: Bike },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
];

export default function TrackPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(id ? orderStore.getById(id) : undefined);

  // Auto-poll order status every 5 seconds — no full-page refresh
  useEffect(() => {
    if (!id) return;
    const poll = () => {
      const fresh = orderStore.getById(id);
      if (fresh) setOrder(fresh);
    };
    poll();
    const iv = setInterval(poll, 5000);
    return () => clearInterval(iv);
  }, [id]);

  // Auto-advance status for demo (every 8 seconds)
  useEffect(() => {
    if (!order || order.status === "delivered") return;
    const iv = setInterval(() => {
      const flow = ["confirmed", "preparing", "ready", "out_for_delivery", "delivered"];
      const nextIdx = flow.indexOf(order.status) + 1;
      if (nextIdx < flow.length) {
        orderStore.updateStatus(order.id, flow[nextIdx] as any);
        setOrder(orderStore.getById(order.id));
      }
    }, 8000);
    return () => clearInterval(iv);
  }, [order?.id, order?.status]);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-6 text-center">
        <Package size={40} className="text-white/10 mb-3" />
        <p className="text-white/40 text-sm mb-1">Order not found</p>
        <p className="text-white/20 text-xs mb-6">The order you're looking for doesn't exist or has been removed.</p>
        <div className="flex gap-3 w-full max-w-xs">
          <button onClick={() => navigate(ROUTES.orders)} className="flex-1 btn-gold text-sm py-3 rounded-xl">My Orders</button>
          <button onClick={() => navigate(ROUTES.home)} className="flex-1 btn-outline text-sm py-3 rounded-xl">Home</button>
        </div>
      </div>
    );
  }

  const currentStep = steps.findIndex((s) => s.key === order.status);
  const isDelivered = order.status === "delivered";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 pb-28">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(ROUTES.orders)} className="text-white/60"><ArrowLeft size={22} /></button>
        <h1 className="text-base font-semibold">Track Order</h1>
      </div>

      {/* Order Info */}
      <div className="card p-4 mb-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-sm font-semibold">Order {order.id}</p>
            <p className="text-xs text-white/40 flex items-center gap-1"><MapPin size={10} /> {order.address}</p>
          </div>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${isDelivered ? "bg-green-500/10 text-green-400" : "bg-[#D4AF37]/10 text-[#D4AF37]"}`}>
            {isDelivered ? "Delivered" : statusLabel(order.status)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-[#D4AF37]">{p(order.total)}</p>
          {order.paymentStatus && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${order.paymentStatus === "paid" ? "bg-green-500/10 text-green-400" : order.paymentStatus === "pending" ? "bg-yellow-500/10 text-yellow-400" : "bg-red-500/10 text-red-400"}`}>
              {order.paymentStatus === "paid" ? "✓ Paid" : order.paymentStatus === "pending" ? "⏳ Pending" : order.paymentStatus}
            </span>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative pl-8 space-y-6">
        <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-white/10" />
        {steps.map((step, i) => {
          const done = i <= currentStep;
          const active = i === currentStep;
          return (
            <div key={step.key} className={`relative flex items-start gap-3 ${done ? "opacity-100" : "opacity-30"}`}>
              <div className={`absolute left-[-23px] w-5 h-5 rounded-full border-2 flex items-center justify-center ${done ? "border-green-500 bg-green-500" : "border-white/20 bg-[#0a0a0a]"}`}>
                {done && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <div>
                <p className={`text-sm font-medium ${active ? "text-white" : ""}`}>{step.label}</p>
                {active && <p className="text-[10px] text-[#D4AF37] mt-0.5">In progress</p>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Delivered actions */}
      {isDelivered && (
        <div className="mt-8 space-y-3">
          <div className="p-4 card border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={16} className="text-green-400" />
              <p className="text-sm font-bold text-green-400">Delivered successfully!</p>
            </div>
            <p className="text-xs text-white/40 mb-3">How was your meal? Rate us to earn 10 loyalty points.</p>
            <div className="flex gap-1 mb-3">
              {[1,2,3,4,5].map((s) => (
                <button key={s} className="p-1"><Star size={20} className="text-white/20 hover:text-[#D4AF37] transition-colors" /></button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                order.items.forEach((item: any) => {
                  for (let i = 0; i < (item.qty || 1); i++) {
                    cartStore.addItem({ id: item.id, name: item.name, price: item.price, image: item.image, isVeg: item.isVeg });
                  }
                });
                navigate(ROUTES.cart);
              }}
              className="flex-1 py-3 bg-[#141414] border border-white/10 rounded-xl text-sm font-semibold text-white/70 flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <RotateCcw size={16} /> Reorder
            </button>
            <button onClick={() => navigate(ROUTES.home)} className="flex-1 btn-primary text-sm py-3 rounded-xl flex items-center justify-center gap-2">
              <Home size={16} /> Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
