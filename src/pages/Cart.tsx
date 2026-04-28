import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { useState, useEffect } from "react";

function getCart(): any {
  try { return JSON.parse(localStorage.getItem("tanmatra_cart") || "null") || { items: [] }; }
  catch { return { items: [] }; }
}

function saveCart(cart: any) {
  localStorage.setItem("tanmatra_cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
}

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<any>({ items: [] });
  const [mounted, setMounted] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  useEffect(() => {
    setCart(getCart());
    setMounted(true);
    const handler = () => setCart(getCart());
    window.addEventListener("cartUpdated", handler);
    return () => window.removeEventListener("cartUpdated", handler);
  }, []);

  const items = cart?.items || [];
  const count = items.reduce((s: number, i: any) => s + (i.quantity || 1), 0);
  const subtotal = items.reduce((s: number, i: any) => s + (i.price || 0) * (i.quantity || 1), 0);
  const tax = Math.round(subtotal * 0.05);
  const deliveryFee = subtotal > 499 ? 0 : 49;
  const discount = cart?.discount || 0;
  const total = subtotal + tax + deliveryFee - discount;

  const updateQty = (id: number, delta: number) => {
    const c = getCart();
    const item = c.items?.find((i: any) => i.id === id);
    if (!item) return;
    item.quantity = Math.max(0, (item.quantity || 1) + delta);
    if (item.quantity <= 0) c.items = c.items.filter((i: any) => i.id !== id);
    saveCart(c);
    setCart(c);
  };

  const applyCoup = () => {
    const c = getCart();
    if (couponCode.trim() === "FIRST20" && subtotal > 0) {
      c.discount = Math.min(Math.round(subtotal * 0.2), 100);
      c.coupon = "FIRST20";
      saveCart(c);
      setCart(c);
    }
    setCouponCode("");
  };

  if (!mounted) return <div className="min-h-screen bg-[#121212]" />;

  if (count === 0) {
    return (
      <div className="min-h-screen bg-[#121212] text-white fade-in flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4"><ShoppingBag size={28} className="text-white/20" /></div>
        <p className="text-base font-semibold text-white/60">Your cart is empty</p>
        <p className="text-sm text-white/30 mt-1 text-center">Add some RD-verified meals to get started.</p>
        <Link to="/menu" className="mt-6 px-6 py-2.5 bg-[#D4AF37] text-[#0c0f0f] text-sm font-semibold rounded-full">Browse Menu</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white fade-in pb-28">
      <div className="sticky top-0 z-40 bg-[#121212]/95 backdrop-blur-md border-b border-white/5 px-4 py-3">
        <h1 className="text-base font-semibold">Your Cart ({count})</h1>
      </div>

      <div className="px-4 pt-3 space-y-3">
        {items.map((item: any) => (
          <div key={item.id} className="flex gap-3 bg-[#1a1c1c] border border-white/5 rounded-xl p-3">
            <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-white/5">
              <img src={item.image || "/dish/hm3.jpg"} alt={item.dish_name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold truncate">{item.dish_name}</h3>
              <p className="text-xs text-white/40 mt-0.5">&#8377;{item.price} each</p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2 bg-[#121212] border border-white/10 rounded-lg">
                  <button onClick={() => updateQty(item.id, -1)} className="p-1.5 text-[#D4AF37]">{(item.quantity || 1) <= 1 ? <Trash2 size={14} /> : <Minus size={14} />}</button>
                  <span className="text-xs font-semibold w-4 text-center">{item.quantity || 1}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="p-1.5 text-[#D4AF37]"><Plus size={14} /></button>
                </div>
                <span className="text-sm font-bold text-[#D4AF37]">&#8377;{(item.price || 0) * (item.quantity || 1)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 mt-4">
        <div className="flex items-center gap-2 bg-[#1a1c1c] border border-white/5 rounded-xl p-3">
          <Tag size={16} className="text-[#D4AF37]" />
          <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Try FIRST20" className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none" />
          <button onClick={applyCoup} disabled={!couponCode.trim()} className="px-3 py-1.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg text-xs font-semibold text-[#D4AF37] disabled:opacity-30">Apply</button>
        </div>
        {cart.coupon && <p className="text-xs text-green-400 mt-1">Coupon &quot;{cart.coupon}&quot; applied! Saved &#8377;{discount}</p>}
      </div>

      <div className="mx-4 mt-4 p-4 bg-[#1a1c1c] border border-white/5 rounded-xl space-y-2">
        <div className="flex justify-between text-sm"><span className="text-white/60">Subtotal</span><span className="text-white">&#8377;{subtotal}</span></div>
        {discount > 0 && <div className="flex justify-between text-sm"><span className="text-green-400">Discount</span><span className="text-green-400">-&#8377;{discount}</span></div>}
        <div className="flex justify-between text-sm"><span className="text-white/60">Delivery</span><span className={deliveryFee === 0 ? "text-green-400" : "text-white"}>{deliveryFee === 0 ? "FREE" : `&#8377;${deliveryFee}`}</span></div>
        <div className="flex justify-between text-sm"><span className="text-white/60">Tax (5%)</span><span>&#8377;{tax}</span></div>
        <div className="border-t border-white/10 pt-2 flex justify-between"><span className="text-base font-bold">Total</span><span className="text-base font-bold text-[#D4AF37]">&#8377;{total}</span></div>
        {subtotal > 0 && subtotal < 499 && <p className="text-[10px] text-[#D4AF37]">Add &#8377;{499 - subtotal} more for free delivery!</p>}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#121212] border-t border-white/5 z-40">
        <button onClick={() => navigate("/checkout")} className="w-full py-3.5 bg-[#D4AF37] text-[#0c0f0f] font-bold rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
          Proceed to Checkout <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
