import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Flame, Package, Bike, CheckCircle, Timer, CreditCard, AlertTriangle } from "lucide-react";
import { orderStore, kitchenStore } from "@/lib/store";
import { ROUTES } from "@/lib/routes";

const statusMeta: Record<string, { label: string; color: string }> = {
  confirmed: { label: "New", color: "text-blue-400" },
  preparing: { label: "🔥 Prep", color: "text-orange-400" },
  ready: { label: "Ready", color: "text-green-400" },
};

export default function KDSPage() {
  const navigate = useNavigate();
  const [pending, setPending] = useState(kitchenStore.getPending());
  const [ready, setReady] = useState(kitchenStore.getReady());
  const [awaitingPayment, setAwaitingPayment] = useState(kitchenStore.getAwaitingPayment());

  useEffect(() => {
    const tick = () => {
      setPending(kitchenStore.getPending());
      setReady(kitchenStore.getReady());
      setAwaitingPayment(kitchenStore.getAwaitingPayment());
    };
    tick();
    const iv = setInterval(tick, 3000);
    return () => clearInterval(iv);
  }, []);

  const advance = (id: string, current: string) => {
    const flow = ["confirmed", "preparing", "ready", "out_for_delivery"];
    const next = flow[flow.indexOf(current) + 1];
    if (next) {
      orderStore.updateStatus(id, next as any);
      setPending(kitchenStore.getPending());
      setReady(kitchenStore.getReady());
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(ROUTES.admin)} className="text-white/60"><ArrowLeft size={22} /></button>
        <Flame size={20} className="text-orange-400" />
        <h1 className="text-base font-semibold">Kitchen Display</h1>
        <span className="ml-auto text-xs text-white/40">{pending.length + ready.length} active</span>
      </div>

      {/* Awaiting Payment — Critical for ops: don't prep unpaid orders */}
      {awaitingPayment.length > 0 && (
        <div className="mx-4 mt-3 p-3 bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/20 rounded-xl flex items-center gap-3">
          <AlertTriangle size={16} className="text-yellow-400 shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-bold text-yellow-400">{awaitingPayment.length} order{awaitingPayment.length > 1 ? "s" : ""} awaiting payment</p>
            <p className="text-[10px] text-white/40">Do not start prep until payment is confirmed</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {/* Incoming (paid + confirmed) */}
        <div>
          <h2 className="text-xs font-bold text-white/40 uppercase mb-3 flex items-center gap-2">
            <Package size={12} /> New ({pending.filter(o => o.status === "confirmed").length})
          </h2>
          <div className="space-y-2">
            {pending.filter(o => o.status === "confirmed").map((o) => (
              <div key={o.id} className="card p-3 border-l-2 border-l-blue-500">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">{o.id}</span>
                  <span className="text-[10px] text-white/40 flex items-center gap-1"><Timer size={10} /> 0m</span>
                </div>
                <div className="space-y-0.5 text-[11px] text-white/50">
                  {o.items.map((i) => (
                    <div key={i.id} className="flex justify-between"><span>{i.name} x{i.qty}</span></div>
                  ))}
                </div>
                <button onClick={() => advance(o.id, o.status)} className="mt-2 w-full py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-lg text-[11px] font-bold text-orange-400">Start Prep</button>
              </div>
            ))}
          </div>
        </div>

        {/* Preparing */}
        <div>
          <h2 className="text-xs font-bold text-white/40 uppercase mb-3 flex items-center gap-2">
            <Flame size={12} /> Prep ({pending.filter(o => o.status === "preparing").length})
          </h2>
          <div className="space-y-2">
            {pending.filter(o => o.status === "preparing").map((o) => (
              <div key={o.id} className="card p-3 border-l-2 border-l-orange-500">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">{o.id}</span>
                  <span className="text-[10px] text-white/40 flex items-center gap-1"><Clock size={10} /> {statusMeta[o.status].label}</span>
                </div>
                <div className="space-y-0.5 text-[11px] text-white/50">
                  {o.items.map((i) => (
                    <div key={i.id} className="flex justify-between"><span>{i.name} x{i.qty}</span></div>
                  ))}
                </div>
                <button onClick={() => advance(o.id, o.status)} className="mt-2 w-full py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg text-[11px] font-bold text-green-400">Mark Ready</button>
              </div>
            ))}
          </div>
        </div>

        {/* Ready */}
        <div>
          <h2 className="text-xs font-bold text-white/40 uppercase mb-3 flex items-center gap-2">
            <CheckCircle size={12} /> Ready ({ready.length})
          </h2>
          <div className="space-y-2">
            {ready.map((o) => (
              <div key={o.id} className="card p-3 border-l-2 border-l-green-500">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">{o.id}</span>
                  <span className="text-[10px] text-green-400">Ready</span>
                </div>
                <div className="space-y-0.5 text-[11px] text-white/50">
                  {o.items.map((i) => (
                    <div key={i.id} className="flex justify-between"><span>{i.name} x{i.qty}</span></div>
                  ))}
                </div>
                <button onClick={() => advance(o.id, o.status)} className="mt-2 w-full py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-[11px] font-bold text-blue-400">Dispatch</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
