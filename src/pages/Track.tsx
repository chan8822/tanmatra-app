import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Flame, Droplets, Wheat, Shield, TrendingUp, Target, Calendar, ChevronRight } from "lucide-react";

const members = [
  { name: "Rahul (You)", track: "Athlete", calories: 2450, protein: 142, carbs: 280, fat: 78, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  { name: "Priya", track: "Everyday", calories: 1850, protein: 78, carbs: 210, fat: 65, color: "text-white", bg: "bg-white/5", border: "border-white/10" },
  { name: "Aarav", track: "Junior", calories: 1600, protein: 55, carbs: 190, fat: 52, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
  { name: "Dad", track: "Senior", calories: 1700, protein: 72, carbs: 180, fat: 58, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
];

const weeklyData = [
  { day: "Mon", val: 85 },
  { day: "Tue", val: 72 },
  { day: "Wed", val: 90 },
  { day: "Thu", val: 68 },
  { day: "Fri", val: 95 },
  { day: "Sat", val: 55 },
  { day: "Sun", val: 40 },
];

export default function TrackPage() {
  const [active, setActive] = useState(0);
  const m = members[active];

  return (
    <div className="fade-in pb-10">
      <Header title="Nutrition Track" backTo="/" />

      {/* Member selector */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar">
        {members.map((mem, i) => (
          <button key={i} onClick={() => setActive(i)} className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border ${active === i ? "bg-[#D4AF37] text-[#0c0f0f] border-[#D4AF37]" : "bg-[#1a1c1c] text-white/60 border-white/10"}`}>
            {mem.name}
          </button>
        ))}
      </div>

      <div className="px-4 py-2 space-y-4">
        {/* Macro cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className={`p-3 rounded-xl border ${m.border} ${m.bg}`}>
            <div className="flex items-center gap-1 mb-1 text-white/40"><Flame size={12} /> <span className="text-[10px] uppercase">Calories</span></div>
            <div className={`text-xl font-bold ${m.color}`}>{m.calories}</div>
            <div className="text-[10px] text-white/30">kcal today</div>
          </div>
          <div className={`p-3 rounded-xl border ${m.border} ${m.bg}`}>
            <div className="flex items-center gap-1 mb-1 text-white/40"><Shield size={12} /> <span className="text-[10px] uppercase">Protein</span></div>
            <div className={`text-xl font-bold ${m.color}`}>{m.protein}g</div>
            <div className="text-[10px] text-white/30">of {Math.round(m.calories * 0.25 / 4)}g goal</div>
          </div>
          <div className={`p-3 rounded-xl border ${m.border} ${m.bg}`}>
            <div className="flex items-center gap-1 mb-1 text-white/40"><Wheat size={12} /> <span className="text-[10px] uppercase">Carbs</span></div>
            <div className={`text-xl font-bold ${m.color}`}>{m.carbs}g</div>
            <div className="text-[10px] text-white/30">of {Math.round(m.calories * 0.5 / 4)}g goal</div>
          </div>
          <div className={`p-3 rounded-xl border ${m.border} ${m.bg}`}>
            <div className="flex items-center gap-1 mb-1 text-white/40"><Droplets size={12} /> <span className="text-[10px] uppercase">Fat</span></div>
            <div className={`text-xl font-bold ${m.color}`}>{m.fat}g</div>
            <div className="text-[10px] text-white/30">of {Math.round(m.calories * 0.25 / 9)}g goal</div>
          </div>
        </div>

        {/* Weekly chart */}
        <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2"><TrendingUp size={14} className="text-[#D4AF37]" /> Weekly Consistency</h3>
            <span className="text-[10px] text-white/30">Goal: 80%</span>
          </div>
          <div className="flex items-end gap-2 h-24">
            {weeklyData.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-[#D4AF37]/20 rounded-t-sm relative" style={{ height: `${d.val}%` }}>
                  <div className="absolute bottom-0 left-0 right-0 bg-[#D4AF37] rounded-t-sm" style={{ height: `${Math.min(d.val, 80)}%` }} />
                </div>
                <span className="text-[9px] text-white/30">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Track info */}
        <div className={`p-4 rounded-xl border ${m.border} ${m.bg}`}>
          <div className="flex items-center gap-2 mb-1">
            <Target size={14} className={m.color} />
            <span className={`text-sm font-semibold ${m.color}`}>{m.track} Track</span>
          </div>
          <p className="text-xs text-white/50">Personalized macros based on age, weight, and activity level. Updated weekly by AI.</p>
        </div>

        <Link to="/family" className="block bg-[#1a1c1c] border border-white/5 rounded-xl p-4 flex items-center justify-between active:bg-white/5 transition-colors">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-[#D4AF37]" />
            <span className="text-sm text-white">Manage Family Members</span>
          </div>
          <ChevronRight size={16} className="text-white/20" />
        </Link>
      </div>
    </div>
  );
}
