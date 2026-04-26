import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { API } from "@/lib/api";
import { categories } from "@/data/menu";
import { Search, Plus, Minus, ShoppingCart, SlidersHorizontal, ChevronRight, Leaf, Flame } from "lucide-react";

const catColors: Record<string, string> = {
  soups: "from-amber-900/40 to-black/80",
  wraps: "from-orange-900/40 to-black/80",
  omelettes: "from-yellow-900/40 to-black/80",
  salads: "from-green-900/40 to-black/80",
  sandwiches: "from-rose-900/40 to-black/80",
  pasta: "from-red-900/40 to-black/80",
  "burrito-bowls": "from-amber-900/40 to-black/80",
  "healthy-meals": "from-teal-900/40 to-black/80",
  breakfast: "from-orange-900/40 to-black/80",
  "meal-boxes": "from-blue-900/40 to-black/80",
  drinks: "from-cyan-900/40 to-black/80",
  detox: "from-emerald-900/40 to-black/80",
  smoothies: "from-lime-900/40 to-black/80",
  desserts: "from-pink-900/40 to-black/80",
};

export default function MenuPage() {
  const [items, setItems] = useState<any[]>([]);
  const [activeCat, setActiveCat] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [vegOnly, setVegOnly] = useState(false);

  useEffect(() => {
    Promise.all([API.items(), API.categories()])
      .then(([it, _cats]) => {
        setItems(it.items || it || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    const saved = JSON.parse(localStorage.getItem("tanmatra_cart") || "[]");
    const map: Record<string, number> = {};
    saved.forEach((c: any) => { map[c.itemId || c.menu_item_id] = c.qty || c.quantity; });
    setCart(map);
  }, []);

  const filtered = useMemo(() => {
    let list = items;
    if (activeCat !== "all") list = list.filter((i) => i.category_id === activeCat || i.category?.id === activeCat);
    if (search.trim()) list = list.filter((i) => i.name?.toLowerCase().includes(search.toLowerCase()));
    if (vegOnly) list = list.filter((i) => i.is_vegetarian);
    return list;
  }, [items, activeCat, search, vegOnly]);

  const addToCart = (item: {id: string}, delta: number) => {
    const id: string = item.id;
    const current = cart[id] || 0;
    const next = Math.max(0, current + delta);
    const updated: Record<string, number> = { ...cart, [id]: next };
    if (next === 0) delete updated[id];
    setCart(updated);
    const saved = Object.entries(updated).map(([itemId, qty]) => {
      const it = items.find((x) => x.id === itemId);
      return { itemId, qty, name: it?.name, price: it?.price, veg: it?.is_vegetarian };
    });
    localStorage.setItem("tanmatra_cart", JSON.stringify(saved));
    window.dispatchEvent(new Event("storage"));
  };

  const getImage = (item: any) => {
    const cat = categories.find((c) => c.id === item.category_id);
    return item.image || cat?.image || `/dish/${item.id}.jpg`;
  };

  return (
    <div className="fade-in pb-24">
      <Header title="Menu" backTo="/" />

      {/* Search */}
      <div className="px-4 py-3 sticky top-12 z-20 bg-[#0c0f0f]">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search 83 RD-verified dishes..."
              className="w-full pl-9 pr-3 py-2.5 bg-[#1a1c1c] border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]/50"
            />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="p-2.5 bg-[#1a1c1c] border border-white/10 rounded-lg text-white/60">
            <SlidersHorizontal size={18} />
          </button>
        </div>
        {showFilters && (
          <div className="mt-2 p-3 bg-[#1a1c1c] border border-white/10 rounded-lg flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
              <input type="checkbox" checked={vegOnly} onChange={(e) => setVegOnly(e.target.checked)} className="accent-[#D4AF37]" />
              <Leaf size={14} className="text-green-400" /> Vegetarian Only
            </label>
            <button onClick={() => { setActiveCat("all"); setVegOnly(false); setSearch(""); }} className="text-xs text-[#D4AF37] ml-auto">Reset</button>
          </div>
        )}
      </div>

      {/* Category chips */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
        <button onClick={() => setActiveCat("all")} className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border ${activeCat === "all" ? "bg-[#D4AF37] text-[#0c0f0f] border-[#D4AF37]" : "bg-[#1a1c1c] text-white/60 border-white/10"}`}>All</button>
        {categories.map((c) => (
          <button key={c.id} onClick={() => setActiveCat(c.id)} className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border ${activeCat === c.id ? "bg-[#D4AF37] text-[#0c0f0f] border-[#D4AF37]" : "bg-[#1a1c1c] text-white/60 border-white/10"}`}>{c.name}</button>
        ))}
      </div>

      {/* Items */}
      {loading ? (
        <div className="px-4 py-10 text-center text-white/40 text-sm">Loading menu...</div>
      ) : filtered.length === 0 ? (
        <div className="px-4 py-10 text-center text-white/40 text-sm">No dishes found.</div>
      ) : (
        <div className="px-4 space-y-3 mt-2">
          {filtered.map((item) => (
            <div key={item.id} className="bg-[#1a1c1c] border border-white/5 rounded-xl overflow-hidden flex gap-3">
              <Link to={`/dish/${item.id}`} className="w-24 h-24 shrink-0 relative overflow-hidden rounded-l-xl">
                <img
                  src={getImage(item)}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${catColors[item.category_id] || "from-[#D4AF37]/20 to-[#0c0f0f]"} items-center justify-center text-2xl`}
                  style={{ display: 'none' }}
                >
                  {item.is_vegetarian ? "🥗" : "🍗"}
                </div>
              </Link>
              <div className="flex-1 min-w-0 py-2 pr-2">
                <Link to={`/dish/${item.id}`}>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-semibold text-white truncate">{item.name}</h3>
                    {item.is_vegetarian ? (
                      <Leaf size={10} className="text-green-400 shrink-0" />
                    ) : (
                      <Flame size={10} className="text-red-400 shrink-0" />
                    )}
                  </div>
                </Link>
                <p className="text-xs text-white/40 mt-0.5">{item.calories || 0} kcal · {item.protein || 0}g protein</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-bold text-[#D4AF37]">₹{item.price}</span>
                  {cart[item.id] ? (
                    <div className="flex items-center gap-2 bg-[#0c0f0f] border border-white/10 rounded-lg">
                      <button onClick={() => addToCart(item, -1)} className="p-1.5 text-[#D4AF37]"><Minus size={14} /></button>
                      <span className="text-xs font-semibold w-4 text-center text-white">{cart[item.id]}</span>
                      <button onClick={() => addToCart(item, 1)} className="p-1.5 text-[#D4AF37]"><Plus size={14} /></button>
                    </div>
                  ) : (
                    <button onClick={() => addToCart(item, 1)} className="px-3 py-1.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg text-xs font-semibold text-[#D4AF37] hover:bg-[#D4AF37]/20 active:scale-95 transition-transform">
                      Add
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating cart button */}
      {Object.keys(cart).length > 0 && (
        <Link to="/cart" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-32px)] max-w-[418px]">
          <div className="bg-[#D4AF37] text-[#0c0f0f] px-4 py-3.5 rounded-xl flex items-center justify-between shadow-lg active:scale-[0.98] transition-transform">
            <div className="flex items-center gap-2">
              <ShoppingCart size={18} />
              <span className="text-sm font-semibold">{Object.values(cart).reduce((a, b) => a + b, 0)} items</span>
            </div>
            <div className="flex items-center gap-1 text-sm font-bold">
              View Cart <ChevronRight size={16} />
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}
