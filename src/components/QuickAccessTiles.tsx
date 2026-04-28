import { useNavigate } from "react-router-dom";
import {
  Gift, Zap, Salad, Shield, Users, Target, Stethoscope, Brain, ChevronRight
} from "lucide-react";

const tiles = [
  { label: "All Offers", sub: "Deals", icon: Gift, filter: "offers", bg: "bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5", color: "text-[#D4AF37]" },
  { label: "Quick Meals", sub: "<15 min", icon: Zap, filter: "quick", bg: "bg-gradient-to-br from-orange-500/20 to-orange-500/5", color: "text-orange-400" },
  { label: "Wellness", sub: "Healthy", icon: Salad, filter: "wellness", bg: "bg-gradient-to-br from-green-500/20 to-green-500/5", color: "text-green-400" },
  { label: "RD Verified", sub: "Trusted", icon: Shield, filter: "rdverified", bg: "bg-gradient-to-br from-blue-500/20 to-blue-500/5", color: "text-blue-400" },
  { label: "Family Meals", sub: "Sharing", icon: Users, filter: "family", bg: "bg-gradient-to-br from-purple-500/20 to-purple-500/5", color: "text-purple-400" },
  { label: "Your Segment", sub: "Personal", icon: Target, filter: "segment", bg: "bg-gradient-to-br from-red-500/20 to-red-500/5", color: "text-red-400" },
];

export function QuickAccessTiles() {
  const navigate = useNavigate();

  return (
    <div className="px-4 py-2 space-y-2.5">
      {/* Row 1: 6 filter tiles */}
      <div className="grid grid-cols-3 gap-2.5">
        {tiles.map((tile) => (
          <button
            key={tile.label}
            onClick={() => navigate(`/menu?filter=${tile.filter}`)}
            className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border border-white/5 ${tile.bg} active:scale-[0.97] transition-transform`}
          >
            <tile.icon size={22} className={tile.color} />
            <div className="text-center">
              <p className="text-[11px] font-semibold text-white leading-tight">{tile.label}</p>
              <p className="text-[9px] text-white/40">{tile.sub}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Row 2: RD Consultation + Health Quiz */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={() => navigate("/consult-rd")}
          className="flex items-center gap-2.5 p-3 bg-gradient-to-r from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/20 rounded-xl text-left active:scale-[0.98] transition-transform"
        >
          <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
            <Stethoscope size={18} className="text-[#D4AF37]" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-white truncate">Talk to Our RD</p>
            <p className="text-[9px] text-white/40">Free consultation</p>
          </div>
          <ChevronRight size={14} className="text-[#D4AF37] ml-auto shrink-0" />
        </button>

        <button
          onClick={() => navigate("/health-quiz")}
          className="flex items-center gap-2.5 p-3 bg-gradient-to-r from-green-500/10 to-transparent border border-green-500/20 rounded-xl text-left active:scale-[0.98] transition-transform"
        >
          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
            <Brain size={18} className="text-green-400" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-white truncate">Health Quiz</p>
            <p className="text-[9px] text-white/40">Personalized plan</p>
          </div>
          <ChevronRight size={14} className="text-green-400 ml-auto shrink-0" />
        </button>
      </div>
    </div>
  );
}
