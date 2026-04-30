import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { orderStore } from "@/lib/store";
import { ROUTES } from "@/lib/routes";
import { p, timeAgo, statusLabel, statusColor } from "@/lib/format";
import { Package } from "lucide-react";

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
          <p className="text-white/40 text-sm">No orders yet</p>
          <Link to={ROUTES.menu} className="mt-4 text-sm text-[#D4AF37]">Browse Menu</Link>
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
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold">{p(order.total)}</span>
        <span className="text-[10px] text-[#D4AF37]">Track &rsaquo;</span>
      </div>
    </button>
  );
}
