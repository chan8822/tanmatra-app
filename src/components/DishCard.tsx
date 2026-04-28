import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Clock, Bike, Bookmark, Plus, Loader2 } from "lucide-react";
import { showToast } from "@/components/Toast";

interface DishCardProps {
  dish: {
    id: string; name: string; image: string; price: number; rating?: number;
    time?: string | number; distance?: string; deliveryFee?: string;
    offer?: string; tags?: string[]; veg?: boolean; cuisine?: string;
    protein?: number; rdVerified?: boolean; discount?: number;
  };
  compact?: boolean;
}

function getCart(): any {
  try { return JSON.parse(localStorage.getItem("tanmatra_cart") || "null") || { items: [] }; }
  catch { return { items: [] }; }
}
function saveCart(cart: any) {
  localStorage.setItem("tanmatra_cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
}

export function DishCard({ dish, compact }: DishCardProps) {
  const [liked, setLiked] = useState(false);
  const [adding, setAdding] = useState(false);

  const timeStr = typeof dish.time === "number" ? `${dish.time} min` : (dish.time || "30 min");

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    const cart = getCart();
    const existing = cart.items?.find((i: any) => i.dish_id === dish.id);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      cart.items = cart.items || [];
      cart.items.push({ id: Date.now(), dish_id: dish.id, dish_name: dish.name, price: dish.price, image: dish.image, quantity: 1 });
    }
    const subtotal = cart.items.reduce((s: number, i: any) => s + (i.price || 0) * (i.quantity || 1), 0);
    cart.subtotal = subtotal;
    cart.tax = Math.round(subtotal * 0.05);
    cart.delivery_fee = subtotal > 499 ? 0 : 49;
    cart.total = subtotal + cart.tax + cart.delivery_fee - (cart.discount || 0);
    saveCart(cart);
    setAdding(false);
    showToast("success", `${dish.name} added to cart`);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
  };

  const discountedPrice = dish.discount ? Math.round(dish.price * (1 - dish.discount / 100)) : dish.price;
  const savings = dish.price - discountedPrice;
  const topLeftBadge = dish.offer ? { text: dish.offer, cls: "bg-blue-600 text-white" } : dish.rdVerified ? { text: "RD VERIFIED", cls: "bg-[#D4AF37] text-[#0c0f0f]" } : null;

  return (
    <Link to={`/dish/${dish.id}`} className="block bg-[#1a1c1c] border border-white/5 rounded-xl overflow-hidden active:scale-[0.98] transition-transform">
      <div className={`relative ${compact ? "h-24" : "h-32"}`}>
        <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {topLeftBadge && <div className={`absolute top-2 left-0 ${topLeftBadge.cls} text-[9px] font-bold px-2 py-0.5 rounded-r`}>{topLeftBadge.text}</div>}
        {dish.discount != null && dish.discount > 0 && <div className="absolute top-2 right-8 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded">{dish.discount}% OFF</div>}
        <button onClick={handleBookmark} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 flex items-center justify-center z-10"><Bookmark size={12} className={liked ? "fill-[#D4AF37] text-[#D4AF37]" : "text-white/70"} /></button>
        <div className="absolute bottom-2 left-2 flex items-center gap-0.5 bg-green-600 px-1.5 py-0.5 rounded"><Star size={8} className="text-white fill-white" /><span className="text-[10px] font-bold text-white">{Number(dish.rating || 4.0).toFixed(1)}</span></div>
        <div className="absolute bottom-2 right-2 flex items-center gap-0.5 bg-black/50 px-1.5 py-0.5 rounded"><Clock size={8} className="text-white/70" /><span className="text-[9px] text-white/70">{timeStr}</span></div>
      </div>
      <div className="p-2.5">
        <p className="text-[9px] text-white/40 mb-0.5">{dish.cuisine || "Healthy"} &middot; &#8377;{dish.price} for one</p>
        <div className="flex items-center gap-1.5 text-[9px] text-white/40 mb-1">
          <span className="flex items-center gap-0.5"><Clock size={8} /> {timeStr}</span><span>|</span><span>{dish.distance || "1.2 km"}</span><span>|</span><span className="flex items-center gap-0.5"><Bike size={8} /> {dish.deliveryFee || "Free"}</span>
        </div>
        <div className="flex items-center gap-1 mb-1 flex-wrap">
          {dish.veg ? <span className="text-[8px] px-1 rounded border border-green-500 text-green-400">VEG</span> : <span className="text-[8px] px-1 rounded border border-red-500 text-red-400">NON</span>}
          {dish.protein != null && dish.protein > 0 && <span className="text-[8px] px-1.5 py-0.5 bg-[#D4AF37]/10 rounded text-[#D4AF37]">{dish.protein}g protein</span>}
          {dish.tags?.[0] && <span className="text-[8px] px-1.5 py-0.5 bg-white/5 rounded text-white/40">{dish.tags[0]}</span>}
          <span className="text-[8px] px-1.5 py-0.5 bg-green-500/10 rounded text-green-400 font-medium">Save &#8377;{Math.round(dish.price * 0.15)} vs Swiggy</span>
        </div>
        <h3 className="text-xs font-semibold truncate">{dish.name}</h3>
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#D4AF37]">&#8377;{discountedPrice}</span>
            {savings > 0 && <><span className="text-[9px] text-white/30 line-through">&#8377;{dish.price}</span><span className="text-[8px] text-green-400 font-medium">Save &#8377;{savings}</span></>}
          </div>
          <button onClick={handleAdd} disabled={adding} className="flex items-center gap-1 px-2.5 py-1 bg-[#D4AF37] rounded-full text-[#0c0f0f] text-[10px] font-bold active:scale-95 transition-transform disabled:opacity-50 z-10">
            {adding ? <Loader2 size={10} className="animate-spin" /> : <Plus size={10} />}ADD
          </button>
        </div>
      </div>
    </Link>
  );
}
