import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, CheckCircle, Zap, Heart, Salad, TrendingDown, Crown, Star, Loader2 } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { p } from "@/lib/format";

const plans = [
  {
    name: "Everyday Wellness",
    icon: Heart,
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    meals: "Lunch + Dinner",
    price: 5999,
    period: "month",
    features: ["2 meals/day, 6 days/week", "RD-approved macro balanced", "Free delivery", "Pause anytime"],
  },
  {
    name: "Athlete Fuel",
    icon: Zap,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    meals: "Breakfast + Lunch + Dinner",
    price: 8999,
    period: "month",
    features: ["3 meals/day, 7 days/week", "35g+ protein per meal", "Pre/post workout snacks", "Priority delivery"],
  },
  {
    name: "Family Pack",
    icon: Salad,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    meals: "4-person meals",
    price: 12999,
    period: "month",
    features: ["4 servings per meal", "Kid-friendly options", "Variety menu", "Weekend special dishes"],
  },
];

export default function SubscriptionsPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const [subscribed, setSubscribed] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleSubscribe = () => {
    setProcessing(true);
    setTimeout(() => {
      const plan = plans[selected];
      localStorage.setItem("tanmatra_subscription", JSON.stringify({ plan: plan.name, price: plan.price, startedAt: new Date().toISOString() }));
      setProcessing(false);
      setSubscribed(true);
    }, 1500);
  };

  if (subscribed) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
          <CheckCircle size={32} className="text-green-400" />
        </div>
        <h2 className="text-xl font-bold mb-1">Subscription Active!</h2>
        <p className="text-sm text-white/50 mb-1">{plans[selected].name} plan</p>
        <p className="text-xs text-white/30 mb-8">Your first meal will be delivered tomorrow. Pause anytime from Profile.</p>
        <div className="flex gap-3 w-full max-w-xs">
          <button onClick={() => navigate(ROUTES.menu)} className="flex-1 btn-gold text-sm py-3 rounded-xl">Browse Menu</button>
          <button onClick={() => navigate(ROUTES.home)} className="flex-1 btn-outline text-sm py-3 rounded-xl">Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-6">
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-white/60"><ArrowLeft size={22} /></button>
        <Calendar size={20} className="text-[#D4AF37]" />
        <h1 className="text-base font-semibold">Meal Subscriptions</h1>
      </div>

      <div className="px-4 py-4">
        <p className="text-sm text-white/40 mb-4">Subscribe to save up to 30% on daily healthy meals</p>

        {/* Why subscribe */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { label: "Save 30%", desc: "vs ordering daily" },
            { label: "Free delivery", desc: "Always" },
            { label: "Pause anytime", desc: "No questions" },
            { label: "RD curated", desc: "Rotating menu" },
          ].map((item) => (
            <div key={item.label} className="card p-2.5 text-center">
              <p className="text-xs font-bold text-[#D4AF37]">{item.label}</p>
              <p className="text-[10px] text-white/40">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {plans.map((plan, i) => (
            <button key={plan.name} onClick={() => setSelected(i)} className={`w-full card p-4 text-left border-2 transition-colors ${selected === i ? "border-[#D4AF37] bg-[#D4AF37]/5" : "border-transparent"}`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl ${plan.bg} flex items-center justify-center shrink-0`}>
                  <plan.icon size={20} className={plan.color} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{plan.name}</p>
                    {selected === i && <CheckCircle size={16} className="text-[#D4AF37]" />}
                  </div>
                  <p className="text-xs text-white/40">{plan.meals}</p>
                  <p className="text-lg font-bold text-[#D4AF37] mt-1">{p(plan.price)}<span className="text-xs text-white/30 font-normal">/{plan.period}</span></p>
                  <div className="mt-2 space-y-1">
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-center gap-1.5 text-[11px] text-white/50">
                        <CheckCircle size={10} className="text-green-400" /> {f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Savings breakdown */}
        <div className="mt-4 card p-4">
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
            <TrendingDown size={14} className="text-green-400" /> Your Savings
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-white/50">
              <span>A-la-carte monthly cost</span>
              <span className="line-through">{p(Math.round(plans[selected].price * 1.43))}</span>
            </div>
            <div className="flex justify-between text-white/50">
              <span>Subscription price</span>
              <span>{p(plans[selected].price)}</span>
            </div>
            <div className="h-px bg-white/5" />
            <div className="flex justify-between font-bold text-green-400">
              <span>You save</span>
              <span>{p(Math.round(plans[selected].price * 0.43))}</span>
            </div>
          </div>
        </div>

        {/* Gold bundle */}
        <div className="mt-3 p-3 bg-gradient-to-r from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/20 rounded-xl flex items-center gap-3">
          <Crown size={16} className="text-[#D4AF37] shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-bold text-[#D4AF37]">Gold + Subscription bundle</p>
            <p className="text-[10px] text-white/40">Get Gold membership FREE with 3-month plan</p>
          </div>
          <Star size={14} className="text-[#D4AF37] shrink-0" />
        </div>
      </div>

      <div className="px-4 mt-4">
        <button onClick={handleSubscribe} disabled={processing} className="w-full btn-primary rounded-xl flex items-center justify-center gap-2">
          {processing ? <Loader2 size={16} className="animate-spin" /> : null}
          {processing ? "Processing..." : `Subscribe Now · ${p(plans[selected].price)}`}
        </button>
        <p className="text-[10px] text-white/30 text-center mt-2">Cancel anytime. No hidden charges.</p>
      </div>
    </div>
  );
}
