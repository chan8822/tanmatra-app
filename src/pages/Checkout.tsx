import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, CheckCircle, ArrowLeft, Tag, ShieldCheck, Truck, Crown, Wallet, Sparkles, TrendingDown, Calendar, Loader2, CreditCard, Package, ShoppingCart } from "lucide-react";
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
  const [processing, setProcessing] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponMsg, setCouponMsg] = useState("");
  const [couponOk, setCouponOk] = useState(false);

  // Subscribe to cart updates — critical for stability when navigating back/forth
  useEffect(() => {
    const update = () => {
      const fresh = cartStore.get();
      setCart(fresh);
    };
    update();
    return cartStore.subscribe(update);
  }, []);

  const handlePay = () => {
    if (cart.items.length === 0) return;
    setProcessing(true);
    setTimeout(() => {
      const address = ADDRESSES.find((a) => a.id === addr);
      const order = orderStore.add({
        status: "confirmed",
        paymentStatus: "pending",
        items: cart.items.map((i) => ({ ...i })),
        total: cart.total,
        subtotal: cart.subtotal,
        tax: cart.tax,
        deliveryFee: cart.deliveryFee,
        discount: cart.discount,
        address: address?.address || "",
        estimatedTime: "25-30 mins",
      });

      // Simulate payment completion after order creation
      orderStore.updatePaymentStatus(order.id, "paid");

      cartStore.clear();
      setOrderId(order.id);
      setProcessing(false);
      setPlaced(true);
    }, 2000);
  };

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    const coupons: Record<string, number> = { FIRST100: 100, TAN100: 100, FIRST20: 20, GOLD50: 50 };
    const value = coupons[code];
    if (value && cart.subtotal >= 299) {
      cartStore.setCoupon(code, value);
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
          <button onClick={() => navigate(ROUTES.track(orderId))} className="flex-1 btn-gold text-sm py-3 rounded-xl">Track Order</button>
          <button onClick={() => navigate(ROUTES.home)} className="flex-1 btn-outline text-sm py-3 rounded-xl">Home</button>
        </div>
      </div>
    );
  }

  // Enhanced empty cart state — graceful recovery from zero-out scenario
  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <ShoppingCart size={32} className="text-white/30" />
        </div>
        <h2 className="text-lg font-semibold mb-1">Your cart is empty</h2>
        <p className="text-sm text-white/40 mb-2">Items you added may have been removed</p>
        <p className="text-xs text-white/20 mb-6">Add delicious, RD-verified meals to get started</p>
        <div className="flex gap-3 w-full max-w-xs">
          <button onClick={() => navigate(ROUTES.menu)} className="flex-1 btn-primary text-sm py-3 rounded-xl flex items-center justify-center gap-2">
            <Package size={16} /> Browse Menu
          </button>
          <button onClick={() => navigate(ROUTES.home)} className="flex-1 btn-outline text-sm py-3 rounded-xl">Home</button>
        </div>
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

      {/* Savings banner */}
      <div className="mt-3 p-3 bg-gradient-to-r from-green-500/10 to-green-500/5 border border-green-500/20 rounded-xl flex items-center gap-3">
        <TrendingDown size={18} className="text-green-400 shrink-0" />
        <div className="flex-1">
          <p className="text-xs font-bold text-green-400">You save {p(cart.savings)} vs Swiggy/Zomato</p>
          <p className="text-[10px] text-white/40">Same meals, no platform markups, no hidden charges</p>
        </div>
        <Sparkles size={14} className="text-green-400 shrink-0" />
      </div>

      {/* Gold upsell */}
      <div className="mt-3 p-3 bg-gradient-to-r from-[#D4AF37]/10 to-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-xl flex items-center gap-3">
        <Crown size={18} className="text-[#D4AF37] shrink-0" />
        <div className="flex-1">
          <p className="text-xs font-bold text-[#D4AF37]">Get Gold & save 20% more</p>
          <p className="text-[10px] text-white/40">This order would be {p(Math.round(cart.total * 0.8))} with Gold</p>
        </div>
        <button onClick={() => navigate(ROUTES.gold)} className="text-[10px] font-bold text-[#0a0a0a] bg-[#D4AF37] px-2.5 py-1 rounded-lg">Upgrade</button>
      </div>

      {/* Free delivery progress */}
      {cart.subtotal < 499 && (
        <div className="mt-3 p-3 card border border-green-500/20 flex items-center gap-3">
          <Truck size={16} className="text-green-400 shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-white/60">Add {p(499 - cart.subtotal)} more for <span className="text-green-400 font-bold">FREE delivery</span></p>
            <div className="h-1 bg-white/5 rounded-full mt-1.5 overflow-hidden">
              <div className="h-full bg-green-400 rounded-full" style={{ width: `${Math.min(100, (cart.subtotal / 499) * 100)}%` }} />
            </div>
          </div>
        </div>
      )}

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
        <p className="text-xs text-white/50">100% secure payment via Razorpay. Your data is encrypted.</p>
      </div>

      {/* Wallet */}
      <div className="mt-3 p-3 card flex items-center gap-3">
        <Wallet size={16} className="text-[#D4AF37] shrink-0" />
        <div className="flex-1">
          <p className="text-xs font-bold text-white/80">Tanmatra Wallet</p>
          <p className="text-[10px] text-white/40">0 points &middot; Earn {Math.round(cart.total / 10)} points on this order</p>
        </div>
        <span className="text-[10px] text-white/30">Coming soon</span>
      </div>

      {/* Subscription upsell */}
      <div className="mt-3 p-3 card border border-green-500/20 flex items-center gap-3">
        <Calendar size={16} className="text-green-400 shrink-0" />
        <div className="flex-1">
          <p className="text-xs font-bold text-green-400">Subscribe & save 30%</p>
          <p className="text-[10px] text-white/40">Get daily meals from {p(Math.round(cart.subtotal * 0.7 / Math.max(1, cart.items.reduce((s,i) => s + i.qty, 0))))}/meal</p>
        </div>
        <button onClick={() => navigate(ROUTES.subscriptions)} className="text-[10px] font-bold text-green-400 border border-green-500/30 px-2.5 py-1 rounded-lg">View</button>
      </div>

      <div className="mt-5 card p-4 space-y-2">
        <div className="flex justify-between text-sm"><span className="text-white/50">Subtotal</span><span>{p(cart.subtotal)}</span></div>
        <div className="flex justify-between text-sm"><span className="text-white/50">Delivery</span><span className={cart.deliveryFee === 0 ? "text-green-400" : ""}>{cart.deliveryFee === 0 ? "FREE" : p(cart.deliveryFee)}</span></div>
        <div className="flex justify-between text-sm"><span className="text-white/50">GST</span><span>{p(cart.tax)}</span></div>
        {cart.discount > 0 && <div className="flex justify-between text-sm text-green-400"><span>Discount ({cart.coupon})</span><span>-{p(cart.discount)}</span></div>}
        <div className="h-px bg-white/5" />
        <div className="flex justify-between font-bold"><span>Total</span><span>{p(cart.total)}</span></div>
      </div>

      {/* Payment Overlay */}
      {processing && (
        <div className="fixed inset-0 z-[10000] bg-black/80 flex flex-col items-center justify-center px-6">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-4">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#3395FF"/><path d="M7 12l3 3 5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <p className="text-lg font-bold mb-1">Processing Payment</p>
          <p className="text-sm text-white/50 mb-6">Secure checkout via Razorpay</p>
          <div className="flex items-center gap-2 text-sm text-white/40">
            <Loader2 size={16} className="animate-spin" />
            <span>Please wait...</span>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-[#0a0a0a] border-t border-white/5 p-4">
        <button onClick={handlePay} disabled={processing || cart.items.length === 0} className="w-full btn-primary text-base rounded-xl flex items-center justify-center gap-2">
          {processing ? <Loader2 size={18} className="animate-spin" /> : <CreditCard size={18} />}
          <span>{processing ? "Processing..." : `Pay ${p(cart.total)} & Place Order`}</span>
        </button>
      </div>
    </div>
  );
}
