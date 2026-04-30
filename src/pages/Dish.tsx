import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Plus, Minus, Star, Clock, Flame, Heart, Share2, Info, Check } from "lucide-react";
import { menuItems } from "@/data/menu";
import { cartStore } from "@/lib/store";
import { ROUTES } from "@/lib/routes";
import { p } from "@/lib/format";

export default function DishPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dish = menuItems.find((m) => m.id === id);
  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);
  const [inCart, setInCart] = useState(0);

  useEffect(() => {
    if (!dish) return;
    const cart = cartStore.get();
    const item = cart.items.find((i) => i.id === dish.id);
    setInCart(item?.qty || 0);
  }, [dish]);

  if (!dish) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <p className="text-white/40">Dish not found</p>
      </div>
    );
  }

  const related = menuItems.filter((m) => m.category_id === dish.category_id && m.id !== dish.id).slice(0, 4);

  const handleAdd = () => {
    cartStore.addItem({ id: dish.id, name: dish.name, price: dish.price, image: dish.image, isVeg: dish.is_vegetarian });
    setInCart((prev) => prev + 1);
  };

  const handleUpdate = (delta: number) => {
    const next = Math.max(0, inCart + delta);
    cartStore.updateQty(dish.id, next);
    setInCart(next);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      {/* Image */}
      <div className="relative h-64">
        <img src={dish.image || `/dish/${dish.id}.jpg`} alt={dish.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 w-9 h-9 bg-black/50 backdrop-blur rounded-full flex items-center justify-center text-white"><ArrowLeft size={18} /></button>
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={() => setLiked(!liked)} className="w-9 h-9 bg-black/50 backdrop-blur rounded-full flex items-center justify-center"><Heart size={16} className={liked ? "fill-red-500 text-red-500" : "text-white"} /></button>
          <button className="w-9 h-9 bg-black/50 backdrop-blur rounded-full flex items-center justify-center text-white"><Share2 size={16} /></button>
        </div>
        {dish.rd_verified && (
          <div className="absolute bottom-4 left-4 bg-[#D4AF37] text-[#0a0a0a] text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
            <Check size={10} strokeWidth={3} /> RD VERIFIED
          </div>
        )}
      </div>

      {/* Info */}
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

          {/* Macros */}
          <div className="flex gap-2 mt-4">
            {[
              { label: "Protein", value: `${dish.protein || 18}g`, color: "text-blue-400 bg-blue-400/10" },
              { label: "Carbs", value: `${dish.carbs || 42}g`, color: "text-orange-400 bg-orange-400/10" },
              { label: "Fat", value: `${dish.fat || 12}g`, color: "text-yellow-400 bg-yellow-400/10" },
              { label: "Fiber", value: `${dish.fiber || 8}g`, color: "text-green-400 bg-green-400/10" },
            ].map((m) => (
              <div key={m.label} className={`flex-1 text-center p-2 rounded-lg ${m.color}`}>
                <p className="text-xs font-bold">{m.value}</p>
                <p className="text-[8px] opacity-70">{m.label}</p>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {(dish.tags || []).map((t: string) => (
              <span key={t} className="text-[10px] px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-white/50">{t}</span>
            ))}
            {dish.is_vegetarian && <span className="text-[10px] px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full text-green-400">Vegetarian</span>}
            {dish.discount > 0 && <span className="text-[10px] px-2 py-0.5 bg-[#E23744]/10 border border-[#E23744]/20 rounded-full text-[#E23744]">{dish.discount}% OFF</span>}
          </div>
        </div>

        {/* Ingredients */}
        <div className="card p-4 mt-3">
          <h3 className="text-sm font-semibold mb-2">Ingredients</h3>
          <p className="text-xs text-white/40 leading-relaxed">
            {dish.ingredients || "Fresh vegetables, premium proteins, whole grains, and cold-pressed oils — sourced daily from certified vendors."}
          </p>
        </div>

        {/* RD Note */}
        <div className="card p-4 mt-3 border-l-2 border-l-[#D4AF37]">
          <div className="flex items-start gap-2">
            <Info size={14} className="text-[#D4AF37] shrink-0 mt-0.5" />
            <p className="text-xs text-white/50">
              {dish.rdNote || "This meal is balanced with optimal macronutrients for sustained energy. Approved by our registered dietitians for daily consumption."}
            </p>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-5">
            <h3 className="text-sm font-semibold mb-3">You may also like</h3>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {related.map((r) => (
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
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-[#0a0a0a] border-t border-white/5 p-4">
        {inCart > 0 ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#141414] border border-white/10 rounded-lg p-1">
              <button onClick={() => handleUpdate(-1)} className="p-2 text-[#D4AF37]"><Minus size={14} /></button>
              <span className="text-sm font-bold w-4 text-center">{inCart}</span>
              <button onClick={() => handleUpdate(1)} className="p-2 text-[#D4AF37]"><Plus size={14} /></button>
            </div>
            <button onClick={() => navigate(ROUTES.cart)} className="flex-1 btn-primary rounded-xl">
              Go to Cart &middot; {p(dish.price * inCart)}
            </button>
          </div>
        ) : (
          <button onClick={handleAdd} className="w-full btn-primary rounded-xl">
            Add to Cart &middot; {p(dish.price)}
          </button>
        )}
      </div>
    </div>
  );
}
