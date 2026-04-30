import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { orderStore, cartStore } from "@/lib/store";
import { ROUTES } from "@/lib/routes";
import { p, timeAgo, statusLabel, statusColor } from "@/lib/format";
import { Package, RotateCcw, Calendar, Crown, ChevronRight } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState(orderStore.getAll());

  useEffect(() => {
    setOrders(orderStore.getAll());
    return orderStore.subscribe(() => setOrders(orderStore.getAll()));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-6">
      <Header title="My Orders" back={ROUTES.home} />

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <Package size={40} className="text-white/10 mb-3" />
          <p className="text-white/40 text-sm mb-1">No orders yet</p>
          <p className="text-white/20 text-xs mb-4">Your order history will appear here</p>
          <Link to={ROUTES.menu} className="btn-primary px-6 rounded-xl text-sm py-2.5">Browse Menu</Link>
        </div>
      ) : (
        <div className="px-4 space-y-3 mt-3">
          {orders.map((o) => (
            <OrderCard key={o.id} order={o} />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderCard({ order }: { order: any }) {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(ROUTES.track(order.id))} className="w-full text-left card p-4 active:scale-[0.98] transition-transform">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-sm font-semibold">Order {order.id}</p>
          <p className="text-[10px] text-white/40">{timeAgo(order.createdAt)}</p>
        </div>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColor(order.status)}`}>{statusLabel(order.status)}</span>
      </div>
      <p className="text-xs text-white/50 mb-2">{order.items?.length || 0} items &middot; {order.address}</p>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold">{p(order.total)}</span>
        <span className="text-[10px] text-[#D4AF37]">Track &rsaquo;</span>
      </div>

      {/* Revenue prompts */}
      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            order.items.forEach((item: any) => {
              for (let i = 0; i < (item.qty || 1); i++) {
                cartStore.addItem({ id: item.id, name: item.name, price: item.price, image: item.image, isVeg: item.isVeg });
              }
            });
            navigate(ROUTES.cart);
          }}
          className="flex-1 py-2 bg-[#141414] border border-white/10 rounded-lg text-[11px] font-semibold text-white/70 flex items-center justify-center gap-1 active:scale-[0.98]"
        >
          <RotateCcw size={12} /> Reorder
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(ROUTES.subscriptions);
          }}
          className="flex-1 py-2 bg-green-500/10 border border-green-500/20 rounded-lg text-[11px] font-semibold text-green-400 flex items-center justify-center gap-1 active:scale-[0.98]"
        >
          <Calendar size={12} /> Subscribe
        </button>
      </div>

      {/* Gold upsell on delivered orders */}
      {order.status === "delivered" && (
        <div className="mt-2 p-2 bg-gradient-to-r from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/15 rounded-lg flex items-center gap-2">
          <Crown size={12} className="text-[#D4AF37] shrink-0" />
          <p className="text-[10px] text-white/50 flex-1">Get Gold for 20% off next order</p>
          <ChevronRight size={12} className="text-[#D4AF37]" />
        </div>
      )}
    </button>
  );
}
