import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Clock, Bike, Package, MapPin } from "lucide-react";
import { orderStore } from "@/lib/store";
import { ROUTES } from "@/lib/routes";
import { p, statusLabel } from "@/lib/format";

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
  const order = id ? orderStore.getById(id) : undefined;

  if (!order) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <p className="text-white/40">Order not found</p>
      </div>
    );
  }

  const currentStep = steps.findIndex((s) => s.key === order.status);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(ROUTES.orders)} className="text-white/60"><ArrowLeft size={22} /></button>
        <h1 className="text-base font-semibold">Track Order</h1>
      </div>

      {/* Order Info */}
      <div className="card p-4 mb-6">
        <p className="text-sm font-semibold mb-1">Order {order.id}</p>
        <p className="text-xs text-white/40 flex items-center gap-1"><MapPin size={10} /> {order.address}</p>
        <p className="text-sm font-bold text-[#D4AF37] mt-2">{p(order.total)}</p>
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
    </div>
  );
}
