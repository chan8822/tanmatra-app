import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Crown, Check, Star, Zap, Percent, Truck, Heart, Calculator, Loader2 } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { p } from "@/lib/format";

const benefits = [
  { icon: Percent, label: "20% off every order", desc: "No minimum order value" },
  { icon: Truck, label: "Free delivery", desc: "On all orders, always" },
  { icon: Zap, label: "Priority delivery", desc: "Get your meals 15 min faster" },
  { icon: Heart, label: "Free RD consultation", desc: "1 session per month" },
  { icon: Star, label: "Exclusive dishes", desc: "Gold-member-only menu items" },
];

const plans = [
  { duration: "1 Month", price: 299, perDay: 10, popular: false },
  { duration: "3 Months", price: 799, perDay: 9, popular: true },
  { duration: "12 Months", price: 2499, perDay: 7, popular: false },
];

export default function GoldPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(1);
  const [upgraded, setUpgraded] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleUpgrade = () => {
    setProcessing(true);
    setTimeout(() => {
      const plan = plans[selected];
      localStorage.setItem("tanmatra_gold", JSON.stringify({ plan: plan.duration, price: plan.price, startedAt: new Date().toISOString() }));
      setProcessing(false);
      setUpgraded(true);
    }, 1500);
  };

  if (upgraded) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-4">
          <Crown size={32} className="text-[#D4AF37]" />
        </div>
        <h2 className="text-xl font-bold mb-1">Welcome to Gold!</h2>
        <p className="text-sm text-white/50 mb-1">{plans[selected].duration} membership active</p>
        <p className="text-xs text-white/30 mb-8">You now get 20% off, free delivery, and priority service on every order.</p>
        <div className="flex gap-3 w-full max-w-xs">
          <button onClick={() => navigate(ROUTES.menu)} className="flex-1 btn-gold text-sm py-3 rounded-xl">Order Now</button>
          <button onClick={() => navigate(ROUTES.home)} className="flex-1 btn-outline text-sm py-3 rounded-xl">Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-6">
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-white/60"><ArrowLeft size={22} /></button>
        <Crown size={20} className="text-[#D4AF37]" />
        <h1 className="text-base font-semibold">Tanmatra Gold</h1>
      </div>

      {/* Hero */}
      <div className="px-4 py-5">
        <div className="card p-5 bg-gradient-to-br from-[#D4AF37]/20 to-[#141414] border-[#D4AF37]/30 text-center">
          <Crown size={32} className="text-[#D4AF37] mx-auto mb-2" />
          <h2 className="text-lg font-bold mb-1">Unlock Gold Benefits</h2>
          <p className="text-xs text-white/40">Premium perks for health-conscious eaters</p>
        </div>
      </div>

      {/* Benefits */}
      <div className="px-4 space-y-2 mb-5">
        {benefits.map((b) => (
          <div key={b.label} className="flex items-center gap-3 p-3 card">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
              <b.icon size={14} className="text-[#D4AF37]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{b.label}</p>
              <p className="text-[10px] text-white/40">{b.desc}</p>
            </div>
            <Check size={14} className="text-green-400 shrink-0" />
          </div>
        ))}
      </div>

      {/* Plans */}
      <div className="px-4">
        <h3 className="text-sm font-bold mb-3">Choose Your Plan</h3>
        <div className="space-y-3">
          {plans.map((plan, i) => (
            <button key={plan.duration} onClick={() => setSelected(i)} className={`w-full card p-4 text-left border-2 relative transition-colors ${selected === i ? "border-[#D4AF37] bg-[#D4AF37]/5" : "border-transparent"}`}>
              {plan.popular && <span className="absolute top-2 right-2 text-[8px] font-bold bg-[#D4AF37] text-[#0a0a0a] px-1.5 py-0.5 rounded">POPULAR</span>}
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold">{plan.duration}</span>
                <span className="text-lg font-bold text-[#D4AF37]">{p(plan.price)}</span>
              </div>
              <p className="text-[10px] text-white/40">{p(plan.perDay)}/day equivalent</p>
            </button>
          ))}
        </div>
      </div>

      {/* Savings calculator */}
      <div className="px-4 mt-5">
        <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
          <Calculator size={14} className="text-[#D4AF37]" /> How much you will save
        </h3>
        <div className="card p-4 space-y-2">
          {[
            { label: "If you order 2x/week", save: 240 },
            { label: "If you order 4x/week", save: 580 },
            { label: "If you order daily", save: 1240 },
          ].map((row) => (
            <div key={row.label} className="flex justify-between text-xs">
              <span className="text-white/50">{row.label}</span>
              <span className="text-green-400 font-bold">Save {p(row.save)}/mo</span>
            </div>
          ))}
          <div className="h-px bg-white/5 my-1" />
          <p className="text-[10px] text-white/30">Includes 20% off + free delivery savings vs aggregator platforms</p>
        </div>
      </div>

      <div className="px-4 mt-6">
        <button onClick={handleUpgrade} disabled={processing} className="w-full btn-gold rounded-xl flex items-center justify-center gap-2">
          {processing ? <Loader2 size={16} className="animate-spin" /> : null}
          {processing ? "Processing..." : `Upgrade to Gold · ${p(plans[selected].price)}`}
        </button>
        <p className="text-[10px] text-white/30 text-center mt-2">Cancel anytime. Benefits apply immediately.</p>
      </div>
    </div>
  );
}
