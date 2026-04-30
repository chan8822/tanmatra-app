import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, ChevronRight, Gift, Zap, Salad, Shield, Users, Target, Stethoscope, Brain, Star, Clock } from "lucide-react";
import { menuItems } from "@/data/menu";
import { ROUTES } from "@/lib/routes";
import { cartStore } from "@/lib/store";
import { p } from "@/lib/format";
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
  { title: "100 OFF FIRST ORDER", sub: "Use code FIRST100", cta: "Order now", img: "/dish/hm3.jpg" },
  { title: "ITEMS AT 50% OFF", sub: "On healthy meals this week", cta: "Claim now", img: "/dish/sa1.jpg" },
  { title: "SAVE 45 vs SWIGGY", sub: "Direct from kitchen", cta: "Compare", img: "/dish/bb1.jpg" },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [count, setCount] = useState(0);

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
        <button className="flex items-center gap-1.5 text-xs text-white/50">
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

      {/* Quick Access Tiles */}
      <div className="px-4 py-2">
        <div className="grid grid-cols-3 gap-2.5">
          {tiles.map((t) => (
            <button key={t.label} onClick={() => navigate(`${ROUTES.menu}?filter=${t.filter}`)}
              className={`flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl border border-white/5 bg-gradient-to-br ${t.grad} active:scale-[0.97] transition-transform`}>
              <t.icon size={20} className={t.text} />
              <p className="text-[11px] font-semibold leading-tight">{t.label}</p>
              <p className="text-[9px] text-white/40">{t.sub}</p>
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

      {/* Featured Dishes */}
      <div className="px-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold">Recommended For You</h2>
          <Link to={ROUTES.menu} className="text-[11px] text-[#D4AF37]">See all</Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {featured.map((d) => (
            <button key={d.id} onClick={() => navigate(ROUTES.dish(d.id))} className="text-left active:scale-[0.98] transition-transform">
              <div className="h-28 rounded-xl overflow-hidden bg-[#141414] relative mb-2">
                <img src={d.image || `/dish/${d.id}.jpg`} alt={d.name} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute top-2 left-2 bg-[#D4AF37] text-[#0a0a0a] text-[8px] font-bold px-1.5 py-0.5 rounded">RD VERIFIED</div>
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
                <span className="text-[9px] text-white/30 line-through">{p(d.price * 1.15)}</span>
                <span className="text-[8px] px-1 bg-green-500/10 text-green-400 rounded">Save {p(Math.round(d.price * 0.15))}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
