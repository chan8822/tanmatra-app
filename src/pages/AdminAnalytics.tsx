import { useMemo } from "react";
import { TrendingUp, ShoppingBag, Users, Bike, DollarSign, BarChart3, MapPin } from "lucide-react";

export default function AdminAnalyticsPage() {
  const data = useMemo(() => {
    const orders = JSON.parse(localStorage.getItem("tanmatra_orders") || "[]");
    const totalRevenue = orders.reduce((s: number, o: any) => s + (o.total_amount || 0), 0);
    const totalOrders = orders.length;
    const avgOrder = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    const delivered = orders.filter((o: any) => o.status === "delivered").length;
    const zoneBreakdown: Record<string, number> = {};
    orders.forEach((o: any) => {
      const zone = o.delivery_zone || "Sector 62";
      zoneBreakdown[zone] = (zoneBreakdown[zone] || 0) + 1;
    });
    const hourly = [2, 5, 8, 12, 15, 18, 22, 20, 16, 10, 6, 3];
    return { totalRevenue, totalOrders, avgOrder, delivered, zoneBreakdown, hourly };
  }, []);

  const zones = Object.entries(data.zoneBreakdown).sort((a, b) => b[1] - a[1]);
  const maxZone = zones[0]?.[1] || 1;

  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1"><DollarSign size={12} className="text-[#D4AF37]" /><span className="text-[10px] text-white/40">Revenue</span></div>
          <div className="text-xl font-bold text-[#D4AF37]">₹{data.totalRevenue}</div>
          <div className="flex items-center gap-1 text-[10px] text-green-400 mt-0.5"><TrendingUp size={10} /> +12% vs yesterday</div>
        </div>
        <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1"><ShoppingBag size={12} className="text-[#D4AF37]" /><span className="text-[10px] text-white/40">Orders</span></div>
          <div className="text-xl font-bold text-white">{data.totalOrders}</div>
          <div className="flex items-center gap-1 text-[10px] text-green-400 mt-0.5"><TrendingUp size={10} /> +8% vs yesterday</div>
        </div>
        <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1"><Users size={12} className="text-[#D4AF37]" /><span className="text-[10px] text-white/40">Avg Order</span></div>
          <div className="text-xl font-bold text-white">₹{data.avgOrder}</div>
          <div className="flex items-center gap-1 text-[10px] text-white/30 mt-0.5">Per transaction</div>
        </div>
        <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1"><Bike size={12} className="text-[#D4AF37]" /><span className="text-[10px] text-white/40">Delivered</span></div>
          <div className="text-xl font-bold text-green-400">{data.delivered}</div>
          <div className="flex items-center gap-1 text-[10px] text-white/30 mt-0.5">{data.totalOrders > 0 ? Math.round((data.delivered / data.totalOrders) * 100) : 0}% rate</div>
        </div>
      </div>

      {/* Hourly Trend */}
      <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3"><BarChart3 size={14} className="text-[#D4AF37]" /><h3 className="text-xs font-semibold text-white">Hourly Order Trend</h3></div>
        <div className="flex items-end gap-1 h-24">
          {data.hourly.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-[#D4AF37]/20 rounded-t-sm relative" style={{ height: `${(v / 25) * 100}%` }}>
                <div className="absolute bottom-0 left-0 right-0 bg-[#D4AF37] rounded-t-sm transition-all" style={{ height: "100%" }} />
              </div>
              <span className="text-[8px] text-white/30">{i + 8}h</span>
            </div>
          ))}
        </div>
      </div>

      {/* Zone Performance */}
      <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3"><MapPin size={14} className="text-[#D4AF37]" /><h3 className="text-xs font-semibold text-white">Zone Performance</h3></div>
        {zones.length === 0 ? (
          <p className="text-xs text-white/30 text-center py-4">No zone data yet</p>
        ) : (
          <div className="space-y-2">
            {zones.map(([zone, count]) => (
              <div key={zone} className="flex items-center gap-2">
                <span className="text-[10px] text-white/50 w-24 truncate">{zone}</span>
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#D4AF37] rounded-full" style={{ width: `${(count / maxZone) * 100}%` }} />
                </div>
                <span className="text-[10px] text-white font-medium w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
