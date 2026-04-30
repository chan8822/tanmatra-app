import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Search, XCircle, Clock, CheckCircle, Package, Truck, DollarSign, ChevronRight } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { p, timeAgo, statusLabel } from "@/lib/format";
import { orderStore } from "@/lib/store";

const STATUS_CONFIG: Record<string, { color: string; icon: React.ElementType }> = {
  confirmed: { color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", icon: Clock },
  preparing: { color: "bg-purple-500/10 text-purple-400 border-purple-500/20", icon: Package },
  ready: { color: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: Package },
  out_for_delivery: { color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20", icon: Truck },
  delivered: { color: "bg-green-500/10 text-green-400 border-green-500/20", icon: CheckCircle },
};

export default function AllOrdersPage() {
  const [orders, setOrders] = useState(orderStore.getAll());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const iv = setInterval(() => setOrders(orderStore.getAll()), 5000);
    return () => clearInterval(iv);
  }, []);

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.id?.toLowerCase().includes(search.toLowerCase()) ||
      o.address?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: orders.length,
    revenue: orders.reduce((s, o) => s + (o.total || 0), 0),
    pending: orders.filter((o) => o.status === "confirmed").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    ready: orders.filter((o) => o.status === "ready").length,
    out: orders.filter((o) => o.status === "out_for_delivery").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  const statuses = ["all", "confirmed", "preparing", "ready", "out_for_delivery", "delivered"];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-6">
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center gap-3">
        <Link to={ROUTES.admin} className="text-white/60"><ArrowLeft size={22} /></Link>
        <ShoppingBag size={20} className="text-[#D4AF37]" />
        <h1 className="text-base font-semibold">All Orders</h1>
        <span className="ml-auto text-xs text-white/40">{filtered.length} shown</span>
      </div>

      {/* Stat Cards */}
      <div className="p-4 grid grid-cols-2 gap-3">
        <div className="card p-3">
          <p className="text-[10px] text-white/40">Total Orders</p>
          <p className="text-xl font-bold mt-1">{stats.total}</p>
        </div>
        <div className="card p-3">
          <p className="text-[10px] text-white/40">Revenue</p>
          <p className="text-xl font-bold mt-1 text-green-400">{p(stats.revenue)}</p>
        </div>
        <div className="card p-3">
          <p className="text-[10px] text-white/40">Active</p>
          <p className="text-xl font-bold mt-1 text-orange-400">{stats.pending + stats.preparing + stats.ready + stats.out}</p>
        </div>
        <div className="card p-3">
          <p className="text-[10px] text-white/40">Delivered</p>
          <p className="text-xl font-bold mt-1 text-green-400">{stats.delivered}</p>
        </div>
      </div>

      {/* Status Filter */}
      <div className="px-4 mb-3 flex gap-2 overflow-x-auto no-scrollbar">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-semibold border transition-colors ${
              statusFilter === s
                ? "bg-[#D4AF37] text-[#0a0a0a] border-[#D4AF37]"
                : "bg-[#141414] text-white/50 border-white/10"
            }`}
          >
            {s === "all" ? "All" : statusLabel(s)}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="px-4 mb-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order ID or address..."
            className="w-full pl-9 pr-3 py-2.5 bg-[#141414] border border-white/10 rounded-xl text-sm placeholder:text-white/30 outline-none focus:border-[#D4AF37]/50"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="px-4 space-y-2">
        {filtered.length === 0 ? (
          <div className="card p-6 text-center">
            <XCircle size={24} className="text-white/10 mx-auto mb-2" />
            <p className="text-sm text-white/30">No orders found</p>
          </div>
        ) : (
          filtered.map((o) => {
            const cfg = STATUS_CONFIG[o.status] || STATUS_CONFIG.confirmed;
            const Icon = cfg.icon;
            return (
              <Link
                key={o.id}
                to={ROUTES.track(o.id)}
                className="card p-3.5 flex items-start gap-3 active:scale-[0.98] transition-transform"
              >
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <ShoppingBag size={16} className="text-white/30" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold">{o.id}</p>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded-full border flex items-center gap-1 ${cfg.color}`}>
                      <Icon size={8} /> {statusLabel(o.status)}
                    </span>
                    {o.paymentStatus && (
                      <span className={`text-[8px] px-1.5 py-0.5 rounded-full border ${o.paymentStatus === "paid" ? "bg-green-500/10 text-green-400 border-green-500/20" : o.paymentStatus === "pending" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                        {o.paymentStatus === "paid" ? "✓ Paid" : o.paymentStatus === "pending" ? "⏳ Pending" : o.paymentStatus}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-white/40">{o.items?.length || 0} items &middot; {o.address || "No address"}</p>
                  <p className="text-[10px] text-white/30">{timeAgo(o.createdAt)}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-[#D4AF37]">{p(o.total || 0)}</p>
                  <ChevronRight size={14} className="text-white/20 ml-auto" />
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
