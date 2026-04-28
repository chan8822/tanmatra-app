import { useState, useEffect } from "react";
import { Shield, CheckCircle, X, TrendingUp } from "lucide-react";

export function TrustSidebar() {
  const [visible, setVisible] = useState(false);
  const [score, setScore] = useState(100);
  const [stage, setStage] = useState("PREPARING");

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setScore((s) => Math.min(100, s + Math.floor(Math.random() * 3)));
      const stages = ["RECEIVED", "PREPARING", "QUALITY CHECK", "PACKED", "OUT FOR DELIVERY", "DELIVERED"];
      setStage(stages[Math.floor(Math.random() * stages.length)]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-16 left-2 z-30">
      <button
        onClick={() => setVisible(false)}
        className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#1a1c1c] border border-white/10 text-white/40 flex items-center justify-center z-10"
      >
        <X size={10} />
      </button>
      <div className="bg-[#1a1c1c]/95 backdrop-blur-md border border-[#D4AF37]/20 rounded-xl p-3 w-44 shadow-lg">
        <div className="flex items-center gap-1.5 mb-2">
          <Shield size={12} className="text-[#D4AF37]" />
          <span className="text-[10px] font-semibold text-[#D4AF37] uppercase tracking-wider">Live Trust</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-white/50">Hygiene</span>
            <span className="text-[9px] font-bold text-green-400 flex items-center gap-0.5">
              <CheckCircle size={8} /> {score}%
            </span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-green-400 rounded-full transition-all" style={{ width: `${score}%` }} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-white/50">Prep Stage</span>
            <span className="text-[9px] font-medium text-[#D4AF37]">{stage}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-white/50">Kitchen Temp</span>
            <span className="text-[9px] font-medium text-white/70">4°C</span>
          </div>
          <div className="flex items-center gap-1 pt-1 border-t border-white/5">
            <TrendingUp size={8} className="text-green-400" />
            <span className="text-[8px] text-white/40">FSSAI License: 11224</span>
          </div>
        </div>
      </div>
    </div>
  );
}
