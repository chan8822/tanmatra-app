import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, CheckCircle, ArrowLeft, Tag, Wallet, ShieldCheck } from "lucide-react";
import { cartStore, orderStore } from "@/lib/store";
import { ROUTES } from "@/lib/routes";
import { p } from "@/lib/format";

const ADDRESSES = [
  { id: "home", label: "Home", address: "A-45, Sector 62, Noida", phone: "+91-9876543210" },
  { id: "office", label: "Office", address: "HCL Towers, Sector 126, Noida", phone: "+91-9876543210" },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(cartStore.get());
  const [addr, setAddr] = useState("home");
  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponMsg, setCouponMsg] = useState("");
  const [couponOk, setCouponOk] = useState(false);

  useEffect(() => {
    setCart(cartStore.get());
  }, []);

  const handlePay = () => {
    const address = ADDRESSES.find((a) => a.id === addr);
    const order = orderStore.add({
      status: "confirmed",
      items: cart.items.map((i) => ({ ...i })),
      total: cart.total,
      subtotal: cart.subtotal,
      tax: cart.tax,
      deliveryFee: cart.deliveryFee,
      discount: cart.discount,
      address: address?.address || "",
      estimatedTime: "25-30 mins",
    });
    cartStore.clear();
    setOrderId(order.id);
    setPlaced(true);
  };

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    const coupons: Record<string, number> = { FIRST100: 100, TAN100: 100, FIRST20: 20, GOLD50: 50 };
    const value = coupons[code];
    if (value && cart.subtotal >= 299) {
      cartStore.setCoupon(code, value);
      setCart(cartStore.get());
      setCouponMsg("Coupon applied! Saved " + p(value));
      setCouponOk(true);
    } else if (value) {
      setCouponMsg("Add " + p(299 - cart.subtotal) + " more to use " + code);
      setCouponOk(false);
    } else {
      setCouponMsg("Invalid coupon code");
      setCouponOk(false);
    }
    setTimeout(() => setCouponMsg(""), 4000);
  };

  if (placed) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
          <CheckCircle size={32} className="text-green-400" />
        </div>
        <h2 className="text-xl font-bold mb-1">Order Placed!</h2>
        <p className="text-sm text-white/50 mb-1">Order <span className="text-[#D4AF37] font-mono">{orderId}</span> confirmed</p>
        <p className="text-xs text-white/30 mb-8">RD-verified meals are being prepared fresh</p>
        <div className="flex gap-3 w-full max-w-xs">
          <button onClick={() => navigate(ROUTES.orders)} className="flex-1 btn-gold text-sm py-3 rounded-xl">Track Order</button>
          <button onClick={() => navigate(ROUTES.home)} className="flex-1 btn-outline text-sm py-3 rounded-xl">Home</button>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-6 text-center">
        <p className="text-white/40 mb-4">Your cart is empty</p>
        <button onClick={() => navigate(ROUTES.menu)} className="btn-primary px-8 rounded-xl">Browse Menu</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 pb-28">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate(-1)} className="text-white/60 hover:text-white"><ArrowLeft size={22} /></button>
        <h1 className="text-base font-semibold">Checkout</h1>
      </div>

      <h2 className="text-xs font-bold text-white/40 uppercase mb-3">Delivery Address</h2>
      {ADDRESSES.map((a) => (
        <button key={a.id} onClick={() => setAddr(a.id)}
          className={`w-full flex items-start gap-3 p-3.5 rounded-xl border mb-2 text-left transition-colors ${addr === a.id ? "bg-[#D4AF37]/10 border-[#D4AF37]/40" : "bg-[#141414] border-white/5"}`}>
          <MapPin size={16} className={addr === a.id ? "text-[#D4AF37] shrink-0 mt-0.5" : "text-white/40 shrink-0 mt-0.5"} />
          <div>
            <p className="text-sm font-semibold">{a.label}</p>
            <p className="text-xs text-white/40">{a.address}</p>
          </div>
          {addr === a.id && <CheckCircle size={16} className="text-[#D4AF37] ml-auto shrink-0" />}
        </button>
      ))}

      <h2 className="text-xs font-bold text-white/40 uppercase mt-6 mb-3">Order Summary</h2>
      <div className="card p-3 space-y-2">
        {cart.items.map((i) => (
          <div key={i.id} className="flex justify-between text-sm">
            <span className="text-white/60">{i.name} <span className="text-white/30">x{i.qty}</span></span>
            <span>{p(i.price * i.qty)}</span>
          </div>
        ))}
      </div>

      <h2 className="text-xs font-bold text-white/40 uppercase mt-6 mb-3">Apply Coupon</h2>
      <div className="card p-3 flex items-center gap-2">
        <Tag size={14} className="text-[#D4AF37] shrink-0" />
        <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Try FIRST100" className="flex-1 bg-transparent text-sm placeholder:text-white/30 outline-none" />
        <button onClick={applyCoupon} disabled={!couponCode.trim()} className="px-3 py-1.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg text-xs font-semibold text-[#D4AF37] disabled:opacity-30">Apply</button>
      </div>
      {couponMsg && (
        <p className={`mt-2 text-xs ${couponOk ? "text-green-400" : "text-red-400"}`}>{couponMsg}</p>
      )}

      <div className="mt-4 flex items-center gap-2 p-3 bg-[#D4AF37]/5 border border-[#D4AF37]/15 rounded-xl">
        <ShieldCheck size={16} className="text-[#D4AF37] shrink-0" />
        <p className="text-xs text-white/50">100% secure payment. Your data is encrypted.</p>
      </div>

      <div className="mt-5 card p-4 space-y-2">
        <div className="flex justify-between text-sm"><span className="text-white/50">Subtotal</span><span>{p(cart.subtotal)}</span></div>
        <div className="flex justify-between text-sm"><span className="text-white/50">Delivery</span><span className={cart.deliveryFee === 0 ? "text-green-400" : ""}>{cart.deliveryFee === 0 ? "FREE" : p(cart.deliveryFee)}</span></div>
        <div className="flex justify-between text-sm"><span className="text-white/50">GST</span><span>{p(cart.tax)}</span></div>
        {cart.discount > 0 && <div className="flex justify-between text-sm text-green-400"><span>Discount</span><span>-{p(cart.discount)}</span></div>}
        <div className="h-px bg-white/5" />
        <div className="flex justify-between font-bold"><span>Total</span><span>{p(cart.total)}</span></div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-[#0a0a0a] border-t border-white/5 p-4">
        <button onClick={handlePay} className="w-full btn-primary text-base rounded-xl">
          Pay {p(cart.total)} & Place Order
        </button>
      </div>
    </div>
  );
}
