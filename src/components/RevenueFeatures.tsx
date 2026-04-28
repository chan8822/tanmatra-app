import { useNavigate } from "react-router-dom";
import { Calendar, Zap, ChevronRight, Gift, Star } from "lucide-react";

const plans = [
  {
    id: "weekly",
    name: "Wellness Weekly",
    meals: "7 meals",
    price: 1399,
    original: 1800,
    savings: 401,
    badge: "Most Popular",
    color: "from-[#D4AF37]/30 to-[#D4AF37]/5",
    features: ["7 RD-verified meals", "Free delivery", "Priority support", "Pause anytime"],
  },
  {
    id: "monthly",
    name: "Athlete Monthly",
    meals: "30 meals",
    price: 4999,
    original: 6500,
    savings: 1501,
    badge: "Best Value",
    color: "from-green-500/20 to-green-500/5",
    features: ["30 high-protein meals", "Free delivery", "Nutrition consult", "Exclusive menu access"],
  },
  {
    id: "family",
    name: "Family Pack",
    meals: "14 meals",
    price: 2799,
    original: 3800,
    savings: 1001,
    badge: "For 4",
    color: "from-purple-500/20 to-purple-500/5",
    features: ["14 family-size meals", "Free delivery", "Custom spice levels", "Weekend special"],
  },
];

export function SubscriptionSection() {
  const navigate = useNavigate();

  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Meal Subscriptions</h2>
          <p className="text-[10px] text-white/40">Save up to 25% with weekly plans</p>
        </div>
        <button onClick={() => navigate("/subscriptions")} className="text-[11px] text-[#D4AF37] flex items-center gap-0.5">
          View all <ChevronRight size={12} />
        </button>
      </div>

      <div className="space-y-3">
        {plans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => navigate("/subscriptions")}
            className={`w-full text-left p-3.5 rounded-xl border border-white/5 bg-gradient-to-r ${plan.color} active:scale-[0.98] transition-transform`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                  <Calendar size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{plan.name}</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-[#D4AF37]/20 text-[#D4AF37] rounded-full">{plan.badge}</span>
                  </div>
                  <p className="text-[10px] text-white/40">{plan.meals} &middot; Save &#8377;{plan.savings}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-[#D4AF37]">&#8377;{plan.price}</p>
                <p className="text-[10px] text-white/30 line-through">&#8377;{plan.original}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-2">
              {plan.features.slice(0, 2).map((f) => (
                <span key={f} className="text-[9px] text-white/40 flex items-center gap-1">
                  <Zap size={8} className="text-[#D4AF37]" /> {f}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function ComboOffersSection() {
  const navigate = useNavigate();

  const combos = [
    {
      id: "power-lunch",
      name: "Power Lunch Combo",
      items: "Soup + Wrap + Drink",
      price: 299,
      original: 420,
      savings: 121,
      image: "/dish/w1.jpg",
    },
    {
      id: "family-dinner",
      name: "Family Dinner Combo",
      items: "2 Thalis + 2 Desserts + Drinks",
      price: 599,
      original: 850,
      savings: 251,
      image: "/dish/mb1.jpg",
    },
    {
      id: "protein-pack",
      name: "Protein Power Pack",
      items: "Bowl + Smoothie + Omelette",
      price: 399,
      original: 550,
      savings: 151,
      image: "/dish/bb1.jpg",
    },
  ];

  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Combo Offers</h2>
          <p className="text-[10px] text-white/40">Curated bundles at best prices</p>
        </div>
        <Gift size={16} className="text-[#D4AF37]" />
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
        {combos.map((combo) => (
          <button
            key={combo.id}
            onClick={() => navigate("/menu")}
            className="shrink-0 w-[200px] bg-[#1a1c1c] border border-white/5 rounded-xl overflow-hidden active:scale-[0.98] transition-transform"
          >
            <div className="relative h-24">
              <img src={combo.image} alt={combo.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-2 left-2">
                <span className="text-[9px] bg-red-500 text-white px-1.5 py-0.5 rounded font-bold">Save &#8377;{combo.savings}</span>
              </div>
            </div>
            <div className="p-2.5">
              <h3 className="text-xs font-semibold truncate">{combo.name}</h3>
              <p className="text-[9px] text-white/40 mt-0.5">{combo.items}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="text-sm font-bold text-[#D4AF37]">&#8377;{combo.price}</span>
                <span className="text-[9px] text-white/30 line-through">&#8377;{combo.original}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function GoldUpsellCard() {
  const navigate = useNavigate();

  return (
    <div className="px-4 py-3">
      <button
        onClick={() => navigate("/gold")}
        className="w-full relative overflow-hidden bg-gradient-to-r from-[#2a2520] via-[#1a1c1c] to-[#2a2520] border border-[#D4AF37]/30 rounded-xl p-4 text-left active:scale-[0.98] transition-transform"
      >
        {/* Decorative pattern */}
        <div className="absolute top-0 right-0 w-24 h-24 opacity-5">
          <div className="grid grid-cols-4 gap-1">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="w-5 h-5 border border-[#D4AF37] rotate-45" />
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center">
                <Star size={18} className="text-[#0c0f0f] fill-[#0c0f0f]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#D4AF37]">Unlock Tanmatra Gold</h3>
                <p className="text-[10px] text-white/40">Free delivery & exclusive discounts</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-[#D4AF37]" />
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3">
            {[
              { label: "Free Delivery", value: "All Orders" },
              { label: "Extra Off", value: "Up to 30%" },
              { label: "Priority", value: "Support" },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#D4AF37]/5 rounded-lg p-2 text-center">
                <p className="text-[10px] text-[#D4AF37] font-semibold">{stat.value}</p>
                <p className="text-[9px] text-white/40">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#D4AF37] text-[#0c0f0f] text-[10px] font-bold rounded-full">
            <Zap size={10} /> Upgrade for &#8377;199/month
          </div>
        </div>
      </button>
    </div>
  );
}

export function LoyaltyExplainer() {
  return (
    <div className="px-4 py-3">
      <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
            <Gift size={14} className="text-green-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Tanmatra Rewards</h3>
            <p className="text-[10px] text-white/40">Earn on every order</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {[
            { step: 1, label: "Order", desc: "1 pt per &#8377;10" },
            { step: 2, label: "Earn", desc: "100 pts = &#8377;50" },
            { step: 3, label: "Redeem", desc: "On next order" },
          ].map((s) => (
            <div key={s.step} className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] text-xs font-bold">
                {s.step}
              </div>
              <p className="text-[10px] font-medium text-white mt-1">{s.label}</p>
              <p className="text-[8px] text-white/30">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
