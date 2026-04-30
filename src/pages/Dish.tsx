import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Minus, Star, Clock, Flame, Heart, Share2, Info, Check, Sparkles, Crown, Calendar, X, ShoppingCart, ChevronRight } from "lucide-react";
import { menuItems } from "@/data/menu";
import { cartStore } from "@/lib/store";
import { ROUTES } from "@/lib/routes";
import { p } from "@/lib/format";

export default function DishPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dish = menuItems.find((m) => m.id === id);
  const [inCart, setInCart] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showUpsell, setShowUpsell] = useState(false);
  const [upsellAdded, setUpsellAdded] = useState<string[]>([]);
  const [addedFlash, setAddedFlash] = useState(false);

  useEffect(() => {
    if (!dish) return;
    const cart = cartStore.get();
    const item = cart.items.find((i) => i.id === dish.id);
    setInCart(item?.qty || 0);
  }, [dish]);

  if (!dish) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-6 text-center">
        <p className="text-white/40 text-sm mb-1">Dish not found</p>
        <p className="text-white/20 text-xs mb-6">This dish may have been removed or the link is incorrect.</p>
        <div className="flex gap-3 w-full max-w-xs">
          <button onClick={() => navigate(ROUTES.menu)} className="flex-1 btn-gold text-sm py-3 rounded-xl">Browse Menu</button>
          <button onClick={() => navigate(ROUTES.home)} className="flex-1 btn-outline text-sm py-3 rounded-xl">Home</button>
        </div>
      </div>
    );
  }

  const sameCategory = menuItems.filter((m) => m.category_id === dish.category_id && m.id !== dish.id).slice(0, 3);
  const crossCategory = menuItems
    .filter((m) => m.id !== dish.id && !sameCategory.find((s) => s.id === m.id))
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  const recommended = [...sameCategory, ...crossCategory];

  const upsellItems = menuItems
    .filter((m) => ["drinks", "detox", "smoothies", "desserts"].includes(m.category_id))
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  const handleAdd = () => {
    cartStore.addItem({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      image: dish.image || `/dish/${dish.id}.jpg`,
      isVeg: !!dish.is_vegetarian,
    });
    setInCart((prev) => prev + 1);
    setAddedFlash(true);
    setTimeout(() => setAddedFlash(false), 1200);
    setShowUpsell(true);
  };

  const handleUpdate = (delta: number) => {
    const next = Math.max(0, inCart + delta);
    cartStore.updateQty(dish.id, next);
    setInCart(next);
  };

  const addUpsell = (item: typeof menuItems[0]) => {
    cartStore.addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image || `/dish/${item.id}.jpg`,
      isVeg: !!item.is_vegetarian,
    });
    setUpsellAdded((prev) => [...prev, item.id]);
  };

  const addCombo = () => {
    cartStore.addItem({ id: "d8", name: "Zero-Cal Mint Mojito", price: 80, image: "/dish/paneer_wrap.jpg", isVeg: true });
    cartStore.addItem({ id: "ds3", name: "Ragi Dates Jaggery Brownie", price: 149, image: "/dish/p1.jpg", isVeg: true });
    setUpsellAdded((prev) => [...prev, "combo"]);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      <div className="relative h-64">
        <img src={dish.image || `/dish/${dish.id}.jpg`} alt={dish.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 w-9 h-9 bg-black/50 backdrop-blur rounded-full flex items-center justify-center text-white"><ArrowLeft size={18} /></button>
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={() => setLiked(!liked)} className="w-9 h-9 bg-black/50 backdrop-blur rounded-full flex items-center justify-center"><Heart size={16} className={liked ? "fill-red-500 text-red-500" : "text-white"} /></button>
          <button
            onClick={() => {
              const text = `Check out ${dish.name} on Tanmatra — healthy meals delivered!`;
              if (navigator.share) { navigator.share({ title: dish.name, text, url: window.location.href }); }
              else { navigator.clipboard.writeText(text); alert("Dish link copied to clipboard!"); }
            }}
            className="w-9 h-9 bg-black/50 backdrop-blur rounded-full flex items-center justify-center text-white"
          >
            <Share2 size={16} />
          </button>
        </div>
        {dish.rd_verified && (
          <div className="absolute bottom-4 left-4 bg-[#D4AF37] text-[#0a0a0a] text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
            <Check size={10} strokeWidth={3} /> RD VERIFIED
          </div>
        )}
      </div>

      <div className="px-4 -mt-2 relative z-10">
        <div className="card-elevated p-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-lg font-bold">{dish.name}</h1>
              <p className="text-xs text-white/40 mt-0.5">{dish.description || "Fresh, healthy, RD-approved meal"}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-[#D4AF37]">{p(dish.price)}</p>
              <p className="text-[10px] text-white/30 line-through">{p(Math.round(dish.price * 1.15))}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-white/50">
            <span className="flex items-center gap-1"><Star size={12} className="text-green-400 fill-green-400" /> {(4 + Math.random() * 0.9).toFixed(1)}</span>
            <span className="flex items-center gap-1"><Clock size={12} /> {dish.prep_time || 20} min</span>
            <span className="flex items-center gap-1"><Flame size={12} /> {dish.calories || 350} kcal</span>
          </div>
          <div className="flex gap-2 mt-4">
            {[
              { label: "Protein", value: `${dish.protein || 18}g`, color: "text-blue-400 bg-blue-400/10" },
              { label: "Carbs", value: `${dish.carbs || 42}g`, color: "text-orange-400 bg-orange-400/10" },
              { label: "Fat", value: `${dish.fat || 12}g`, color: "text-yellow-400 bg-yellow-400/10" },
              { label: "Fiber", value: `${(dish as any).fiber || 8}g`, color: "text-green-400 bg-green-400/10" },
            ].map((m) => (
              <div key={m.label} className={`flex-1 text-center p-2 rounded-lg ${m.color}`}>
                <p className="text-xs font-bold">{m.value}</p>
                <p className="text-[8px] opacity-70">{m.label}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {(dish.tags || []).map((t: string) => (
              <span key={t} className="text-[10px] px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-white/50">{t}</span>
            ))}
            {dish.is_vegetarian && <span className="text-[10px] px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full text-green-400">Vegetarian</span>}
            {(dish.discount || 0) > 0 && <span className="text-[10px] px-2 py-0.5 bg-[#E23744]/10 border border-[#E23744]/20 rounded-full text-[#E23744]">{(dish as any).discount}% OFF</span>}
          </div>
        </div>

        <div className="card p-4 mt-3">
          <h3 className="text-sm font-semibold mb-2">Ingredients</h3>
          <p className="text-xs text-white/40 leading-relaxed">
            {(dish as any).ingredients || "Fresh vegetables, premium proteins, whole grains, and cold-pressed oils — sourced daily from certified vendors."}
          </p>
        </div>

        <div className="card p-4 mt-3 border-l-2 border-l-[#D4AF37]">
          <div className="flex items-start gap-2">
            <Info size={14} className="text-[#D4AF37] shrink-0 mt-0.5" />
            <p className="text-xs text-white/50">
              {(dish as any).rdNote || "This meal is balanced with optimal macronutrients for sustained energy. Approved by our registered dietitians for daily consumption."}
            </p>
          </div>
        </div>

        {recommended.length > 0 && (
          <div className="mt-5">
            <h3 className="text-sm font-semibold mb-3">Recommended for you</h3>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {recommended.map((r) => (
                <button key={r.id} onClick={() => navigate(ROUTES.dish(r.id))} className="shrink-0 w-28 text-left active:scale-[0.97] transition-transform">
                  <div className="w-28 h-20 rounded-xl overflow-hidden bg-[#141414]">
                    <img src={r.image || `/dish/${r.id}.jpg`} alt={r.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <p className="text-[11px] font-medium mt-1 truncate">{r.name}</p>
                  <p className="text-[10px] text-[#D4AF37]">{p(r.price)}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 p-3 card border border-green-500/20 flex items-center gap-3">
          <Calendar size={16} className="text-green-400 shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-bold text-green-400">Subscribe & save 30%</p>
            <p className="text-[10px] text-white/40">Get this meal daily from {p(Math.round(dish.price * 0.7))}/meal</p>
          </div>
          <button onClick={() => navigate(ROUTES.subscriptions)} className="text-[10px] font-bold text-green-400 border border-green-500/30 px-2.5 py-1 rounded-lg">View</button>
        </div>

        <div className="mt-3 p-3 bg-gradient-to-r from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/20 rounded-xl flex items-center gap-3">
          <Crown size={16} className="text-[#D4AF37] shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-bold text-[#D4AF37]">Get Gold & save 20%</p>
            <p className="text-[10px] text-white/40">This meal would be {p(Math.round(dish.price * 0.8))} with Gold</p>
          </div>
          <button onClick={() => navigate(ROUTES.gold)} className="text-[10px] font-bold text-[#0a0a0a] bg-[#D4AF37] px-2.5 py-1 rounded-lg">Join</button>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-[#0a0a0a] border-t border-white/5 p-4">
        {inCart > 0 ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#141414] border border-white/10 rounded-lg p-1">
              <button onClick={() => handleUpdate(-1)} className="p-2 text-[#D4AF37]"><Minus size={14} /></button>
              <span className="text-sm font-bold w-4 text-center">{inCart}</span>
              <button onClick={() => handleUpdate(1)} className="p-2 text-[#D4AF37]"><Plus size={14} /></button>
            </div>
            <button onClick={() => navigate(ROUTES.cart)} className="flex-1 btn-primary rounded-xl flex items-center justify-center gap-2">
              <ShoppingCart size={16} />
              Go to Cart · {p(dish.price * inCart)}
            </button>
          </div>
        ) : (
          <button onClick={handleAdd} className={`w-full btn-primary rounded-xl flex items-center justify-center gap-2 transition-all ${addedFlash ? "ring-2 ring-green-400/50" : ""}`}>
            <Plus size={18} />
            Add to Cart · {p(dish.price)}
          </button>
        )}
      </div>

      {showUpsell && (
        <div className="fixed inset-0 z-[10000] bg-black/80 flex items-end justify-center p-0" onClick={() => setShowUpsell(false)}>
          <div className="bg-[#141414] border border-white/10 rounded-t-2xl w-full max-w-md p-5 pb-8" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center"><Check size={20} className="text-green-400" /></div>
              <div>
                <p className="text-sm font-bold">Great choice!</p>
                <p className="text-xs text-white/40">{dish.name} added to your cart</p>
              </div>
            </div>
            <p className="text-xs text-white/50 mb-3">Would you like to add a drink or dessert to complete your meal?</p>
            <div className="space-y-2 mb-4">
              {upsellItems.map((item) => {
                const isAdded = upsellAdded.includes(item.id);
                return (
                  <div key={item.id} className="flex items-center gap-3 p-2.5 bg-[#0a0a0a] rounded-xl">
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0"><img src={item.image || `/dish/${item.id}.jpg`} alt={item.name} className="w-full h-full object-cover" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-[10px] text-white/40">{item.calories || 0} kcal</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-[#D4AF37]">{p(item.price)}</p>
                      {isAdded ? <span className="text-[10px] text-green-400">Added ✓</span> : <button onClick={() => addUpsell(item)} className="text-[10px] font-bold text-[#D4AF37] border border-[#D4AF37]/30 px-2 py-1 rounded-lg active:scale-95">+ Add</button>}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-3 bg-gradient-to-r from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/20 rounded-xl mb-4">
              <div className="flex items-center justify-between mb-1"><p className="text-xs font-bold text-[#D4AF37]">Combo Deal — Save 15%</p><Sparkles size={14} className="text-[#D4AF37]" /></div>
              <p className="text-[10px] text-white/40 mb-2">Drink + Dessert with your meal</p>
              {upsellAdded.includes("combo") ? <span className="text-xs text-green-400">Combo added ✓</span> : <button onClick={addCombo} className="w-full py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg text-xs font-bold text-[#D4AF37] active:scale-[0.98]">Add Combo & Save 15%</button>}
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowUpsell(false); navigate(ROUTES.cart); }} className="flex-1 btn-primary py-3 rounded-xl text-sm flex items-center justify-center gap-2"><ShoppingCart size={16} />Continue to Cart</button>
              <button onClick={() => setShowUpsell(false)} className="flex-1 py-3 bg-[#141414] border border-white/10 rounded-xl text-xs font-semibold text-white/50 active:scale-[0.98]">Continue Browsing</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
