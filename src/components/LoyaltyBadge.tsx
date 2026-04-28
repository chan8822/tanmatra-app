import { useState, useEffect } from "react";
import { Award, Star, X } from "lucide-react";

interface LoyaltyData {
  points: number;
  tier: string;
  ordersCount: number;
  totalSavings: number;
  achievements: string[];
}

export function LoyaltyBadge() {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState<LoyaltyData>({ points: 0, tier: "Bronze", ordersCount: 0, totalSavings: 0, achievements: [] });

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem("tanmatra_orders") || "[]");
    const totalSpent = orders.reduce((s: number, o: any) => s + (o.total_amount || 0), 0);
    const count = orders.length;
    const savings = count * 125; // ~₹125 saved per order vs aggregator
    const points = Math.floor(totalSpent / 10);

    let tier = "Bronze";
    if (points > 5000) tier = "Platinum";
    else if (points > 2000) tier = "Gold";
    else if (points > 500) tier = "Silver";

    const achievements: string[] = [];
    if (count >= 1) achievements.push("First Bite");
    if (count >= 5) achievements.push("Regular");
    if (count >= 10) achievements.push("Health Warrior");
    if (savings > 500) achievements.push("Smart Saver");
    if (totalSpent > 2000) achievements.push("Big Spender");

    setData({ points, tier, ordersCount: count, totalSavings: savings, achievements });
  }, []);

  if (data.ordersCount === 0) return null;

  return (
    <>
      {!visible && (
        <button
          onClick={() => setVisible(true)}
          className="fixed bottom-16 right-2 z-30 w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-amber-600 flex items-center justify-center shadow-lg"
        >
          <Award size={18} className="text-white" />
        </button>
      )}
      {visible && (
        <div className="fixed bottom-16 right-2 z-30 bg-[#1a1c1c]/95 backdrop-blur-md border border-[#D4AF37]/20 rounded-xl p-4 w-52 shadow-lg">
          <button onClick={() => setVisible(false)} className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#1a1c1c] border border-white/10 text-white/40 flex items-center justify-center z-10">
            <X size={10} />
          </button>
          <div className="text-center mb-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-[#D4AF37] to-amber-700 flex items-center justify-center mb-1">
              <Star size={20} className="text-white fill-white" />
            </div>
            <p className="text-sm font-bold text-[#D4AF37]">{data.tier}</p>
            <p className="text-[10px] text-white/40">{data.points} points</p>
          </div>
          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-[10px]">
              <span className="text-white/50">Orders</span>
              <span className="text-white font-medium">{data.ordersCount}</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-white/50">Saved vs Zomato</span>
              <span className="text-green-400 font-medium">₹{data.totalSavings}</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#D4AF37] rounded-full" style={{ width: `${Math.min(100, data.points / 50)}%` }} />
            </div>
          </div>
          {data.achievements.length > 0 && (
            <div>
              <p className="text-[9px] text-white/40 mb-1 uppercase tracking-wider">Achievements</p>
              <div className="flex flex-wrap gap-1">
                {data.achievements.map((a) => (
                  <span key={a} className="text-[8px] px-1.5 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20">{a}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
