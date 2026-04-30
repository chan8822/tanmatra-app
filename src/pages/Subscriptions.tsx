import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, CheckCircle, Zap, Heart, Salad, ChevronRight } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-6">
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-white/60"><ArrowLeft size={22} /></button>
        <Calendar size={20} className="text-[#D4AF37]" />
        <h1 className="text-base font-semibold">Meal Subscriptions</h1>
      </div>

      <div className="px-4 py-4">
        <p className="text-sm text-white/40 mb-4">Subscribe to save up to 30% on daily healthy meals</p>

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
      </div>

      <div className="px-4 mt-4">
        <button className="w-full btn-primary rounded-xl">
          Subscribe Now &middot; {p(plans[selected].price)}
        </button>
        <p className="text-[10px] text-white/30 text-center mt-2">Cancel anytime. No hidden charges.</p>
      </div>
    </div>
  );
}
