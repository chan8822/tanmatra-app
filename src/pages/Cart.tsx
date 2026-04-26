import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { API } from "@/lib/api";
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.items()
      .then((data: any) => {
        setItems(data.items || data || []);
        loadCart();
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const loadCart = () => {
    const saved = JSON.parse(localStorage.getItem("tanmatra_cart") || "[]");
    setCart(saved);
  };

  const updateQty = (itemId: string, delta: number) => {
    const saved = JSON.parse(localStorage.getItem("tanmatra_cart") || "[]");
    const idx = saved.findIndex((c: any) => (c.itemId || c.menu_item_id) === itemId);
    if (idx >= 0) {
      saved[idx].qty = Math.max(0, (saved[idx].qty || saved[idx].quantity || 1) + delta);
      if (saved[idx].qty === 0) saved.splice(idx, 1);
    }
    localStorage.setItem("tanmatra_cart", JSON.stringify(saved));
    window.dispatchEvent(new Event("storage"));
    loadCart();
  };

  const removeItem = (itemId: string) => {
    const saved = JSON.parse(localStorage.getItem("tanmatra_cart") || "[]");
    const filtered = saved.filter((c: any) => (c.itemId || c.menu_item_id) !== itemId);
    localStorage.setItem("tanmatra_cart", JSON.stringify(filtered));
    window.dispatchEvent(new Event("storage"));
    loadCart();
  };

  const enriched = useMemo(() => {
    return cart.map((c: any) => {
      const it = items.find((i) => i.id === (c.itemId || c.menu_item_id));
      return { ...c, item: it || {} };
    }).filter((c) => c.item && c.item.id);
  }, [cart, items]);

  const subtotal = enriched.reduce((s, c) => s + (c.item.price || 0) * (c.qty || 1), 0);
  const delivery = subtotal > 500 ? 0 : 49;
  const total = subtotal + delivery;

  if (loading) return <div className="text-center py-20 text-white/40 text-sm">Loading...</div>;

  if (enriched.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header title="Your Cart" backTo="/menu" />
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <ShoppingBag size={48} className="text-white/10 mb-4" />
          <p className="text-white/40 text-sm mb-2">Your cart is empty</p>
          <p className="text-white/30 text-xs mb-6">Add some RD-verified meals to get started.</p>
          <Link to="/menu" className="px-6 py-3 bg-[#D4AF37] text-[#0c0f0f] rounded-xl text-sm font-semibold active:scale-95 transition-transform">
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in pb-32">
      <Header title="Your Cart" backTo="/menu" />

      <div className="px-4 py-4 space-y-3">
        {enriched.map((c) => (
          <div key={c.itemId || c.menu_item_id} className="bg-[#1a1c1c] border border-white/5 rounded-xl p-3 flex gap-3">
            <Link to={`/dish/${c.item.id}`} className="w-16 h-16 shrink-0 rounded-lg bg-gradient-to-br from-[rgba(212,175,55,0.15)] to-[#0c0f0f] flex items-center justify-center text-xl">
              {c.item.is_vegetarian ? "🥗" : "🍗"}
            </Link>
            <div className="flex-1 min-w-0">
              <Link to={`/dish/${c.item.id}`}>
                <h3 className="text-sm font-semibold text-white truncate">{c.item.name}</h3>
              </Link>
              <p className="text-xs text-white/40">{c.item.calories || 0} kcal</p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2 bg-[#0c0f0f] border border-white/10 rounded-lg">
                  <button onClick={() => updateQty(c.itemId || c.menu_item_id, -1)} className="p-1.5 text-[#D4AF37]"><Minus size={14} /></button>
                  <span className="text-xs font-semibold w-4 text-center text-white">{c.qty || 1}</span>
                  <button onClick={() => updateQty(c.itemId || c.menu_item_id, 1)} className="p-1.5 text-[#D4AF37]"><Plus size={14} /></button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#D4AF37]">₹{(c.item.price || 0) * (c.qty || 1)}</span>
                  <button onClick={() => removeItem(c.itemId || c.menu_item_id)} className="p-1.5 text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bill summary */}
      <div className="px-4 py-4">
        <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm text-white/60"><span>Subtotal</span><span>₹{subtotal}</span></div>
          <div className="flex justify-between text-sm text-white/60"><span>Delivery</span><span>{delivery === 0 ? "FREE" : `₹${delivery}`}</span></div>
          <div className="border-t border-white/5 pt-2 flex justify-between text-base font-bold text-white">
            <span>Total</span><span className="text-[#D4AF37]">₹{total}</span>
          </div>
          {delivery > 0 && <p className="text-[10px] text-white/30">Add ₹{500 - subtotal} more for free delivery</p>}
        </div>
      </div>

      {/* Checkout CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0c0f0f] border-t border-white/5 z-40">
        <button onClick={() => navigate("/checkout")} className="w-full py-3.5 bg-[#D4AF37] text-[#0c0f0f] rounded-xl font-semibold text-sm active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
          Proceed to Checkout <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
