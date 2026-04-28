import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { API } from "@/lib/api";
import { Sparkles, Heart, Zap, Baby, Users, Leaf, ChevronRight } from "lucide-react";

const tracks = [
  {
    key: "athlete",
    label: "Athlete Track",
    color: "from-amber-900/30 to-[#1a1c1c]",
    border: "border-amber-500/20",
    text: "text-amber-400",
    icon: <Zap size={18} />,
    desc: "High-protein, calorie-dense meals for active lifestyles. 30g+ protein per serving.",
    tags: ["High Protein", "Muscle Recovery", "Complex Carbs"]
  },
  {
    key: "junior",
    label: "Junior Track",
    color: "from-green-900/30 to-[#1a1c1c]",
    border: "border-green-500/20",
    text: "text-green-400",
    icon: <Baby size={18} />,
    desc: "Balanced macros for growing bodies. Lower sodium, no artificial additives.",
    tags: ["Low Sodium", "Calcium Rich", "No Additives"]
  },
  {
    key: "senior",
    label: "Senior Track",
    color: "from-blue-900/30 to-[#1a1c1c]",
    border: "border-blue-500/20",
    text: "text-blue-400",
    icon: <Heart size={18} />,
    desc: "Heart-healthy, easy-to-digest meals. Low glycemic index, rich in fiber.",
    tags: ["Low GI", "High Fiber", "Heart Healthy"]
  },
  {
    key: "everyday",
    label: "Everyday Track",
    color: "from-white/5 to-[#1a1c1c]",
    border: "border-white/10",
    text: "text-white/70",
    icon: <Users size={18} />,
    desc: "Wholesome balanced meals for the whole family. RD-verified, affordable.",
    tags: ["Balanced", "Affordable", "Family Size"]
  },
];

export default function WellnessPage() {
  const [recs, setRecs] = useState<any>(null);

  useEffect(() => {
    API.recommend().catch(() => null).then(setRecs);
  }, []);

  return (
    <div className="fade-in pb-10">
      <Header title="Wellness" backTo="/" />

      {/* Hero */}
      <div className="px-4 py-6">
        <h1 className="font-serif text-3xl text-white mb-2">Wellness<br/><span className="text-[#D4AF37]">Signature</span></h1>
        <p className="text-sm text-white/50">AI-personalized nutrition tracks for every member of your family.</p>
      </div>

      {/* AI Recs */}
      {recs && recs.recommendations && (
        <div className="px-4 mb-6">
          <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#1a1c1c] border border-[#D4AF37]/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-[#D4AF37]" />
              <span className="text-xs text-[#D4AF37] font-medium">AI Recommendations</span>
            </div>
            <p className="text-sm text-white/70">{recs.recommendations[0]?.reason || "Personalized for your family's health goals."}</p>
          </div>
        </div>
      )}

      {/* Tracks */}
      <div className="px-4 space-y-3">
        <h2 className="text-sm uppercase tracking-wider text-white/40 mb-1">Health Tracks</h2>
        {tracks.map((t) => (
          <Link key={t.key} to="/track" className={`block bg-gradient-to-r ${t.color} border ${t.border} rounded-xl p-4 active:scale-[0.99] transition-transform`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center ${t.text}`}>{t.icon}</div>
                <div>
                  <h3 className={`text-sm font-semibold ${t.text}`}>{t.label}</h3>
                  <p className="text-xs text-white/50 mt-0.5 leading-relaxed">{t.desc}</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-white/20 mt-2" />
            </div>
            <div className="flex gap-2 mt-3">
              {t.tags.map((tag) => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/5">{tag}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {/* Nutrition Philosophy */}
      <div className="px-4 py-8">
        <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2"><Leaf size={16} className="text-[#D4AF37]" /> Our Nutrition Philosophy</h3>
          {[
            "Every dish is reviewed by a Registered Dietitian (RD).",
            "Macros are lab-tested, not estimated.",
            "No artificial preservatives, colors, or MSG.",
            "Ingredients sourced from certified vendors only.",
            "Allergen protocols followed in segregated kitchens.",
          ].map((line, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-white/60">
              <span className="text-[#D4AF37] mt-0.5">•</span>
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
