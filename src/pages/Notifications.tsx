import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Bell, ShoppingBag, Tag, Truck, Star, Gift, Info, ChevronRight, Home } from "lucide-react";
import { ROUTES } from "@/lib/routes";

const notifications = [
  { id: 1, icon: ShoppingBag, title: "Order Confirmed", body: "Your order TM1001 has been confirmed. Preparing now!", time: "2 min ago", color: "text-blue-400", bg: "bg-blue-500/10", read: false },
  { id: 2, icon: Truck, title: "Out for Delivery", body: "Rider Suresh is on the way with your order. ETA: 12 mins.", time: "15 min ago", color: "text-purple-400", bg: "bg-purple-500/10", read: false },
  { id: 3, icon: Tag, title: "50% OFF Flash Sale", body: "All salads at half price today only. Don't miss out!", time: "1 hour ago", color: "text-orange-400", bg: "bg-orange-500/10", read: true },
  { id: 4, icon: Gift, title: "Referral Bonus", body: "You earned ₹50 wallet credit. Refer more friends!", time: "3 hours ago", color: "text-green-400", bg: "bg-green-500/10", read: true },
  { id: 5, icon: Star, title: "Rate your order", body: "How was your Grilled Chicken Bowl? Tap to rate.", time: "Yesterday", color: "text-yellow-400", bg: "bg-yellow-500/10", read: true },
  { id: 6, icon: Info, title: "App Update", body: "Tanmatra v2.0 is here with faster checkout.", time: "2 days ago", color: "text-white/40", bg: "bg-white/5", read: true },
];

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState(notifications);

  const markRead = (id: number) => {
    setItems(items.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(ROUTES.home)} className="text-white/60"><ArrowLeft size={22} /></button>
        <Bell size={20} className="text-[#D4AF37]" />
        <h1 className="text-base font-semibold">Notifications</h1>
        <span className="ml-auto text-xs text-white/40">{items.filter((n) => !n.read).length} new</span>
      </div>

      <div className="px-4 space-y-1 mt-2">
        {items.map((n) => (
          <button key={n.id} onClick={() => markRead(n.id)} className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-colors ${n.read ? "bg-transparent" : "bg-[#D4AF37]/5"}`}>
            <div className={`w-9 h-9 rounded-lg ${n.bg} flex items-center justify-center shrink-0 mt-0.5`}>
              <n.icon size={16} className={n.color} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{n.title}</p>
                {!n.read && <span className="w-2 h-2 bg-[#D4AF37] rounded-full shrink-0" />}
              </div>
              <p className="text-xs text-white/40 mt-0.5">{n.body}</p>
              <p className="text-[10px] text-white/25 mt-1">{n.time}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
