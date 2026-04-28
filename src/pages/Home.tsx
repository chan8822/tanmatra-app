import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { FilterSheet } from "@/components/FilterSheet";
import { QuickAccessTiles } from "@/components/QuickAccessTiles";
import { DishCard } from "@/components/DishCard";
import { SectionHeader } from "@/components/SectionHeader";
import { SearchModal } from "@/components/SearchModal";
import { LocationModal } from "@/components/LocationModal";
import { SubscriptionSection, ComboOffersSection, GoldUpsellCard, LoyaltyExplainer } from "@/components/RevenueFeatures";
import { useLocation } from "@/hooks/useLocation";
import { API } from "@/lib/api";
import {
  MapPin, ChevronDown, Search, Wallet, User, Mic, Leaf, SlidersHorizontal,
  Shield, Sparkles, Gift
} from "lucide-react";

const PROMO_BANNERS = [
  { id: 1, title: "&#8377;100 OFF FIRST ORDER", subtitle: "Use code FIRST20 on your first order", cta: "Order now", image: "/dish/hm3.jpg" },
  { id: 2, title: "ITEMS AT 50% OFF", subtitle: "On all healthy meals & salads this week", cta: "Claim now", image: "/dish/sa1.jpg" },
  { id: 3, title: "SAVE &#8377;45 vs SWIGGY", subtitle: "Direct from kitchen, no aggregator markup", cta: "Compare", image: "/dish/bb1.jpg" },
];

const CATEGORY_PILLS = [
  { id: "soups", name: "Soups", image: "/dish/s1.jpg" },
  { id: "wraps", name: "Wraps", image: "/dish/w1.jpg" },
  { id: "omelettes", name: "Omelettes", image: "/dish/o4.jpg" },
  { id: "salads", name: "Salads", image: "/dish/sa1.jpg" },
  { id: "sandwiches", name: "Sandwiches", image: "/dish/sw5.jpg" },
  { id: "pasta", name: "Pasta", image: "/dish/p1.jpg" },
  { id: "burrito-bowls", name: "Bowls", image: "/dish/bb1.jpg" },
  { id: "healthy-meals", name: "Healthy", image: "/dish/hm3.jpg" },
  { id: "breakfast", name: "Breakfast", image: "/dish/b1.jpg" },
  { id: "meal-boxes", name: "Meals", image: "/dish/mb1.jpg" },
  { id: "drinks", name: "Drinks", image: "/dish/d1.jpg" },
  { id: "detox", name: "Detox", image: "/dish/de1.jpg" },
  { id: "smoothies", name: "Smoothies", image: "/dish/sm5.jpg" },
  { id: "desserts", name: "Desserts", image: "/dish/ds2.jpg" },
];

const FILTER_CHIPS = ["Filters", "Gourmet", "New to you", "Great offers", "Under 30 min", "Free delivery"];

export default function Home() {
  const { activeLocation, selectLocation } = useLocation();
  const [vegOnly, setVegOnly] = useState(false);
  const [activeChip, setActiveChip] = useState(0);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [dishes, setDishes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dishCount, setDishCount] = useState(83);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await API.items("all", undefined, 1, 12);
        const items = res.items || res.data || [];
        setDishes(items);
        setDishCount(res.total || items.length);
      } catch (e) {
        console.error("[Home] Failed to load dishes:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentBanner((b) => (b + 1) % PROMO_BANNERS.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const handleLocationSelect = async (loc: any) => {
    await selectLocation(loc);
  };

  const cardDishes = dishes.slice(0, 8).map((d: any) => ({
    id: String(d.id || d.sku),
    name: d.name || d.dishName,
    image: d.image || d.image_url || "/dish/hm3.jpg",
    price: d.price || d.mrp || 0,
    rating: d.rating || 4.0 + Math.random() * 0.8,
    time: d.prep_time ? `${d.prep_time} min` : "25-30 min",
    distance: "1.2 km",
    deliveryFee: "Free",
    offer: d.offer || (d.discount > 0 ? `&#8377;${Math.round(d.price * d.discount / 100)} OFF` : undefined),
    tags: d.tags || [d.category?.name || "Healthy"],
    veg: d.veg !== false,
    cuisine: d.cuisine || d.category?.name || "Indian",
    protein: d.protein || 0,
    rdVerified: d.rd_verified || d.rdVerified || false,
    discount: d.discount || 0,
  }));

  let filteredDishes = cardDishes;
  if (vegOnly) filteredDishes = filteredDishes.filter((d) => d.veg);
  if (activeChip === 1) {
    const gourmet = filteredDishes.filter((d) => d.rating != null && d.rating >= 4.5);
    filteredDishes = gourmet.length > 0 ? gourmet : filteredDishes;
  }
  if (activeChip === 2) {
    const newest = filteredDishes.filter((d) => d.tags?.some((t: string) => ["New", "Fresh", "Recently Added", "Seasonal"].includes(t)));
    filteredDishes = newest.length > 0 ? newest : filteredDishes;
  }
  if (activeChip === 3) {
    const offers = filteredDishes.filter((d) => (d.discount || 0) > 0 || d.offer);
    filteredDishes = offers.length > 0 ? offers : filteredDishes;
  }
  if (activeChip === 4) {
    const quick = filteredDishes.filter((d) => {
      const timeStr = String(d.time || "");
      const timeNum = parseInt(timeStr.replace(/\D/g, ""));
      return timeNum <= 30;
    });
    filteredDishes = quick.length > 0 ? quick : filteredDishes;
  }
  if (activeChip === 5) {
    const freeDel = filteredDishes.filter((d) => d.deliveryFee === "Free");
    filteredDishes = freeDel.length > 0 ? freeDel : filteredDishes;
  }

  return (
    <div className="fade-in pb-20">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-40 bg-[#121212] px-4 pt-3 pb-2 border-b border-white/5">
        <div className="flex items-center justify-between">
          <button onClick={() => setLocationOpen(true)} className="flex items-center gap-1.5 text-left min-w-0">
            <MapPin size={18} className="text-[#D4AF37] shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-0.5">
                <span className="text-sm font-bold text-white truncate max-w-[140px]">{activeLocation?.label || "Select Location"}</span>
                <ChevronDown size={14} className="text-[#D4AF37] shrink-0" />
              </div>
              <p className="text-[10px] text-white/40 truncate max-w-[160px]">{activeLocation?.address || "Tap to select delivery zone"}</p>
            </div>
          </button>
          <div className="flex items-center gap-2">
            <Link to="/refer" className="flex items-center gap-1 px-2.5 py-1 bg-[#D4AF37]/10 rounded-full border border-[#D4AF37]/20">
              <Wallet size={13} className="text-[#D4AF37]" />
              <span className="text-[10px] font-semibold text-[#D4AF37]">&#8377;0</span>
            </Link>
            <Link to="/profile" className="w-8 h-8 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center">
              <User size={15} className="text-[#D4AF37]" />
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <button onClick={() => setSearchOpen(true)} className="flex-1 flex items-center gap-2 bg-[#1a1c1c] border border-white/10 rounded-lg px-3 py-2.5 text-left">
            <Search size={16} className="text-white/30 shrink-0" />
            <span className="text-sm text-white/40">Search dishes, segments...</span>
            <span className="ml-auto text-white/20">|</span>
            <Mic size={16} className="text-[#D4AF37] shrink-0" />
          </button>
          <button onClick={() => setVegOnly(!vegOnly)} className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold border transition-colors ${vegOnly ? "bg-green-500/15 border-green-500/30 text-green-400" : "bg-[#1a1c1c] border-white/10 text-white/40"}`}>
            <Leaf size={14} /> VEG
          </button>
        </div>
      </div>

      {/* Promo Banner */}
      <div className="px-4 py-3">
        <Link to="/menu" className="block relative h-36 rounded-xl overflow-hidden">
          <img src={PROMO_BANNERS[currentBanner].image} alt="" className="absolute right-0 top-0 w-1/2 h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c0f0f] via-[#0c0f0f]/85 to-transparent" />
          <div className="relative z-10 p-4 h-full flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-[10px] uppercase tracking-wider text-[#D4AF37]">Limited time</p>
              <span className="text-[9px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-bold">Ends in 4h 32m</span>
            </div>
            <h3 className="text-lg font-bold text-white leading-tight">{PROMO_BANNERS[currentBanner].title}</h3>
            <p className="text-xs text-white/60 mt-1">{PROMO_BANNERS[currentBanner].subtitle}</p>
            <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1.5 rounded-full w-fit">
              {PROMO_BANNERS[currentBanner].cta} <span>&rsaquo;</span>
            </div>
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {PROMO_BANNERS.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all ${i === currentBanner ? "w-4 bg-[#D4AF37]" : "w-1.5 bg-white/30"}`} />
            ))}
          </div>
        </Link>
      </div>

      {/* Category Pills */}
      <div className="px-4 py-2">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {CATEGORY_PILLS.map((cat) => (
            <Link key={cat.id} to={`/menu?cat=${cat.id}`} className="flex flex-col items-center gap-1.5 shrink-0">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/5">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <span className="text-[10px] text-white/60 font-medium">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Filter Chips */}
      <div className="px-4 py-2">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {FILTER_CHIPS.map((chip, i) => (
            <button key={chip} onClick={() => { setActiveChip(i); if (i === 0) setFilterOpen(true); }}
              className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] border transition-colors ${activeChip === i ? "bg-[#D4AF37]/15 border-[#D4AF37]/40 text-[#D4AF37]" : "bg-[#1a1c1c] border-white/10 text-white/50"}`}>
              {i === 0 && <SlidersHorizontal size={10} className="inline mr-1" />}{chip}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Access Tiles */}
      <QuickAccessTiles />

      {/* Dish Count */}
      <div className="px-4 pt-4 pb-1">
        <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">{dishCount} DISHES DELIVERING TO YOU</p>
      </div>

      {/* Recommended For You */}
      <div className="px-4 py-3">
        <SectionHeader title="RECOMMENDED FOR YOU" seeAllTo="/menu" />
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[#1a1c1c] border border-white/5 rounded-xl overflow-hidden animate-pulse">
                <div className="h-32 bg-white/5" />
                <div className="p-2.5 space-y-2">
                  <div className="h-3 bg-white/5 rounded w-3/4" />
                  <div className="h-2.5 bg-white/5 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredDishes.map((dish) => <DishCard key={dish.id} dish={dish} />)}
          </div>
        )}
      </div>

      {/* Subscriptions */}
      <SubscriptionSection />

      {/* Combo Offers */}
      <ComboOffersSection />

      {/* Gold Upsell */}
      <GoldUpsellCard />

      {/* Newly Added */}
      <div className="px-4 py-3">
        <SectionHeader title="NEWLY ADDED" seeAllTo="/menu" subtext="Fresh from the Tanmatra kitchen" />
        <div className="grid grid-cols-2 gap-3">
          {filteredDishes.slice(0, 4).reverse().map((dish) => <DishCard key={`n-${dish.id}`} dish={{ ...dish, rdVerified: true }} />)}
        </div>
      </div>

      {/* Loyalty Card */}
      <div className="px-4 py-3">
        <div className="relative p-4 bg-gradient-to-r from-[#2a2520] to-[#1a1c1c] border border-[#D4AF37]/20 rounded-xl overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={14} className="text-[#D4AF37]" />
              <h3 className="text-sm font-bold text-[#D4AF37]">1 High-five</h3>
            </div>
            <p className="text-xs text-white/60">Get a FREE meal after 4 High-fives</p>
            <div className="flex items-center gap-2 mt-3">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 1 ? "bg-green-500/20 border-green-500 text-green-400" : "bg-white/5 border-white/10 text-white/30"}`}>
                  {step === 1 ? <span className="text-xs">&#10003;</span> : <span className="text-xs">{step}</span>}
                </div>
              ))}
              <Gift size={20} className="text-[#D4AF37] ml-1" />
            </div>
          </div>
          <Sparkles size={60} className="absolute -right-2 -top-2 text-[#D4AF37]/5" />
        </div>
      </div>

      <LoyaltyExplainer />

      {/* Trust Footer */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-3 p-3 bg-[#1a1c1c] border border-white/5 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
            <Shield size={18} />
          </div>
          <div>
            <p className="text-xs font-semibold text-white">RD-Verified Nutrition</p>
            <p className="text-[10px] text-white/40">Every dish reviewed by a Registered Dietitian</p>
          </div>
        </div>
      </div>

      <BottomNav />
      <FilterSheet isOpen={filterOpen} onClose={() => setFilterOpen(false)} onApply={(f) => console.log(f)} />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <LocationModal isOpen={locationOpen} onClose={() => setLocationOpen(false)} onSelect={handleLocationSelect} />
    </div>
  );
}
