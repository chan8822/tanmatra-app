import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { API } from "@/lib/api";
import { Plus, Minus, ShoppingCart, Heart, ChevronRight, Flame, Wheat, Droplets, Shield, CheckCircle } from "lucide-react";

export default function DishPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [inCart, setInCart] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!id) return;
    API.items()
      .then((data: any) => {
        const items = data.items || data || [];
        const found = items.find((i: any) => i.id === id);
        setItem(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    const saved = JSON.parse(localStorage.getItem("tanmatra_cart") || "[]");
    const existing = saved.find((c: any) => (c.itemId || c.menu_item_id) === id);
    if (existing) {
      setInCart(true);
      setQty(existing.qty || existing.quantity || 1);
    }
  }, [id]);

  const addToCart = () => {
    const saved = JSON.parse(localStorage.getItem("tanmatra_cart") || "[]");
    const idx = saved.findIndex((c: any) => (c.itemId || c.menu_item_id) === id);
    const entry = { itemId: id, qty, name: item?.name, price: item?.price, veg: item?.is_vegetarian };
    if (idx >= 0) saved[idx] = entry;
    else saved.push(entry);
    localStorage.setItem("tanmatra_cart", JSON.stringify(saved));
    window.dispatchEvent(new Event("storage"));
    setInCart(true);
  };

  if (loading) return <div className="text-center py-20 text-white/40 text-sm">Loading...</div>;
  if (!item) return (
    <div className="text-center py-20">
      <p className="text-white/40 text-sm mb-4">Dish not found</p>
      <Link to="/menu" className="text-[#D4AF37] text-sm">Back to Menu</Link>
    </div>
  );

  const macros = [
    { label: "Calories", value: item.calories || 0, unit: "kcal", icon: <Flame size={14} /> },
    { label: "Protein", value: item.protein || 0, unit: "g", icon: <Shield size={14} /> },
    { label: "Carbs", value: item.carbs || 0, unit: "g", icon: <Wheat size={14} /> },
    { label: "Fat", value: item.fat || 0, unit: "g", icon: <Droplets size={14} /> },
  ];

  return (
    <div className="fade-in pb-24">
      <Header title="Dish Details" backTo="/menu" />

      {/* Hero image area */}
      <div className="h-56 bg-gradient-to-br from-[rgba(212,175,55,0.2)] to-[#0c0f0f] flex items-center justify-center text-6xl relative">
        {item.is_vegetarian ? "🥗" : "🍗"}
        <button onClick={() => setLiked(!liked)} className="absolute top-3 right-3 p-2 rounded-full bg-[#0c0f0f]/60 backdrop-blur">
          <Heart size={18} className={liked ? "fill-red-500 text-red-500" : "text-white/60"} />
        </button>
      </div>

      <div className="px-4 py-4 space-y-5">
        {/* Title */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${item.is_vegetarian ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"}`}>
              {item.is_vegetarian ? "VEG" : "NON-VEG"}
            </span>
            {item.rd_verified && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#D4AF37]/10 text-[#D4AF37] flex items-center gap-1">
                <CheckCircle size={10} /> RD Verified
              </span>
            )}
          </div>
          <h1 className="font-serif text-2xl text-white">{item.name}</h1>
          <p className="text-xs text-white/40 mt-1">{item.category?.name || "Premium Selection"}</p>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-[#D4AF37]">₹{item.price}</span>
          {item.non_veg_price && item.non_veg_price !== item.price && (
            <span className="text-sm text-white/40">Non-veg: ₹{item.non_veg_price}</span>
          )}
        </div>

        {/* Macros */}
        <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4">
          <h3 className="text-xs uppercase tracking-wider text-white/40 mb-3">Nutrition per serving</h3>
          <div className="grid grid-cols-4 gap-3">
            {macros.map((m) => (
              <div key={m.label} className="text-center">
                <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-1 text-[#D4AF37]">{m.icon}</div>
                <div className="text-sm font-bold text-white">{m.value}{m.unit}</div>
                <div className="text-[10px] text-white/40">{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.tags.map((t: string) => (
              <span key={t} className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-white/50 border border-white/5">{t}</span>
            ))}
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-white/60 leading-relaxed">{item.description || "A carefully crafted dish, prepared with premium ingredients and RD-verified nutrition macros."}</p>

        {/* Quantity + Add */}
        <div className="flex items-center gap-4 pt-2">
          <div className="flex items-center gap-3 bg-[#1a1c1c] border border-white/10 rounded-lg px-2 py-1.5">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-1 text-[#D4AF37]"><Minus size={16} /></button>
            <span className="text-sm font-semibold text-white w-6 text-center">{qty}</span>
            <button onClick={() => setQty(qty + 1)} className="p-1 text-[#D4AF37]"><Plus size={16} /></button>
          </div>
          <button onClick={addToCart} className="flex-1 py-3 bg-[#D4AF37] text-[#0c0f0f] rounded-xl font-semibold text-sm active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
            <ShoppingCart size={16} /> {inCart ? "Update Cart" : "Add to Cart"} · ₹{item.price * qty}
          </button>
        </div>

        {/* AI Recommendation teaser */}
        <Link to="/wellness" className="block bg-gradient-to-r from-[#D4AF37]/10 to-[#1a1c1c] border border-[#D4AF37]/20 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-[#D4AF37] mb-0.5">AI Wellness Match</p>
            <p className="text-sm text-white/70">See which family track this fits best</p>
          </div>
          <ChevronRight size={18} className="text-[#D4AF37]" />
        </Link>
      </div>
    </div>
  );
}
