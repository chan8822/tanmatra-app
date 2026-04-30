import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Salad, Droplets, Sun, Moon, Flame, TrendingUp, ChevronRight, Stethoscope, Brain, X } from "lucide-react";
import { ROUTES } from "@/lib/routes";

const pillars = [
  { icon: Salad, label: "Balanced Nutrition", desc: "Macro-optimized meals for your body", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20", filter: "wellness" },
  { icon: Droplets, label: "Hydration", desc: "Detox drinks & infused waters", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", filter: "drinks" },
  { icon: Sun, label: "Immunity Boost", desc: "Vitamin C & antioxidant-rich meals", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", filter: "wellness" },
  { icon: Moon, label: "Sleep Support", desc: "Light dinners for better rest", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", filter: "wellness" },
  { icon: Flame, label: "Metabolism", desc: "Thermogenic spices & lean proteins", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", filter: "wellness" },
  { icon: TrendingUp, label: "Sustained Energy", desc: "Low-GI carbs for all-day power", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", filter: "wellness" },
];

const tips = [
  "Start your day with warm lemon water to kickstart digestion and boost vitamin C intake.",
  "Eat protein within 30 minutes of waking to stabilize blood sugar throughout the day.",
  "Replace refined carbs with whole grains — your gut microbiome will thank you.",
  "Drink water 30 minutes before meals, not during, for optimal digestion.",
  "Include fermented foods daily — kimchi, yogurt, or kanji — for gut health.",
  "Use cold-pressed oils for cooking and raw consumption — they retain more nutrients.",
];

export default function WellnessPage() {
  const navigate = useNavigate();
  const [tipIndex, setTipIndex] = useState(0);
  const [showTipModal, setShowTipModal] = useState(false);

  const nextTip = () => setTipIndex((prev) => (prev + 1) % tips.length);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-20">
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(ROUTES.home)} className="text-white/60"><ArrowLeft size={22} /></button>
        <Heart size={20} className="text-green-400" />
        <h1 className="text-base font-semibold">Wellness Hub</h1>
      </div>

      {/* Hero */}
      <div className="px-4 py-5">
        <div className="card p-5 bg-gradient-to-br from-green-500/10 to-[#141414] border-green-500/20">
          <h2 className="text-lg font-bold mb-1">Your Daily Wellness</h2>
          <p className="text-xs text-white/40 mb-3">6 pillars of holistic health, backed by our RDs</p>
          <div className="flex gap-2">
            <button onClick={() => navigate(ROUTES.healthQuiz)} className="btn-primary text-xs px-4 py-2 rounded-xl">Take Quiz</button>
            <button onClick={() => navigate(ROUTES.consultRD)} className="btn-outline text-xs px-4 py-2 rounded-xl flex items-center gap-1">
              <Stethoscope size={12} /> Talk to RD
            </button>
          </div>
        </div>
      </div>

      {/* Pillars */}
      <div className="px-4 space-y-2">
        {pillars.map((p) => (
          <button key={p.label} onClick={() => navigate(`${ROUTES.menu}?filter=${p.filter}`)} className={`w-full card p-3.5 flex items-center gap-3 border ${p.border} ${p.bg} text-left active:scale-[0.98] transition-transform`}>
            <div className={`w-10 h-10 rounded-xl ${p.bg} flex items-center justify-center`}>
              <p.icon size={18} className={p.color} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{p.label}</p>
              <p className="text-xs text-white/40">{p.desc}</p>
            </div>
            <ChevronRight size={14} className="text-white/20" />
          </button>
        ))}
      </div>

      {/* Tip Card */}
      <div className="mx-4 mt-4 card p-4 border-l-2 border-l-green-500">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-green-400 font-medium">Today's Tip</p>
          <button onClick={() => setShowTipModal(true)} className="text-[10px] text-white/30 underline">See all</button>
        </div>
        <p className="text-sm text-white/60">{tips[tipIndex]}</p>
        <button onClick={nextTip} className="mt-2 text-[10px] text-green-400 flex items-center gap-1">
          <Brain size={10} /> Next tip
        </button>
      </div>

      {/* All Tips Modal */}
      {showTipModal && (
        <div className="fixed inset-0 z-[10000] bg-black/80 flex items-end sm:items-center justify-center p-4" onClick={() => setShowTipModal(false)}>
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-5 max-w-sm w-full max-h-[70vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold">Wellness Tips</h3>
              <button onClick={() => setShowTipModal(false)} className="text-white/40"><X size={16} /></button>
            </div>
            <div className="space-y-3">
              {tips.map((tip, i) => (
                <div key={i} className="p-3 bg-[#0a0a0a] rounded-lg">
                  <p className="text-[10px] text-green-400 mb-1">Tip {i + 1}</p>
                  <p className="text-xs text-white/60">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
