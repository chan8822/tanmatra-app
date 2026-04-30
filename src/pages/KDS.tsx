import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChefHat, Clock, Package, AlertTriangle, CheckCircle } from "lucide-react";
import { orderStore } from "@/lib/store";
import { ROUTES } from "@/lib/routes";
import { p, statusLabel } from "@/lib/format";

const FLOW: Record<string, string> = {
  confirmed: "preparing",
  preparing: "ready",
  ready: "out_for_delivery",
  out_for_delivery: "delivered",
};

const STATUS_CONFIG: Record<string, { color: string; btn: string; nextLabel: string }> = {
  confirmed: { color: "border-yellow-500/30 bg-yellow-500/5", btn: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", nextLabel: "Start Preparing" },
  preparing: { color: "border-purple-500/30 bg-purple-500/5", btn: "bg-purple-500/20 text-purple-400 border-purple-500/30", nextLabel: "Mark Ready" },
  ready: { color: "border-blue-500/30 bg-blue-500/5", btn: "bg-blue-500/20 text-blue-400 border-blue-500/30", nextLabel: "Hand to Rider" },
};

export default function KDSPage() {
  const [orders, setOrders] = useState(orderStore.getAll());

  useEffect(() => {
    const iv = setInterval(() => setOrders(orderStore.getAll()), 3000);
    return () => clearInterval(iv);
  }, []);

  const pending = orders.filter((o) => o.status === "confirmed" || o.status === "preparing");
  const ready = orders.filter((o) => o.status === "ready");
  const out = orders.filter((o) => o.status === "out_for_delivery");
  const delivered = orders.filter((o) => o.status === "delivered");

  const advance = (id: string) => {
    const order = orders.find((o) => o.id === id);
    if (order && FLOW[order.status]) {
      orderStore.updateStatus(id, FLOW[order.status] as any);
      setOrders(orderStore.getAll());
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4">
      <div className="flex items-center gap-3 mb-5">
        <Link to={ROUTES.admin} className="text-white/60"><ArrowLeft size={22} /></Link>
        <ChefHat size={20} className="text-orange-400" />
        <h1 className="text-base font-semibold">Kitchen Display</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        <div className="card p-2.5 text-center">
          <p className="text-[9px] text-white/40">Pending</p>
          <p className="text-lg font-bold text-yellow-400">{pending.length}</p>
        </div>
        <div className="card p-2.5 text-center">
          <p className="text-[9px] text-white/40">Ready</p>
          <p className="text-lg font-bold text-blue-400">{ready.length}</p>
        </div>
        <div className="card p-2.5 text-center">
          <p className="text-[9px] text-white/40">Out</p>
          <p className="text-lg font-bold text-indigo-400">{out.length}</p>
        </div>
        <div className="card p-2.5 text-center">
          <p className="text-[9px] text-white/40">Done</p>
          <p className="text-lg font-bold text-green-400">{delivered.length}</p>
        </div>
      </div>

      {/* Columns */}
      <div className="space-y-5">
        {/* Preparing Column */}
        {pending.length > 0 && (
          <div>
            <h2 className="text-xs font-bold text-yellow-400 uppercase mb-2 flex items-center gap-1.5"><Clock size={12} /> Preparing ({pending.length})</h2>
            <div className="space-y-2">
              {pending.map((o) => <OrderTicket key={o.id} order={o} onAdvance={advance} />)}
            </div>
          </div>
        )}

        {/* Ready Column */}
        {ready.length > 0 && (
          <div>
            <h2 className="text-xs font-bold text-blue-400 uppercase mb-2 flex items-center gap-1.5"><Package size={12} /> Ready ({ready.length})</h2>
            <div className="space-y-2">
              {ready.map((o) => <OrderTicket key={o.id} order={o} onAdvance={advance} />)}
            </div>
          </div>
        )}

        {/* Out Column */}
        {out.length > 0 && (
          <div>
            <h2 className="text-xs font-bold text-indigo-400 uppercase mb-2 flex items-center gap-1.5"><CheckCircle size={12} /> Out for Delivery ({out.length})</h2>
            <div className="space-y-2">
              {out.map((o) => (
                <div key={o.id} className="card p-3 border border-indigo-500/20 bg-indigo-500/5">
                  <div className="flex items-start justify-between mb-2">
                    <div><p className="text-sm font-bold">{o.id}</p><p className="text-[10px] text-white/40">{o.items?.length} items &middot; {p(o.total)}</p></div>
                    <p className="text-[10px] text-indigo-400">Rider assigned</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {pending.length === 0 && ready.length === 0 && out.length === 0 && (
        <div className="text-center py-10">
          <AlertTriangle size={32} className="text-white/10 mx-auto mb-2" />
          <p className="text-sm text-white/30">No active orders in the kitchen</p>
        </div>
      )}
    </div>
  );
}

function OrderTicket({ order, onAdvance }: { order: any; onAdvance: (id: string) => void }) {
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.confirmed;

  return (
    <div className={`card p-3 border ${cfg.color}`}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-sm font-bold">{order.id}</p>
          <p className="text-[10px] text-white/40">{order.items?.length} items &middot; {p(order.total)}</p>
        </div>
        <p className="text-[10px] text-white/30">{new Date(order.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</p>
      </div>
      <div className="flex flex-wrap gap-1 mb-2">
        {order.items?.slice(0, 4).map((i: any) => (
          <span key={i.id} className="text-[10px] px-1.5 py-0.5 bg-white/5 rounded">{i.name} x{i.qty}</span>
        ))}
      </div>
      <button onClick={() => onAdvance(order.id)} className={`w-full py-2 rounded-lg text-xs font-bold border ${cfg.btn}`}>
        {cfg.nextLabel}
      </button>
    </div>
  );
}
