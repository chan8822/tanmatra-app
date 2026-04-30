import { Link } from "react-router-dom";
import { LayoutDashboard, ChefHat, Users, Bike, BarChart3, ShoppingBag, Clock, TrendingUp, DollarSign, AlertTriangle, ArrowRight } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { p, timeAgo, statusLabel, statusColor } from "@/lib/format";
import { orderStore } from "@/lib/store";
import { useState, useEffect } from "react";

const ops = [
  { label: "Kitchen Display", sub: "Order queue & prep status", icon: ChefHat, route: ROUTES.kds, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  { label: "Staff Management", sub: "Roles, attendance & tasks", icon: Users, route: ROUTES.staff, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { label: "Rider Logistics", sub: "Deliveries & routes", icon: Bike, route: ROUTES.riders, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  { label: "Analytics", sub: "Revenue, orders & performance", icon: BarChart3, route: ROUTES.analytics, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
];

export default function AdminPage() {
  const [orders, setOrders] = useState(orderStore.getAll());

  useEffect(() => {
    const iv = setInterval(() => setOrders(orderStore.getAll()), 5000);
    return () => clearInterval(iv);
  }, []);

  const stats = {
    total: orders.length,
    revenue: orders.reduce((s, o) => s + (o.total || 0), 0),
    pending: orders.filter((o) => o.status === "confirmed").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    ready: orders.filter((o) => o.status === "ready").length,
    out: orders.filter((o) => o.status === "out_for_delivery").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  const activeOrders = orders.filter((o) => o.status !== "delivered").slice(0, 5);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center gap-3">
        <LayoutDashboard size={20} className="text-[#D4AF37]" />
        <h1 className="text-base font-semibold">Operations Command</h1>
        <Link to={ROUTES.home} className="ml-auto text-xs text-white/40 hover:text-white">Exit</Link>
      </div>

      {/* Stat Cards */}
      <div className="p-4 grid grid-cols-2 gap-3">
        <div className="card p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] text-white/40">Total Orders</p>
            <ShoppingBag size={14} className="text-[#D4AF37]" />
          </div>
          <p className="text-2xl font-bold">{stats.total}</p>
          <div className="flex gap-1.5 mt-2">
            <span className="text-[8px] px-1.5 py-0.5 bg-yellow-500/10 text-yellow-400 rounded-full">{stats.pending} pending</span>
            <span className="text-[8px] px-1.5 py-0.5 bg-green-500/10 text-green-400 rounded-full">{stats.delivered} done</span>
          </div>
        </div>
        <div className="card p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] text-white/40">Revenue</p>
            <DollarSign size={14} className="text-green-400" />
          </div>
          <p className="text-2xl font-bold text-green-400">{p(stats.revenue)}</p>
          <p className="text-[8px] text-white/30 mt-2">From {stats.delivered} delivered orders</p>
        </div>
        <div className="card p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] text-white/40">Active Now</p>
            <Clock size={14} className="text-orange-400" />
          </div>
          <p className="text-2xl font-bold text-orange-400">{stats.pending + stats.preparing + stats.ready + stats.out}</p>
          <div className="flex gap-1.5 mt-2">
            <span className="text-[8px] px-1.5 py-0.5 bg-orange-500/10 text-orange-400 rounded-full">{stats.preparing} prep</span>
            <span className="text-[8px] px-1.5 py-0.5 bg-purple-500/10 text-purple-400 rounded-full">{stats.out} out</span>
          </div>
        </div>
        <div className="card p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] text-white/40">Today</p>
            <TrendingUp size={14} className="text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-blue-400">{orders.filter((o) => new Date(o.createdAt).toDateString() === new Date().toDateString()).length}</p>
          <p className="text-[8px] text-white/30 mt-2">orders so far today</p>
        </div>
      </div>

      {/* Operation Cards */}
      <div className="px-4 grid grid-cols-1 gap-3 mb-5">
        {ops.map((op) => (
          <Link key={op.label} to={op.route} className={`flex items-center gap-4 p-4 rounded-xl border ${op.border} ${op.bg} hover:brightness-110 transition-all active:scale-[0.98]`}>
            <div className={`w-12 h-12 rounded-xl ${op.bg} flex items-center justify-center`}>
              <op.icon size={22} className={op.color} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{op.label}</p>
              <p className="text-xs text-white/40">{op.sub}</p>
            </div>
            <ArrowRight size={16} className="text-white/20" />
          </Link>
        ))}
      </div>

      {/* Active Orders */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-white/40 uppercase">Active Orders</h2>
          <Link to="/admin/orders" className="text-[11px] text-[#D4AF37]">View All</Link>
        </div>
        {activeOrders.length === 0 ? (
          <div className="card p-6 text-center">
            <AlertTriangle size={24} className="text-white/10 mx-auto mb-2" />
            <p className="text-sm text-white/30">No active orders</p>
          </div>
        ) : (
          <div className="space-y-2">
            {activeOrders.map((o) => (
              <Link key={o.id} to={ROUTES.track(o.id)} className="card p-3 flex items-center gap-3 active:scale-[0.98] transition-transform">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <ShoppingBag size={16} className="text-white/30" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{o.id}</p>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${statusColor(o.status)}`}>{statusLabel(o.status)}</span>
                  </div>
                  <p className="text-[10px] text-white/40">{o.items?.length || 0} items &middot; {timeAgo(o.createdAt)}</p>
                </div>
                <p className="text-sm font-semibold text-[#D4AF37] shrink-0">{p(o.total || 0)}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
