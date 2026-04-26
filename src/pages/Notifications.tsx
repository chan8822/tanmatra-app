import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Bell, CheckCircle, Truck, Star, Tag, ChevronRight } from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const notifs = JSON.parse(localStorage.getItem("tanmatra_notifications") || "[]");
    if (notifs.length === 0) {
      // Seed with demo notifications
      const demo = [
        { id: 1, type: "order", title: "Order Confirmed", message: "Your order #TAN-1001 has been received. Preparing now.", time: "2 min ago", read: false, icon: <CheckCircle size={14} />, color: "text-green-400", bg: "bg-green-500/10" },
        { id: 2, type: "delivery", title: "Out for Delivery", message: "Rider Vikram is on the way. ETA: 18 minutes.", time: "15 min ago", read: false, icon: <Truck size={14} />, color: "text-cyan-400", bg: "bg-cyan-500/10" },
        { id: 3, type: "promo", title: "Weekend Special", message: "Get 20% off all Healthy Meals this weekend. Code: HEALTHY20", time: "1 hour ago", read: true, icon: <Tag size={14} />, color: "text-[#D4AF37]", bg: "bg-[#D4AF37]/10" },
        { id: 4, type: "review", title: "Rate Your Order", message: "How was your Grilled Paneer Salad? Tap to rate.", time: "Yesterday", read: true, icon: <Star size={14} />, color: "text-purple-400", bg: "bg-purple-500/10" },
      ];
      localStorage.setItem("tanmatra_notifications", JSON.stringify(demo));
      setNotifications(demo);
    } else {
      setNotifications(notifs);
    }
  }, []);

  const markRead = (id: number) => {
    const updated = notifications.map((n) => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    localStorage.setItem("tanmatra_notifications", JSON.stringify(updated));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fade-in pb-10">
      <Header title="Notifications" backTo="/" />

      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white">
            {unreadCount > 0 ? `${unreadCount} Unread` : "All Caught Up"}
          </h2>
          {unreadCount > 0 && (
            <button
              onClick={() => {
                const updated = notifications.map((n) => ({ ...n, read: true }));
                setNotifications(updated);
                localStorage.setItem("tanmatra_notifications", JSON.stringify(updated));
              }}
              className="text-xs text-[#D4AF37]"
            >
              Mark All Read
            </button>
          )}
        </div>

        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer ${n.read ? "bg-[#1a1c1c] border-white/5" : "bg-[#D4AF37]/5 border-[#D4AF37]/20"}`}
            >
              <div className={`w-8 h-8 rounded-lg ${n.bg} flex items-center justify-center shrink-0 ${n.color}`}>
                {n.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className={`text-xs font-semibold ${n.read ? "text-white/60" : "text-white"}`}>{n.title}</h3>
                  {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />}
                </div>
                <p className="text-[10px] text-white/40 mt-0.5">{n.message}</p>
                <p className="text-[9px] text-white/25 mt-1">{n.time}</p>
              </div>
              <ChevronRight size={14} className="text-white/20 shrink-0 mt-1" />
            </div>
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="text-center py-20">
            <Bell size={40} className="text-white/10 mx-auto mb-3" />
            <p className="text-white/40 text-sm">No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
