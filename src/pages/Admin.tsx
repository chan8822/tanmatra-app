import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { API } from "@/lib/api";
import {
  LayoutDashboard, ShoppingBag, UtensilsCrossed, Users, ShieldCheck,
  PackageSearch, Truck, BarChart3, ChefHat, Settings,
  DollarSign, FlaskConical, BookOpen, ClipboardList
} from "lucide-react";

const screens: Record<string, { label: string; icon: any }> = {
  dashboard: { label: "Dashboard", icon: LayoutDashboard },
  orders: { label: "Orders", icon: ShoppingBag },
  menu: { label: "Menu", icon: UtensilsCrossed },
  riders: { label: "Riders", icon: Truck },
  hygiene: { label: "Hygiene", icon: ShieldCheck },
  inventory: { label: "Inventory", icon: PackageSearch },
  procurement: { label: "Procurement", icon: ClipboardList },
  stock: { label: "Stock Ledger", icon: BookOpen },
  cost: { label: "Cost Analysis", icon: DollarSign },
  kds: { label: "KDS", icon: ChefHat },
  analytics: { label: "Analytics", icon: BarChart3 },
  staff: { label: "Staff", icon: Users },
  recipe: { label: "Recipe BOMs", icon: FlaskConical },
  settings: { label: "Settings", icon: Settings },
};

export default function AdminPage() {
  const [screen, setScreen] = useState("dashboard");
  const [analytics, setAnalytics] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      API.listOrders().catch(() => []),
      API.listOrders().catch(() => []),
    ]).then(([a, o]) => {
      if (a && !a.orders) setAnalytics(a);
      setOrders(o.orders || o || []);
      setInventory([]);
    });
  }, []);

  const summary = analytics || {
    total_orders: orders.length,
    revenue_today: orders.filter((o) => new Date(o.created_at).toDateString() === new Date().toDateString()).reduce((s, o) => s + (o.total_amount || 0), 0),
    active_orders: orders.filter((o) => o.status !== "delivered").length,
  };

  const navItems = Object.entries(screens).map(([key, s]) => (
    <button key={key} onClick={() => setScreen(key)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${screen === key ? "bg-[#D4AF37]/15 text-[#D4AF37]" : "text-white/50 hover:text-white/70"}`}>
      <s.icon size={14} /> {s.label}
    </button>
  ));

  const kdsStatuses = ["received", "preparing", "quality_check", "packed", "out_for_delivery", "delivered"];
  const statusColors: Record<string, string> = {
    received: "bg-blue-500/15 text-blue-400",
    preparing: "bg-yellow-500/15 text-yellow-400",
    quality_check: "bg-purple-500/15 text-purple-400",
    packed: "bg-orange-500/15 text-orange-400",
    out_for_delivery: "bg-cyan-500/15 text-cyan-400",
    delivered: "bg-green-500/15 text-green-400",
  };

  const renderContent = () => {
    switch (screen) {
      case "dashboard":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-3">
                <div className="text-[10px] text-white/30 uppercase">Orders Today</div>
                <div className="text-xl font-bold text-[#D4AF37]">{summary.total_orders || 0}</div>
              </div>
              <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-3">
                <div className="text-[10px] text-white/30 uppercase">Revenue Today</div>
                <div className="text-xl font-bold text-[#D4AF37]">₹{summary.revenue_today || 0}</div>
              </div>
              <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-3">
                <div className="text-[10px] text-white/30 uppercase">Active</div>
                <div className="text-xl font-bold text-white">{summary.active_orders || 0}</div>
              </div>
              <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-3">
                <div className="text-[10px] text-white/30 uppercase">Avg Order</div>
                <div className="text-xl font-bold text-white">₹{summary.total_orders ? Math.round((summary.revenue_today || 0) / summary.total_orders) : 0}</div>
              </div>
            </div>
            <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Recent Orders</h3>
              {orders.slice(0, 5).map((o) => (
                <div key={o.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-xs text-white/70">#{o.id}</p>
                    <p className="text-[10px] text-white/30">{o.delivery_address || "Noida"}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusColors[o.status?.toLowerCase()] || "bg-white/5 text-white/30"}`}>{o.status || "Received"}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case "orders":
        return (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white">All Orders</h3>
            {orders.map((o) => (
              <div key={o.id} className="bg-[#1a1c1c] border border-white/5 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-white/70">#{o.id}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusColors[o.status?.toLowerCase()] || "bg-white/5 text-white/30"}`}>{o.status || "Received"}</span>
                </div>
                <p className="text-[10px] text-white/30">₹{o.total_amount || 0} · {o.items?.length || 0} items · {o.delivery_priority || "Direct"}</p>
              </div>
            ))}
          </div>
        );
      case "kds":
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white">Kitchen Display System</h3>
            <div className="grid grid-cols-2 gap-2">
              {kdsStatuses.map((s) => {
                const count = orders.filter((o) => (o.status || "received").toLowerCase() === s).length;
                return (
                  <div key={s} className={`p-3 rounded-xl border ${statusColors[s]} bg-opacity-10`}>
                    <div className="text-[10px] uppercase">{s.replace(/_/g, " ")}</div>
                    <div className="text-xl font-bold">{count}</div>
                  </div>
                );
              })}
            </div>
            <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4">
              <h4 className="text-xs font-semibold text-white mb-2">Active Tickets</h4>
              {orders.filter((o) => o.status !== "delivered").slice(0, 6).map((o) => (
                <div key={o.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <span className="text-xs text-white/70">#{o.id}</span>
                  <span className="text-[10px] text-white/30">{o.items?.length || 0} items · ₹{o.total_amount || 0}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case "inventory":
        return (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white">Inventory</h3>
            {inventory.length === 0 ? (
              <p className="text-xs text-white/40">No inventory data available.</p>
            ) : (
              inventory.map((it) => (
                <div key={it.id} className="bg-[#1a1c1c] border border-white/5 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white/70">{it.name || it.item_name}</p>
                    <p className="text-[10px] text-white/30">{it.unit || "kg"} · Reorder at {it.reorder_level || 10}</p>
                  </div>
                  <div className={`text-sm font-bold ${(it.current_stock || 0) < (it.reorder_level || 10) ? "text-red-400" : "text-green-400"}`}>
                    {it.current_stock || 0}
                  </div>
                </div>
              ))
            )}
          </div>
        );
      default:
        return (
          <div className="text-center py-20">
            <p className="text-white/40 text-sm">{screens[screen]?.label} screen coming soon.</p>
            <p className="text-white/20 text-xs mt-1">This is a frontend preview. Connect backend modules to activate.</p>
          </div>
        );
    }
  };

  return (
    <div className="fade-in pb-10">
      <Header title="Command Center" backTo="/" />
      <div className="flex gap-2 px-2 py-2 overflow-x-auto no-scrollbar border-b border-white/5">
        {navItems}
      </div>
      <div className="px-4 py-4">
        {renderContent()}
      </div>
    </div>
  );
}
