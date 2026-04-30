import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { menuItems, categories } from "@/data/menu";
import { ROUTES } from "@/lib/routes";
import { TILE_FILTERS, TILE_META, normalizeItem } from "@/lib/filters";
import { p } from "@/lib/format";
import { cartStore } from "@/lib/store";
import { Search, Plus, Minus, X, AlertCircle, Gift, Zap, Salad, Shield, Users, Target } from "lucide-react";

const iconMap: Record<string, React.ElementType> = { gift: Gift, zap: Zap, salad: Salad, shield: Shield, users: Users, target: Target };

export default function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [activeCat, setActiveCat] = useState(searchParams.get("cat") || "all");
  const [vegOnly, setVegOnly] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({});
  const urlFilter = searchParams.get("filter");

  useEffect(() => {
    syncCart();
    return cartStore.subscribe(syncCart);
  }, []);

  function syncCart() {
    const c = cartStore.get();
    const map: Record<string, number> = {};
    c.items.forEach((i) => { map[i.id] = i.qty; });
    setCart(map);
  }

  const normalized = useMemo(() => menuItems.map(normalizeItem), []);

  const baseFiltered = useMemo(() => {
    let list = [...normalized];
    if (urlFilter && TILE_FILTERS[urlFilter]) list = list.filter(TILE_FILTERS[urlFilter]);
    if (activeCat !== "all") list = list.filter((i) => i.category_id === activeCat);
    if (search.trim()) list = list.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [normalized, activeCat, search, urlFilter]);

  const filtered = useMemo(() => {
    if (vegOnly) return baseFiltered.filter((i) => i.is_vegetarian);
    return baseFiltered;
  }, [baseFiltered, vegOnly]);

  const nonVegCount = baseFiltered.filter((i) => !i.is_vegetarian).length;
  const bannerMeta = urlFilter ? TILE_META[urlFilter] : null;
  const BannerIcon = bannerMeta ? (iconMap[bannerMeta.iconName] || Gift) : null;

  const clearFilter = () => {
    const sp = new URLSearchParams(searchParams);
    sp.delete("filter");
    setSearchParams(sp);
    setActiveCat("all");
  };

  const addToCart = (item: any) => {
    cartStore.addItem({ id: item.id, name: item.name, price: item.price, image: item.image, isVeg: item.is_vegetarian });
    syncCart();
  };

  const updateQty = (id: string, delta: number) => {
    cartStore.updateQty(id, (cart[id] || 0) + delta);
    syncCart();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      <Header title={bannerMeta ? bannerMeta.title : "Menu"} back={ROUTES.home} />

      {/* Filter Banner */}
      {bannerMeta && BannerIcon && (
        <div className={`mx-4 mt-3 p-4 bg-gradient-to-r ${bannerMeta.gradient} border ${bannerMeta.border} rounded-2xl flex items-start gap-3`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white/5`}>
            <BannerIcon size={20} className={bannerMeta.text} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className={`text-sm font-bold ${bannerMeta.text}`}>{bannerMeta.title}</h2>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${bannerMeta.border} ${bannerMeta.text}`}>{filtered.length} items</span>
            </div>
            <p className="text-[11px] text-white/50 mt-0.5">{bannerMeta.subtitle}</p>
          </div>
          <button onClick={clearFilter} className="shrink-0 p-1.5 rounded-lg bg-white/5 hover:bg-white/10"><X size={14} className="text-white/40" /></button>
        </div>
      )}

      {/* Veg conflict chip */}
      {vegOnly && filtered.length < 3 && nonVegCount > 0 && (
        <div className="mx-4 mt-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-center gap-3">
          <AlertCircle size={16} className="text-yellow-400 shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-yellow-400 font-medium">{nonVegCount} non-veg items hidden</p>
            <p className="text-[10px] text-white/40">Toggle Veg off to see more results</p>
          </div>
          <button onClick={() => setVegOnly(false)} className="shrink-0 px-3 py-1.5 bg-yellow-500/15 border border-yellow-500/30 rounded-lg text-[10px] font-semibold text-yellow-400">Show All</button>
        </div>
      )}

      {/* Search */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search dishes..." className="w-full pl-9 pr-3 py-2.5 bg-[#141414] border border-white/10 rounded-xl text-sm placeholder:text-white/30 outline-none focus:border-[#D4AF37]/50" />
        </div>
      </div>

      {/* Veg toggle */}
      <div className="px-4 pb-2 flex items-center gap-2">
        <button onClick={() => setVegOnly(!vegOnly)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${vegOnly ? "bg-green-500/15 border-green-500/30 text-green-400" : "bg-[#141414] border-white/10 text-white/50"}`}>
          <div className={`w-3 h-3 border rounded-sm flex items-center justify-center ${vegOnly ? "border-green-500" : "border-white/30"}`}>{vegOnly && <div className="w-1.5 h-1.5 bg-green-500 rounded-sm" />}</div>
          Veg Only
        </button>
      </div>

      {/* Category chips */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
        <button onClick={() => setActiveCat("all")} className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${activeCat === "all" ? "bg-[#D4AF37] text-[#0a0a0a] border-[#D4AF37]" : "bg-[#141414] text-white/50 border-white/10"}`}>All</button>
        {categories.map((c) => (
          <button key={c.id} onClick={() => setActiveCat(c.id)} className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${activeCat === c.id ? "bg-[#D4AF37] text-[#0a0a0a] border-[#D4AF37]" : "bg-[#141414] text-white/50 border-white/10"}`}>{c.name}</button>
        ))}
      </div>

      {/* Items */}
      <div className="px-4 space-y-3 mt-2">
        {filtered.map((item) => (
          <div key={item.id} className="bg-[#141414] border border-white/5 rounded-xl overflow-hidden flex gap-3">
            <Link to={ROUTES.dish(item.id)} className="w-24 h-24 shrink-0 relative overflow-hidden rounded-l-xl">
              <img src={item.image || `/dish/${item.id}.jpg`} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
              {item.discount > 0 && <div className="absolute top-1 left-1 bg-[#E23744] text-white text-[8px] font-bold px-1.5 py-0.5 rounded">{item.discount}% OFF</div>}
            </Link>
            <div className="flex-1 min-w-0 py-2 pr-2">
              <Link to={ROUTES.dish(item.id)}>
                <h3 className="text-sm font-semibold truncate">{item.name}</h3>
              </Link>
              <p className="text-[10px] text-white/40 mt-0.5">{item.calories || 0} kcal &middot; {item.protein || 0}g protein</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-bold text-[#D4AF37]">{p(item.price)}</span>
                {cart[item.id] ? (
                  <div className="flex items-center gap-2 bg-[#0a0a0a] border border-white/10 rounded-lg">
                    <button onClick={() => updateQty(item.id, -1)} className="p-1.5 text-[#D4AF37]"><Minus size={14} /></button>
                    <span className="text-xs font-semibold w-4 text-center">{cart[item.id]}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="p-1.5 text-[#D4AF37]"><Plus size={14} /></button>
                  </div>
                ) : (
                  <button onClick={() => addToCart(item)} className="px-3 py-1.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg text-xs font-semibold text-[#D4AF37] hover:bg-[#D4AF37]/20 active:scale-95 transition-transform">Add</button>
                )}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-10 text-center text-white/40 text-sm">No dishes found.</div>
        )}
      </div>
    </div>
  );
}
