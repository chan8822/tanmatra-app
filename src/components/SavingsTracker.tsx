import { useMemo } from "react";
import { TrendingDown, Zap, ShoppingBag } from "lucide-react";

export function SavingsTracker() {
  const savings = useMemo(() => {
    const orders = JSON.parse(localStorage.getItem("tanmatra_orders") || "[]");
    const count = orders.length;
    const totalSpent = orders.reduce((s: number, o: any) => s + (o.total_amount || 0), 0);
    // Aggregator markup: ~30% platform fee + higher food prices
    const aggregatorCost = Math.round(totalSpent * 1.35);
    const saved = aggregatorCost - totalSpent;
    return { count, totalSpent, aggregatorCost, saved };
  }, []);

  if (savings.count === 0) return null;

  return (
    <div className="px-4 py-3">
      <div className="bg-gradient-to-r from-green-500/10 to-[#1a1c1c] border border-green-500/20 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingDown size={14} className="text-green-400" />
          <span className="text-xs font-semibold text-green-400">Your Savings</span>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-bold text-green-400">₹{savings.saved}</span>
          <span className="text-[10px] text-white/40">saved vs food apps</span>
        </div>
        <div className="flex gap-3 mt-2">
          <div className="flex items-center gap-1">
            <ShoppingBag size={10} className="text-white/30" />
            <span className="text-[10px] text-white/50">{savings.count} orders</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap size={10} className="text-[#D4AF37]" />
            <span className="text-[10px] text-white/50">₹{savings.totalSpent} spent</span>
          </div>
        </div>
        <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-green-400 rounded-full" style={{ width: `${Math.min(100, savings.saved / 10)}%` }} />
        </div>
      </div>
    </div>
  );
}
