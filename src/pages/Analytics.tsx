import { Link } from "react-router-dom";
import { ArrowLeft, BarChart3, TrendingUp, Users, ShoppingBag, Clock, Star, Package, DollarSign } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { p } from "@/lib/format";
import { orderStore } from "@/lib/store";
import { menuItems } from "@/data/menu";
import { useState, useEffect } from "react";

const hourlyOrders = [2, 3, 1, 0, 0, 1, 4, 7, 9, 8, 6, 5, 7, 8, 6, 4, 5, 7, 9, 6, 4, 3, 2, 1];
const maxOrders = Math.max(...hourlyOrders);

export default function AnalyticsPage() {
  const [orders] = useState(orderStore.getAll());

  const stats = {
    totalRevenue: orders.reduce((s, o) => s + (o.total || 0), 0),
    totalOrders: orders.length,
    avgOrderValue: orders.length > 0 ? Math.round(orders.reduce((s, o) => s + (o.total || 0), 0) / orders.length) : 0,
    avgDeliveryTime: "28 min",
  };

  // Status distribution
  const statusDist = {
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    ready: orders.filter((o) => o.status === "ready").length,
    out: orders.filter((o) => o.status === "out_for_delivery").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };
  const totalActive = statusDist.confirmed + statusDist.preparing + statusDist.ready + statusDist.out;

  // Top selling items (mock data based on menu)
  const topItems = menuItems.slice(0, 5).map((m, i) => ({
    name: m.name,
    orders: [34, 28, 22, 19, 16][i],
    revenue: [11560, 7280, 4840, 3040, 3200][i],
  }));

  const metrics = [
    { label: "Revenue", value: p(stats.totalRevenue), change: "+12%", icon: DollarSign, color: "text-green-400", bg: "bg-green-500/10" },
    { label: "Orders", value: String(stats.totalOrders), change: "+5", icon: ShoppingBag, color: "text-[#D4AF37]", bg: "bg-[#D4AF37]/10" },
    { label: "Avg Order", value: p(stats.avgOrderValue), change: "+3%", icon: TrendingUp, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Avg Delivery", value: stats.avgDeliveryTime, change: "-2 min", icon: Clock, color: "text-purple-400", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4">
      <div className="flex items-center gap-3 mb-5">
        <Link to={ROUTES.admin} className="text-white/60"><ArrowLeft size={22} /></Link>
        <BarChart3 size={20} className="text-green-400" />
        <h1 className="text-base font-semibold">Analytics</h1>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {metrics.map((m) => (
          <div key={m.label} className="card p-3">
            <div className={`w-8 h-8 rounded-lg ${m.bg} flex items-center justify-center mb-2`}>
              <m.icon size={14} className={m.color} />
            </div>
            <p className="text-[10px] text-white/40">{m.label}</p>
            <p className="text-lg font-bold mt-0.5">{m.value}</p>
            <p className={`text-[10px] ${m.change.startsWith("+") ? "text-green-400" : "text-green-400"}`}>{m.change} vs yesterday</p>
          </div>
        ))}
      </div>

      {/* Hourly Chart */}
      <div className="card p-4 mb-5">
        <h2 className="text-sm font-semibold mb-3">Hourly Order Volume (24h)</h2>
        <div className="flex items-end gap-1 h-28">
          {hourlyOrders.map((count, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full relative" style={{ height: `${(count / maxOrders) * 100}%` }}>
                <div className="absolute bottom-0 left-0 right-0 bg-[#D4AF37]/40 rounded-t-sm" style={{ height: "100%" }}>
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#D4AF37] rounded-t-sm" />
                </div>
              </div>
              <span className="text-[7px] text-white/30">{i}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Status Distribution */}
      <div className="card p-4 mb-5">
        <h2 className="text-sm font-semibold mb-3">Order Status</h2>
        <div className="space-y-2">
          {[
            { label: "Pending", count: statusDist.confirmed, color: "bg-yellow-500", text: "text-yellow-400" },
            { label: "Preparing", count: statusDist.preparing, color: "bg-purple-500", text: "text-purple-400" },
            { label: "Ready", count: statusDist.ready, color: "bg-blue-500", text: "text-blue-400" },
            { label: "Out for Delivery", count: statusDist.out, color: "bg-indigo-500", text: "text-indigo-400" },
            { label: "Delivered", count: statusDist.delivered, color: "bg-green-500", text: "text-green-400" },
          ].map((s) => {
            const pct = orders.length > 0 ? (s.count / orders.length) * 100 : 0;
            return (
              <div key={s.label} className="flex items-center gap-3">
                <span className="text-xs text-white/50 w-24 shrink-0">{s.label}</span>
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${s.color}`} style={{ width: `${pct}%` }} />
                </div>
                <span className={`text-xs font-bold w-8 text-right ${s.text}`}>{s.count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Items */}
      <div className="card p-4">
        <h2 className="text-sm font-semibold mb-3">Top Selling Items</h2>
        <div className="space-y-2.5">
          {topItems.map((item, i) => (
            <div key={item.name} className="flex items-center gap-3">
              <span className="text-xs text-white/30 w-4">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-[10px] text-white/40">{item.orders} orders</p>
              </div>
              <span className="text-sm font-semibold text-[#D4AF37]">{p(item.revenue)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
