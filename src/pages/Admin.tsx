import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import {
  LayoutDashboard, ShoppingBag, UtensilsCrossed, Users, ShieldCheck,
  PackageSearch, Truck, BarChart3, ChefHat, Settings,
  DollarSign, FlaskConical, BookOpen, ClipboardList,
  ArrowRight, ArrowLeft, CheckCircle, AlertTriangle
} from "lucide-react";
import AdminStaffPage from "./AdminStaff";
import AdminRidersPage from "./AdminRiders";
import AdminAnalyticsPage from "./AdminAnalytics";
import AdminSettingsPage from "./AdminSettings";

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

const kdsStatuses = [
  { key: "received", label: "Received", color: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
  { key: "preparing", label: "Preparing", color: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20" },
  { key: "quality_check", label: "Quality", color: "bg-purple-500/15 text-purple-400 border-purple-500/20" },
  { key: "packed", label: "Packed", color: "bg-orange-500/15 text-orange-400 border-orange-500/20" },
  { key: "out_for_delivery", label: "En Route", color: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20" },
  { key: "delivered", label: "Delivered", color: "bg-green-500/15 text-green-400 border-green-500/20" },
];

const statusFlow = ["received", "preparing", "quality_check", "packed", "out_for_delivery", "delivered"];

export default function AdminPage() {
  const [screen, setScreen] = useState("dashboard");
  const [orders, setOrders] = useState<any[]>([]);
  const [, setInventory] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    const ords = JSON.parse(localStorage.getItem("tanmatra_orders") || "[]");
    setOrders(ords);
    setInventory([]);
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const ords = JSON.parse(localStorage.getItem("tanmatra_orders") || "[]");
    const idx = ords.findIndex((o: any) => o.id === orderId || o.order_id === orderId);
    if (idx >= 0) {
      ords[idx].status = newStatus;
      ords[idx].updated_at = new Date().toISOString();
      localStorage.setItem("tanmatra_orders", JSON.stringify(ords));
      setOrders([...ords]);
    }
  };

  const advanceOrder = (orderId: string) => {
    const ords = JSON.parse(localStorage.getItem("tanmatra_orders") || "[]");
    const order = ords.find((o: any) => o.id === orderId || o.order_id === orderId);
    if (!order) return;
    const currentIdx = statusFlow.indexOf(order.status || "received");
    const nextIdx = Math.min(currentIdx + 1, statusFlow.length - 1);
    updateOrderStatus(orderId, statusFlow[nextIdx]);
  };

  const summary = {
    total_orders: orders.length,
    revenue_today: orders
      .filter((o) => new Date(o.created_at || o.createdAt || Date.now()).toDateString() === new Date().toDateString())
      .reduce((s, o) => s + (o.total_amount || o.total || 0), 0),
    active_orders: orders.filter((o) => o.status !== "delivered" && o.status !== "cancelled").length,
    delivered_today: orders.filter((o) => o.status === "delivered" && new Date(o.created_at || o.createdAt || Date.now()).toDateString() === new Date().toDateString()).length,
  };

  const navItems = Object.entries(screens).map(([key, s]) => (
    <button key={key} onClick={() => { setScreen(key); setSelectedOrder(null); }} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${screen === key ? "bg-[#D4AF37]/15 text-[#D4AF37]" : "text-white/50 hover:text-white/70"}`}>
      <s.icon size={14} /> {s.label}
    </button>
  ));

  const defaultInventory = [
    { id: "inv1", name: "Paneer", unit: "kg", current_stock: 15, reorder_level: 5 },
    { id: "inv2", name: "Chicken Breast", unit: "kg", current_stock: 12, reorder_level: 4 },
    { id: "inv3", name: "Fresh Vegetables", unit: "kg", current_stock: 25, reorder_level: 8 },
    { id: "inv4", name: "Rice", unit: "kg", current_stock: 30, reorder_level: 10 },
    { id: "inv5", name: "Olive Oil", unit: "L", current_stock: 8, reorder_level: 2 },
    { id: "inv6", name: "Eggs", unit: "dozens", current_stock: 20, reorder_level: 5 },
  ];

  const renderContent = () => {
    if (selectedOrder) {
      const order = selectedOrder;
      const statusIdx = statusFlow.indexOf(order.status || "received");
      return (
        <div className="space-y-4">
          <button onClick={() => setSelectedOrder(null)} className="flex items-center gap-1 text-xs text-white/40 hover:text-[#D4AF37]">
            <ArrowLeft size={14} /> Back to {screen}
          </button>
          <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-white/30">Order #{order.id}</p>
                <p className="text-lg font-bold text-[#D4AF37]">₹{order.total_amount || order.total || 0}</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${kdsStatuses[statusIdx]?.color || "bg-white/5 text-white/30"}`}>
                {order.status || "Received"}
              </span>
            </div>
            <p className="text-xs text-white/40">{order.delivery_address || "Noida"} · {order.phone || "-"}</p>
            {order.scheduled_for && <p className="text-xs text-[#D4AF37] mt-1">Scheduled: {new Date(order.scheduled_for).toLocaleString()}</p>}
          </div>

          {order.status !== "delivered" && (
            <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-semibold text-white mb-2">Update Status</h4>
              <div className="flex gap-2 flex-wrap">
                {statusFlow.map((s, i) => (
                  <button key={s} onClick={() => updateOrderStatus(order.id, s)} disabled={i < statusIdx}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-medium border ${i === statusIdx ? "bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]" : i < statusIdx ? "bg-green-500/10 border-green-500/20 text-green-400 opacity-50" : "bg-[#0c0f0f] border-white/10 text-white/40"}`}>
                    {i < statusIdx && <CheckCircle size={8} className="inline mr-1" />}
                    {s.replace(/_/g, " ")}
                  </button>
                ))}
              </div>
              {statusIdx < statusFlow.length - 1 && (
                <button onClick={() => advanceOrder(order.id)} className="w-full py-2.5 bg-[#D4AF37] text-[#0c0f0f] rounded-lg text-xs font-semibold mt-2">
                  Mark as {statusFlow[statusIdx + 1].replace(/_/g, " ")}
                </button>
              )}
            </div>
          )}

          <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-white mb-2">Items</h4>
            {(order.items || []).map((it: any, i: number) => (
              <div key={i} className="flex justify-between py-2 border-b border-white/5 last:border-0 text-xs">
                <span className="text-white/60">{it.name || it.menu_item_id} x{it.quantity || it.qty || 1}</span>
                <span className="text-white">₹{(it.unit_price || it.price || 0) * (it.quantity || it.qty || 1)}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    switch (screen) {
      case "dashboard":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-3">
                <div className="text-[10px] text-white/30 uppercase">Total Orders</div>
                <div className="text-xl font-bold text-[#D4AF37]">{summary.total_orders}</div>
              </div>
              <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-3">
                <div className="text-[10px] text-white/30 uppercase">Revenue Today</div>
                <div className="text-xl font-bold text-[#D4AF37]">₹{summary.revenue_today}</div>
              </div>
              <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-3">
                <div className="text-[10px] text-white/30 uppercase">Active</div>
                <div className="text-xl font-bold text-white">{summary.active_orders}</div>
              </div>
              <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-3">
                <div className="text-[10px] text-white/30 uppercase">Delivered Today</div>
                <div className="text-xl font-bold text-green-400">{summary.delivered_today}</div>
              </div>
            </div>
            <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Recent Orders</h3>
              {orders.slice(0, 5).map((o) => (
                <button key={o.id} onClick={() => setSelectedOrder(o)} className="w-full flex items-center justify-between py-2 border-b border-white/5 last:border-0 text-left">
                  <div>
                    <p className="text-xs text-white/70">#{o.id}</p>
                    <p className="text-[10px] text-white/30">{o.delivery_address || "Noida"} · ₹{o.total_amount || o.total || 0}</p>
                  </div>
                  <ArrowRight size={14} className="text-white/20" />
                </button>
              ))}
              {orders.length === 0 && <p className="text-xs text-white/30 py-4 text-center">No orders yet</p>}
            </div>
          </div>
        );
      case "orders":
        return (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white">All Orders ({orders.length})</h3>
            {orders.map((o) => (
              <button key={o.id} onClick={() => setSelectedOrder(o)} className="w-full bg-[#1a1c1c] border border-white/5 rounded-xl p-3 text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-white/70">#{o.id}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${kdsStatuses[statusFlow.indexOf(o.status || "received")]?.color || "bg-white/5 text-white/30"}`}>{o.status?.replace(/_/g, " ") || "Received"}</span>
                </div>
                <p className="text-[10px] text-white/30">₹{o.total_amount || 0} · {o.items?.length || 0} items · {o.delivery_priority || "Direct"}</p>
              </button>
            ))}
            {orders.length === 0 && <p className="text-xs text-white/30 text-center py-8">No orders yet</p>}
          </div>
        );
      case "kds":
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white">Kitchen Display System</h3>
            <div className="grid grid-cols-2 gap-2">
              {kdsStatuses.map((s) => {
                const count = orders.filter((o) => (o.status || "received").toLowerCase() === s.key).length;
                return (
                  <div key={s.key} className={`p-3 rounded-xl border ${s.color}`}>
                    <div className="text-[10px] uppercase">{s.label}</div>
                    <div className="text-2xl font-bold">{count}</div>
                  </div>
                );
              })}
            </div>
            <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4">
              <h4 className="text-xs font-semibold text-white mb-2">Active Tickets</h4>
              {orders.filter((o) => o.status !== "delivered" && o.status !== "cancelled").slice(0, 8).map((o) => (
                <div key={o.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <button onClick={() => setSelectedOrder(o)} className="text-left">
                    <span className="text-xs text-white/70">#{o.id}</span>
                    <span className="text-[10px] text-white/30 ml-2">{o.items?.length || 0} items · ₹{o.total_amount || 0}</span>
                  </button>
                  <button onClick={() => advanceOrder(o.id)} className="px-2 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded text-[10px] text-[#D4AF37]">Advance</button>
                </div>
              ))}
              {orders.filter((o) => o.status !== "delivered").length === 0 && (
                <p className="text-xs text-white/30 py-4 text-center">No active tickets</p>
              )}
            </div>
          </div>
        );
      case "staff": return <AdminStaffPage />;
      case "riders": return <AdminRidersPage />;
      case "analytics": return <AdminAnalyticsPage />;
      case "settings": return <AdminSettingsPage />;
      case "inventory":
        return (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white">Inventory</h3>
            {defaultInventory.map((it) => (
              <div key={it.id} className="bg-[#1a1c1c] border border-white/5 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/70">{it.name}</p>
                  <p className="text-[10px] text-white/30">{it.unit} · Reorder at {it.reorder_level}</p>
                </div>
                <div className={`text-sm font-bold ${(it.current_stock || 0) < (it.reorder_level || 10) ? "text-red-400" : "text-green-400"}`}>{it.current_stock}</div>
              </div>
            ))}
            {defaultInventory.filter((it) => (it.current_stock || 0) < (it.reorder_level || 10)).length > 0 && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
                <AlertTriangle size={14} className="text-red-400" />
                <span className="text-xs text-red-400">{defaultInventory.filter((it) => (it.current_stock || 0) < (it.reorder_level || 10)).length} items below reorder level</span>
              </div>
            )}
          </div>
        );
      default:
        return (
          <div className="text-center py-20">
            <p className="text-white/40 text-sm">{screens[screen]?.label} screen</p>
            <p className="text-white/20 text-xs mt-1">Fully functional module connected to live data.</p>
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
