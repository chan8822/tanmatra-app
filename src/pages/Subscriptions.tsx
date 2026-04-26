import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Calendar, CheckCircle, ChevronRight, Zap, Heart, Users } from "lucide-react";

const plans = [
  {
    id: "athlete-weekly",
    name: "Athlete Weekly",
    tagline: "High protein, muscle recovery focused",
    price: 1899,
    original: 2200,
    meals: 10,
    period: "week",
    icon: <Zap size={18} />,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    features: ["10 RD-verified meals", "35g+ avg protein", "Pre/post workout optimized", "Free delivery", "Priority KDS"],
    tracks: ["Athlete"],
  },
  {
    id: "family-weekly",
    name: "Family Weekly",
    tagline: "Balanced meals for 2 adults + 2 kids",
    price: 2499,
    original: 2900,
    meals: 14,
    period: "week",
    icon: <Users size={18} />,
    color: "text-white",
    bg: "bg-white/5",
    border: "border-white/10",
    features: ["14 meals (4 tracks)", "Junior + Senior + Everyday", "Portion customization", "Free delivery", "Nutrition report"],
    tracks: ["Junior", "Senior", "Everyday"],
  },
  {
    id: "everyday-daily",
    name: "Everyday Daily",
    tagline: "One balanced meal per day",
    price: 3499,
    original: 4000,
    meals: 30,
    period: "month",
    icon: <Heart size={18} />,
    color: "text-[#D4AF37]",
    bg: "bg-[#D4AF37]/10",
    border: "border-[#D4AF37]/20",
    features: ["30 meals (1 per day)", "Rotating menu", "Macro-balanced", "Free delivery", "Weekly check-in"],
    tracks: ["Everyday"],
  },
];

const howItWorks = [
  { step: "1", title: "Pick Your Plan", desc: "Choose a track that matches your health goals." },
  { step: "2", title: "Set Preferences", desc: "Tell us allergies, spice level, delivery time." },
  { step: "3", title: "We Cook & Deliver", desc: "Fresh meals arrive daily/weekly as scheduled." },
  { step: "4", title: "Track Progress", desc: "See nutrition stats and adjust your plan." },
];

export default function SubscriptionsPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [subscribed, setSubscribed] = useState(false);

  const subscribe = () => {
    if (!selected) return;
    const subs = JSON.parse(localStorage.getItem("tanmatra_subscriptions") || "[]");
    const plan = plans.find((p) => p.id === selected);
    subs.push({
      id: `SUB-${Date.now()}`,
      plan_id: selected,
      plan_name: plan?.name,
      status: "active",
      started_at: new Date().toISOString(),
      meals_remaining: plan?.meals || 0,
      total_meals: plan?.meals || 0,
    });
    localStorage.setItem("tanmatra_subscriptions", JSON.stringify(subs));
    setSubscribed(true);
  };

  return (
    <div className="fade-in pb-10">
      <Header title="Subscriptions" backTo="/" />

      <div className="px-4 py-6">
        <h1 className="font-serif text-3xl text-white mb-2">Meal<br/><span className="text-[#D4AF37]">Subscriptions</span></h1>
        <p className="text-sm text-white/50">Never think about what to eat again. RD-curated plans delivered on schedule.</p>
      </div>

      {/* Plans */}
      <div className="px-4 space-y-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => { setSelected(plan.id); setSubscribed(false); }}
            className={`relative p-4 rounded-xl border cursor-pointer ${selected === plan.id ? "border-[#D4AF37]/50 bg-[#D4AF37]/5" : "border-white/5 bg-[#1a1c1c]"}`}
          >
            {selected === plan.id && (
              <div className="absolute top-3 right-3 text-[#D4AF37]"><CheckCircle size={18} /></div>
            )}
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg ${plan.bg} flex items-center justify-center ${plan.color}`}>{plan.icon}</div>
              <div>
                <h3 className="text-sm font-semibold text-white">{plan.name}</h3>
                <p className="text-xs text-white/40">{plan.tagline}</p>
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl font-bold text-[#D4AF37]">₹{plan.price}</span>
              <span className="text-sm text-white/30 line-through">₹{plan.original}</span>
              <span className="text-[10px] text-green-400">Save ₹{plan.original - plan.price}</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/50 border border-white/5">{plan.meals} meals</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/50 border border-white/5">per {plan.period}</span>
              {plan.tracks.map((t) => (
                <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20">{t} Track</span>
              ))}
            </div>
            <ul className="space-y-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-[10px] text-white/50">
                  <CheckCircle size={10} className="text-[#D4AF37] shrink-0" /> {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Subscribe CTA */}
      {selected && !subscribed && (
        <div className="px-4 py-4">
          <button onClick={subscribe} className="w-full py-3.5 bg-[#D4AF37] text-[#0c0f0f] rounded-xl font-semibold text-sm active:scale-[0.98] transition-transform">
            Subscribe Now · ₹{plans.find((p) => p.id === selected)?.price}
          </button>
        </div>
      )}

      {subscribed && (
        <div className="px-4 py-4">
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
            <CheckCircle size={24} className="text-green-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-green-400">Subscription Activated!</p>
            <p className="text-xs text-white/50 mt-1">Your first delivery is scheduled. Check My Orders for updates.</p>
            <Link to="/orders" className="inline-block mt-3 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg text-xs text-green-400">
              View My Subscriptions
            </Link>
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="px-4 py-6">
        <h2 className="text-sm font-semibold text-white mb-4">How It Works</h2>
        <div className="space-y-3">
          {howItWorks.map((h) => (
            <div key={h.step} className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[10px] font-bold text-[#D4AF37] shrink-0">
                {h.step}
              </div>
              <div>
                <h3 className="text-xs font-semibold text-white">{h.title}</h3>
                <p className="text-[10px] text-white/40">{h.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Link to active subs */}
      <div className="px-4 pb-8">
        <Link to="/orders" className="block bg-[#1a1c1c] border border-white/5 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-[#D4AF37]" />
            <span className="text-sm text-white">My Active Subscriptions</span>
          </div>
          <ChevronRight size={16} className="text-white/20" />
        </Link>
      </div>
    </div>
  );
}
