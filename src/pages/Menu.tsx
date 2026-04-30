import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { menuItems, categories } from "@/data/menu";
import { ROUTES } from "@/lib/routes";
import { TILE_FILTERS, TILE_META, normalizeItem, type MenuItem } from "@/lib/filters";
import { p } from "@/lib/format";
import { cartStore } from "@/lib/store";
import { Search, Plus, Minus, X, AlertCircle, Salad, ShoppingCart, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MenuPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [activeCat, setActiveCat] = useState(searchParams.get("cat") || "all");
  const [vegOnly, setVegOnly] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const urlFilter = searchParams.get("filter");

  useEffect(() => {
    const updateCart = () => {
      const c = cartStore.get();
      const map: Record<string, number> = {};
      let total = 0;
      let count = 0;
      c.items.forEach((i) => { map[i.id] = i.qty; total += i.price * i.qty; count += i.qty; });
      setCart(map);
      setCartTotal(total);
      setCartCount(count);
    };
    updateCart();
    return cartStore.subscribe(updateCart);
  }, []);

  const bannerMeta = urlFilter && TILE_META[urlFilter] ? TILE_META[urlFilter] : { text: "text-white", border: "border-white/10" };
  const showBanner = !!urlFilter;

  const filtered = useMemo(() => {
    let list = menuItems;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((i) => i.name.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q) || (i.tags || []).some((t) => t.toLowerCase().includes(q)));
    }
    if (activeCat !== "all") list = list.filter((i) => i.category_id === activeCat);
    if (vegOnly) list = list.filter((i) => i.is_vegetarian);
    if (urlFilter && TILE_FILTERS[urlFilter]) list = list.filter(TILE_FILTERS[urlFilter]);
    return list.map(normalizeItem);
  }, [search, activeCat, vegOnly, urlFilter]);

  const nonVegCount = useMemo(() => filtered.filter((i) => !i.is_vegetarian).length, [filtered]);

  const addToCart = (item: MenuItem) => {
    cartStore.addItem({ id: item.id, name: item.name, price: item.price, image: item.image || `/dish/${item.id}.jpg`, isVeg: !!item.is_vegetarian });
  };

  const updateQty = (id: string, delta: number) => {
    const current = cart[id] || 0;
    const next = Math.max(0, current + delta);
    cartStore.updateQty(id, next);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      <Header title="Menu" back={ROUTES.home} />

      {/* Search */}
      <div className="px-4 py-2">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search dishes, ingredients..." className="w-full pl-9 pr-3 py-2.5 bg-[#141414] border border-white/5 rounded-xl text-sm placeholder:text-white/30 outline-none focus:border-[#D4AF37]/30" />
          {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30"><X size={14} /></button>}
        </div>
      </div>

      {/* Scrollable Categories with fade affordance */}
      <div className="relative px-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-2" id="cat-scroll">
          <button onClick={() => setActiveCat("all")} className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${activeCat === "all" ? "bg-[#D4AF37] text-[#0a0a0a] border-[#D4AF37]" : "bg-[#141414] text-white/60 border-white/5"}`}>All</button>
          {categories.map((c) => (
            <button key={c.id} onClick={() => setActiveCat(c.id)} className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${activeCat === c.id ? "bg-[#D4AF37] text-[#0a0a0a] border-[#D4AF37]" : "bg-[#141414] text-white/60 border-white/5"}`}>
              {c.name}
            </button>
          ))}
        </div>
        <div className="absolute right-4 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0a0a0a] to-transparent pointer-events-none" />
      </div>

      {/* Veg toggle */}
      <div className="px-4 py-2 flex items-center gap-2">
        <button onClick={() => setVegOnly(!vegOnly)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${vegOnly ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-[#141414] text-white/40 border-white/5"}`}>
          <div className="w-3 h-3 border border-green-500 rounded-sm flex items-center justify-center"><div className="w-1.5 h-1.5 bg-green-500 rounded-full" /></div> Veg Only
        </button>
        {showBanner && (
          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${bannerMeta.border} ${bannerMeta.text}`}>{filtered.length} items</span>
        )}
      </div>

      {vegOnly && filtered.length < 3 && nonVegCount > 0 && (
        <div className="px-4 py-2">
          <div className="flex items-center gap-2 p-2.5 bg-white/5 border border-white/10 rounded-xl">
            <AlertCircle size={14} className="text-yellow-400 shrink-0" />
            <p className="text-xs text-white/50">Only {filtered.length} veg items here. <button onClick={() => setVegOnly(false)} className="text-[#D4AF37] underline">Show all {filtered.length + nonVegCount}</button></p>
          </div>
        </div>
      )}

      {/* Items */}
      <div className="px-4 space-y-3 mt-2">
        {filtered.map((item) => (
          <div key={item.id} className="bg-[#141414] border border-white/5 rounded-xl overflow-hidden flex gap-3">
            <Link to={ROUTES.dish(item.id)} className="w-24 h-24 shrink-0 relative overflow-hidden rounded-l-xl">
              <img src={item.image || `/dish/${item.id}.jpg`} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
              {(item.discount || 0) > 0 && <div className="absolute top-1 left-1 bg-[#E23744] text-white text-[8px] font-bold px-1.5 py-0.5 rounded">{item.discount}% OFF</div>}
            </Link>
            <div className="flex-1 min-w-0 py-2 pr-2">
              <Link to={ROUTES.dish(item.id)}>
                <h3 className="text-sm font-semibold truncate">{item.name}</h3>
              </Link>
              <p className="text-[10px] text-white/40 mt-0.5">{item.calories || 0} kcal &middot; {item.protein || 0}g protein</p>
              <div className="flex items-center justify-between mt-2">
                <div>
                  <span className="text-sm font-bold text-[#D4AF37]">{p(item.price)}</span>
                  <span className="text-[9px] text-white/30 line-through ml-1">{p(Math.round(item.price * 1.53))}</span>
                  <span className="text-[8px] px-1 bg-green-500/10 text-green-400 rounded ml-1">Save {p(Math.round(item.price * 0.53))}</span>
                </div>
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
          <div className="py-12 text-center">
            <Salad size={40} className="text-white/10 mx-auto mb-3" />
            <p className="text-white/40 text-sm mb-1">No dishes found</p>
            <p className="text-white/20 text-xs mb-4">Try a different filter or search term</p>
            {search && (
              <button onClick={() => { setSearch(""); setSearchParams({}); }} className="px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold rounded-lg">
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Sticky Cart Bar */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#141414] border-t border-white/10 p-3">
          <button onClick={() => navigate(ROUTES.cart)} className="w-full flex items-center gap-3 bg-[#D4AF37] text-[#0a0a0a] rounded-xl px-4 py-3 active:scale-[0.98] transition-transform">
            <div className="w-8 h-8 bg-[#0a0a0a]/10 rounded-lg flex items-center justify-center">
              <ShoppingCart size={16} />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-bold">{cartCount} {cartCount === 1 ? "item" : "items"}</p>
              <p className="text-[10px] opacity-70">Tap to review and checkout</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold">{p(cartTotal)}</p>
              <p className="text-[9px] opacity-70">Plus taxes</p>
            </div>
            <ChevronRight size={18} className="opacity-50" />
          </button>
        </div>
      )}
    </div>
  );
}
