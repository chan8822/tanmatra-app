import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, ChevronRight, Gift, Zap, Salad, Shield, Users, Target, Stethoscope, Brain, Star, Clock, Crown, Calendar, TrendingUp, Ticket, Sparkles, Timer, Info, X, HelpCircle } from "lucide-react";
import { menuItems } from "@/data/menu";
import { ROUTES } from "@/lib/routes";
import { cartStore } from "@/lib/store";
import { p, saveVsAggregator } from "@/lib/format";
import { BottomNav } from "@/components/BottomNav";

const tiles = [
  { label: "All Offers", sub: "Deals", icon: Gift, filter: "offers", grad: "from-amber-500/20 to-amber-500/5", text: "text-amber-400" },
  { label: "Quick Meals", sub: "<15 min", icon: Zap, filter: "quick", grad: "from-orange-500/20 to-orange-500/5", text: "text-orange-400" },
  { label: "Wellness", sub: "Healthy", icon: Salad, filter: "wellness", grad: "from-green-500/20 to-green-500/5", text: "text-green-400" },
  { label: "RD Verified", sub: "Trusted", icon: Shield, filter: "rdverified", grad: "from-blue-500/20 to-blue-500/5", text: "text-blue-400" },
  { label: "Family Meals", sub: "Sharing", icon: Users, filter: "family", grad: "from-purple-500/20 to-purple-500/5", text: "text-purple-400" },
  { label: "Your Segment", sub: "Protein+", icon: Target, filter: "segment", grad: "from-red-500/20 to-red-500/5", text: "text-red-400" },
];

const promos = [
  { title: "100 OFF FIRST ORDER", sub: "Use code FIRST100 on your first order", cta: "Order now", img: "/dish/hm3.jpg" },
  { title: "ITEMS AT 50% OFF", sub: "On all healthy meals & salads this week", cta: "Claim now", img: "/dish/sa1.jpg" },
  { title: "SAVE 45 vs SWIGGY", sub: "Direct from kitchen, no aggregator markup", cta: "Compare", img: "/dish/bb1.jpg" },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [count, setCount] = useState(0);
  const [showRDInfo, setShowRDInfo] = useState(false);
  const [showSegmentInfo, setShowSegmentInfo] = useState(false);
  const [flashTime, setFlashTime] = useState(3 * 60 * 60); // 3 hours in seconds

  // Live countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setFlashTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  useEffect(() => {
    setCount(cartStore.getCount());
    return cartStore.subscribe(() => setCount(cartStore.getCount()));
  }, []);

  const featured = menuItems.slice(0, 8);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-20">
      {/* Address Bar */}
      <div className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-md px-4 pt-3 pb-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-lg bg-[#D4AF37] flex items-center justify-center"><span className="text-[#0a0a0a] text-xs font-black">T</span></div>
            <span className="text-sm font-bold">Tanmatra</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link to={ROUTES.cart} className="relative p-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6h15l-1.5 9h-12z" /><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></svg>
              {count > 0 && <span className="absolute top-0 right-0 min-w-[14px] h-3.5 bg-[#E23744] rounded-full text-[8px] font-bold flex items-center justify-center px-0.5">{count}</span>}
            </Link>
          </div>
        </div>
        <button onClick={() => navigate(ROUTES.settings)} className="flex items-center gap-1.5 text-xs text-white/50">
          <MapPin size={12} className="text-[#D4AF37]" />
          <span className="truncate">52 U Block, Sector 24, Gurgaon</span>
          <ChevronRight size={10} />
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-2">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && search && navigate(`${ROUTES.menu}?search=${search}`)} placeholder="Search dishes, ingredients..." className="w-full pl-9 pr-3 py-2.5 bg-[#141414] border border-white/10 rounded-xl text-sm placeholder:text-white/30 outline-none focus:border-[#D4AF37]/50" />
        </div>
      </div>

      {/* Promo Carousel */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 py-2 snap-x snap-mandatory">
        {promos.map((p) => (
          <button key={p.title} onClick={() => navigate(ROUTES.menu)} className="snap-start shrink-0 w-[280px] h-28 rounded-2xl overflow-hidden relative active:scale-[0.98] transition-transform">
            <img src={p.img} alt="" className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 p-3 flex flex-col justify-between">
              <div>
                <p className="text-sm font-bold text-white">{p.title}</p>
                <p className="text-[10px] text-white/60 mt-0.5">{p.sub}</p>
              </div>
              <span className="text-[10px] font-semibold text-[#D4AF37] bg-black/40 px-2 py-1 rounded-lg self-start">{p.cta} &rsaquo;</span>
            </div>
          </button>
        ))}
      </div>

      {/* Tanmatra Gold Upsell Banner */}
      <div className="mx-4 mt-3 p-3.5 bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/30 rounded-2xl flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center shrink-0">
          <Crown size={20} className="text-[#D4AF37]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[#D4AF37]">Unlock Tanmatra Gold</p>
          <p className="text-[11px] text-white/50">Save 20% + free delivery on every order</p>
        </div>
        <button onClick={() => navigate(ROUTES.gold)} className="shrink-0 px-3 py-1.5 bg-[#D4AF37] text-[#0a0a0a] text-[11px] font-bold rounded-lg">
          Join Now
        </button>
      </div>

      {/* Flash Sale Timer Banner */}
      <div className="mx-4 mt-3 p-3.5 bg-gradient-to-r from-red-500/20 to-red-500/5 border border-red-500/30 rounded-2xl flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0">
          <Timer size={20} className="text-red-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-red-400">Flash Sale: 50% OFF Salads</p>
          <p className="text-[11px] text-white/50">Ends in {formatTime(flashTime)} &middot; Limited quantities</p>
        </div>
        <button onClick={() => navigate(`${ROUTES.menu}?filter=offers`)} className="shrink-0 px-3 py-1.5 bg-red-500/20 border border-red-500/30 text-red-400 text-[11px] font-bold rounded-lg">
          Grab Now
        </button>
      </div>

      {/* Quick Access Tiles */}
      <div className="px-4 py-2">
        <div className="grid grid-cols-3 gap-2.5">
          {tiles.map((t) => (
            <button key={t.label} onClick={() => {
              if (t.filter === "segment") { setShowSegmentInfo(true); return; }
              navigate(`${ROUTES.menu}?filter=${t.filter}`);
            }}
              className={`flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl border border-white/5 bg-gradient-to-br ${t.grad} active:scale-[0.97] transition-transform relative`}>
              <t.icon size={20} className={t.text} />
              <p className="text-[11px] font-semibold leading-tight">{t.label}</p>
              <p className="text-[9px] text-white/40">{t.sub}</p>
              {t.filter === "rdverified" && (
                <button onClick={(e) => { e.stopPropagation(); setShowRDInfo(true); }} className="absolute top-1 right-1 w-4 h-4 bg-white/10 rounded-full flex items-center justify-center">
                  <Info size={8} className="text-white/40" />
                </button>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Feature Tiles */}
      <div className="px-4 py-2 grid grid-cols-2 gap-2.5">
        <button onClick={() => navigate(ROUTES.consultRD)} className="flex items-center gap-2.5 p-3 bg-gradient-to-r from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/20 rounded-xl text-left active:scale-[0.98] transition-transform">
          <div className="w-9 h-9 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center shrink-0"><Stethoscope size={16} className="text-[#D4AF37]" /></div>
          <div><p className="text-[11px] font-semibold">Talk to Our RD</p><p className="text-[9px] text-white/40">Free consultation</p></div>
          <ChevronRight size={12} className="text-[#D4AF37] ml-auto shrink-0" />
        </button>
        <button onClick={() => navigate(ROUTES.healthQuiz)} className="flex items-center gap-2.5 p-3 bg-gradient-to-r from-green-500/10 to-transparent border border-green-500/20 rounded-xl text-left active:scale-[0.98] transition-transform">
          <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0"><Brain size={16} className="text-green-400" /></div>
          <div><p className="text-[11px] font-semibold">Health Quiz</p><p className="text-[9px] text-white/40">Personalized plan</p></div>
          <ChevronRight size={12} className="text-green-400 ml-auto shrink-0" />
        </button>
      </div>

      {/* Subscription Upsell */}
      <div className="mx-4 mt-3 p-4 card border-l-2 border-l-green-500">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
            <Calendar size={20} className="text-green-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold">Subscribe & Save 30%</p>
            <p className="text-[11px] text-white/50 mt-0.5">Daily healthy meals delivered. Pause anytime.</p>
            <div className="flex gap-2 mt-2">
              <span className="text-[9px] px-2 py-0.5 bg-green-500/10 text-green-400 rounded-full border border-green-500/20">2 meals/day</span>
              <span className="text-[9px] px-2 py-0.5 bg-green-500/10 text-green-400 rounded-full border border-green-500/20">6 days/week</span>
            </div>
          </div>
          <button onClick={() => navigate(ROUTES.subscriptions)} className="shrink-0 px-3 py-1.5 bg-green-500/20 border border-green-500/30 text-green-400 text-[10px] font-bold rounded-lg">
            View Plans
          </button>
        </div>
      </div>

      {/* Loyalty / Wallet Banner */}
      <div className="mx-4 mt-3 p-4 card">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Ticket size={14} className="text-[#D4AF37]" />
            <p className="text-sm font-bold">Your Wallet</p>
          </div>
          <span className="text-sm font-bold text-[#D4AF37]">{p(50)}</span>
        </div>
        <p className="text-[10px] text-white/40">Earn 1 point per 10 spent &middot; 100 pts = {p(50)} off</p>
        <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-[#D4AF37] rounded-full" style={{ width: "35%" }} />
        </div>
        <p className="text-[9px] text-white/30 mt-1">35 points &middot; 65 more to unlock {p(50)}</p>
      </div>

      {/* Featured Dishes */}
      <div className="px-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold">Recommended For You</h2>
          <Link to={ROUTES.menu} className="text-[11px] text-[#D4AF37]">See all</Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {featured.map((d) => {
            const swiggyPrice = Math.round(d.price * 1.53);
            const savings = swiggyPrice - d.price;
            return (
              <button key={d.id} onClick={() => navigate(ROUTES.dish(d.id))} className="text-left active:scale-[0.98] transition-transform">
                <div className="h-28 rounded-xl overflow-hidden bg-[#141414] relative mb-2">
                  <img src={d.image || `/dish/${d.id}.jpg`} alt={d.name} className="w-full h-full object-cover" loading="lazy" />
                  {d.rd_verified && <div className="absolute top-2 left-2 bg-[#D4AF37] text-[#0a0a0a] text-[8px] font-bold px-1.5 py-0.5 rounded">RD VERIFIED</div>}
                  <div className="absolute bottom-2 left-2 flex items-center gap-0.5 bg-black/60 px-1.5 py-0.5 rounded">
                    <Star size={8} className="text-green-400 fill-green-400" /><span className="text-[9px] font-bold">{(4 + Math.random() * 0.9).toFixed(1)}</span>
                  </div>
                  <div className="absolute bottom-2 right-2 flex items-center gap-0.5 bg-black/60 px-1.5 py-0.5 rounded">
                    <Clock size={8} className="text-white/60" /><span className="text-[9px]">{d.prep_time || 15} min</span>
                  </div>
                </div>
                <p className="text-xs font-semibold truncate">{d.name}</p>
                <p className="text-[10px] text-white/40">{d.calories || 300} kcal &middot; {d.protein || 15}g protein</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-xs font-bold text-[#D4AF37]">{p(d.price)}</span>
                  <span className="text-[9px] text-white/30 line-through">{p(swiggyPrice)}</span>
                  <span className="text-[8px] px-1 bg-green-500/10 text-green-400 rounded">Save {p(savings)}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Combo Offers Section */}
      <div className="px-4 mt-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold">Combo Deals</h2>
          <span className="text-[10px] px-2 py-0.5 bg-red-500/10 text-red-400 rounded-full border border-red-500/20">Save up to 40%</span>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {[
            { name: "Power Lunch Combo", items: "Wrap + Salad + Drink", price: 299, original: 420, img: "/dish/w1.jpg" },
            { name: "Family Dinner Combo", items: "2 Bowls + 2 Drinks + Dessert", price: 549, original: 780, img: "/dish/bb1.jpg" },
            { name: "Fitness Protein Combo", items: "Omelette + Bowl + Smoothie", price: 399, original: 560, img: "/dish/o4.jpg" },
          ].map((combo) => (
            <button key={combo.name} onClick={() => navigate(ROUTES.menu)} className="shrink-0 w-52 text-left">
              <div className="w-52 h-28 rounded-xl overflow-hidden bg-[#141414] relative mb-2">
                <img src={combo.img} alt={combo.name} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute top-2 left-2 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">{Math.round((1 - combo.price/combo.original)*100)}% OFF</div>
              </div>
              <p className="text-xs font-semibold">{combo.name}</p>
              <p className="text-[9px] text-white/40">{combo.items}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-xs font-bold text-[#D4AF37]">{p(combo.price)}</span>
                <span className="text-[9px] text-white/30 line-through">{p(combo.original)}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Referral Banner */}
      <div className="mx-4 mt-3 p-3.5 card border border-[#D4AF37]/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
            <Sparkles size={20} className="text-[#D4AF37]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-[#D4AF37]">Refer & Earn {p(50)}</p>
            <p className="text-[10px] text-white/40">Share your code. Both get {p(50)} credit.</p>
          </div>
          <button
            onClick={() => {
              const text = "Order healthy meals on Tanmatra and get 50 off! Use my code: TAN50";
              if (navigator.share) { navigator.share({ title: "Tanmatra", text }); }
              else { navigator.clipboard.writeText(text); alert("Referral code copied to clipboard!"); }
            }}
            className="shrink-0 px-3 py-1.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-bold rounded-lg"
          >
            Share
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 mt-8 mb-4 space-y-4">
        <div className="h-px bg-white/5" />
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-[#D4AF37] flex items-center justify-center"><span className="text-[#0a0a0a] text-sm font-black">T</span></div>
          <span className="text-sm font-bold">Tanmatra</span>
        </div>
        <p className="text-xs text-white/40">RD-verified healthy meals delivered to your doorstep. No aggregator markup. Noida & Gurgaon.</p>
        <div className="flex gap-4 text-xs text-white/40">
          <Link to={ROUTES.support} className="hover:text-white/60">Support</Link>
          <Link to={ROUTES.subscriptions} className="hover:text-white/60">Subscriptions</Link>
          <Link to={ROUTES.gold} className="hover:text-white/60">Gold</Link>
        </div>
        <p className="text-[10px] text-white/20">2026 Tanmatra. All rights reserved.</p>
      </div>

      {/* RD Verified Info Modal */}
      {showRDInfo && (
        <div className="fixed inset-0 z-[10000] bg-black/80 flex items-end sm:items-center justify-center p-4" onClick={() => setShowRDInfo(false)}>
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-5 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-[#D4AF37]" />
                <h3 className="text-sm font-bold">RD Verified</h3>
              </div>
              <button onClick={() => setShowRDInfo(false)} className="text-white/40"><X size={16} /></button>
            </div>
            <p className="text-xs text-white/50 leading-relaxed mb-3">
              Every RD Verified meal is individually reviewed by our registered dietitians for macronutrient balance, portion sizing, and ingredient quality. Look for this badge when you want meals that are clinically approved for daily consumption.
            </p>
            <div className="flex gap-2">
              <div className="flex-1 p-2 bg-[#0a0a0a] rounded-lg text-center">
                <p className="text-xs font-bold text-[#D4AF37]">83</p>
                <p className="text-[9px] text-white/40">RD Verified</p>
              </div>
              <div className="flex-1 p-2 bg-[#0a0a0a] rounded-lg text-center">
                <p className="text-xs font-bold text-[#D4AF37]">4</p>
                <p className="text-[9px] text-white/40">RDs on staff</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Segment Info Modal */}
      {showSegmentInfo && (
        <div className="fixed inset-0 z-[10000] bg-black/80 flex items-end sm:items-center justify-center p-4" onClick={() => setShowSegmentInfo(false)}>
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-5 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target size={18} className="text-red-400" />
                <h3 className="text-sm font-bold">Your Segment</h3>
              </div>
              <button onClick={() => setShowSegmentInfo(false)} className="text-white/40"><X size={16} /></button>
            </div>
            <p className="text-xs text-white/50 leading-relaxed mb-3">
              Your Segment is determined by your Health Quiz results and order history. It helps us recommend meals that match your specific nutrition goals — whether that's high protein, low carb, or balanced macros.
            </p>
            <button onClick={() => { setShowSegmentInfo(false); navigate(ROUTES.healthQuiz); }} className="w-full btn-primary text-xs py-2.5 rounded-xl">
              Take Health Quiz
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
