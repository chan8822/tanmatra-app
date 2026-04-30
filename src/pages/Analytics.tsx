import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, DollarSign, Package, Users, Star, TrendingDown, Percent } from "lucide-react";
import { orderStore } from "@/lib/store";
import { menuItems } from "@/data/menu";
import { ROUTES } from "@/lib/routes";
import { p } from "@/lib/format";

// Estimate COGS as 32% of retail price (industry avg for premium delivery)
const COGS_RATIO = 0.32;

function calcCOGS(orderItems: { id: string; price: number; qty: number }[]) {
  return orderItems.reduce((sum, i) => sum + i.price * i.qty * COGS_RATIO, 0);
}

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState(orderStore.getAll());

  useEffect(() => {
    const tick = () => setOrders(orderStore.getAll());
    tick();
    const iv = setInterval(tick, 5000);
    return () => clearInterval(iv);
  }, []);

  // Real-time metrics
  const metrics = useMemo(() => {
    const paidOrders = orders.filter(o => o.paymentStatus === "paid");
    const totalRevenue = paidOrders.reduce((s, o) => s + o.total, 0);
    const totalCOGS = paidOrders.reduce((s, o) => s + calcCOGS(o.items), 0);
    const gm = totalRevenue > 0 ? ((totalRevenue - totalCOGS) / totalRevenue) * 100 : 0;
    const today = new Date().toDateString();
    const todayOrders = paidOrders.filter(o => new Date(o.createdAt).toDateString() === today);
    const todayRevenue = todayOrders.reduce((s, o) => s + o.total, 0);

    return {
      revenue: totalRevenue,
      orders: paidOrders.length,
      avgOrder: paidOrders.length > 0 ? Math.round(totalRevenue / paidOrders.length) : 0,
      gm: gm,
      todayOrders: todayOrders.length,
      todayRevenue,
      totalCOGS,
    };
  }, [orders]);

  // Top items by actual order volume
  const topItems = useMemo(() => {
    const counts: Record<string, { name: string; count: number; revenue: number; cogs: number }> = {};
    orders.filter(o => o.paymentStatus === "paid").forEach(o => {
      o.items.forEach(i => {
        if (!counts[i.id]) counts[i.id] = { name: i.name, count: 0, revenue: 0, cogs: 0 };
        counts[i.id].count += i.qty;
        counts[i.id].revenue += i.price * i.qty;
        counts[i.id].cogs += i.price * i.qty * COGS_RATIO;
      });
    });
    return Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [orders]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(ROUTES.admin)} className="text-white/60"><ArrowLeft size={22} /></button>
        <TrendingUp size={20} className="text-[#D4AF37]" />
        <h1 className="text-base font-semibold">Analytics</h1>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3 p-4">
        <div className="card p-3">
          <DollarSign size={16} className="text-[#D4AF37] mb-1" />
          <p className="text-lg font-bold">{p(metrics.revenue)}</p>
          <p className="text-[10px] text-white/40">Total Revenue (paid)</p>
        </div>
        <div className="card p-3">
          <Package size={16} className="text-green-400 mb-1" />
          <p className="text-lg font-bold">{metrics.orders}</p>
          <p className="text-[10px] text-white/40">Paid Orders</p>
        </div>
        <div className="card p-3">
          <Users size={16} className="text-blue-400 mb-1" />
          <p className="text-lg font-bold">{p(metrics.avgOrder)}</p>
          <p className="text-[10px] text-white/40">Avg. Order Value</p>
        </div>
        <div className="card p-3">
          <Percent size={16} className="text-purple-400 mb-1" />
          <p className="text-lg font-bold">{metrics.gm.toFixed(1)}%</p>
          <p className="text-[10px] text-white/40">Gross Margin</p>
        </div>
      </div>

      {/* GM% Explainer Card */}
      <div className="mx-4 mb-3 card p-4 border border-[#D4AF37]/20">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={14} className="text-[#D4AF37]" />
          <h3 className="text-sm font-bold">Gross Margin Breakdown</h3>
        </div>
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between text-white/50">
            <span>Revenue</span>
            <span>{p(metrics.revenue)}</span>
          </div>
          <div className="flex justify-between text-white/50">
            <span>COGS ({Math.round(COGS_RATIO * 100)}% of revenue)</span>
            <span className="text-red-400">-{p(Math.round(metrics.totalCOGS))}</span>
          </div>
          <div className="h-px bg-white/5" />
          <div className="flex justify-between font-bold text-green-400">
            <span>Gross Profit</span>
            <span>{p(Math.round(metrics.revenue - metrics.totalCOGS))}</span>
          </div>
          <p className="text-[10px] text-white/30 mt-1">GM% = (Revenue - COGS) / Revenue × 100</p>
        </div>
      </div>

      {/* Today's snapshot */}
      <div className="mx-4 mb-3 card p-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-white/40">Today</p>
          <p className="text-sm font-bold">{metrics.todayOrders} orders &middot; {p(metrics.todayRevenue)}</p>
        </div>
        <div className="w-20 h-2 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-[#D4AF37] rounded-full" style={{ width: "60%" }} />
        </div>
      </div>

      {/* Top Items by Actual Orders */}
      <div className="px-4 mb-4">
        <h3 className="text-xs font-bold text-white/40 uppercase mb-2">Top Dishes (by paid orders)</h3>
        <div className="space-y-2">
          {topItems.length > 0 ? topItems.map((item, i) => {
            const itemGM = item.revenue > 0 ? ((item.revenue - item.cogs) / item.revenue) * 100 : 0;
            return (
              <div key={i} className="card p-3 flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-xs font-bold text-[#D4AF37]">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-[10px] text-white/40">{item.count} sold &middot; {p(item.revenue)} revenue</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#D4AF37]">{p(item.revenue)}</p>
                  <p className="text-[9px] text-green-400">{itemGM.toFixed(0)}% margin</p>
                </div>
              </div>
            );
          }) : (
            <div className="py-6 text-center">
              <Package size={28} className="text-white/10 mx-auto mb-2" />
              <p className="text-xs text-white/30">No paid orders yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Revenue Trend Bar */}
      <div className="px-4 mb-4">
        <h3 className="text-xs font-bold text-white/40 uppercase mb-2">Revenue Trend</h3>
        <div className="card p-3 flex items-end gap-1 h-24">
          {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-[#D4AF37]/20 rounded-t-sm" style={{ height: `${h}%` }} />
              <span className="text-[8px] text-white/30">{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
