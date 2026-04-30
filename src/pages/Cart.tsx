import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, ChevronRight, Minus, Plus, Tag, Scissors, Edit3, Crown, Truck, Calendar, TrendingUp } from "lucide-react";
import { cartStore } from "@/lib/store";
import { ROUTES } from "@/lib/routes";
import { p, saveVsAggregator } from "@/lib/format";
import { menuItems } from "@/data/menu";

const ADDRESS = "52 U Block, Sector 24, Gurgaon";

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(cartStore.get());
  const [noCutlery, setNoCutlery] = useState(false);

  useEffect(() => {
    return cartStore.subscribe(() => setCart(cartStore.get()));
  }, []);

  const items = cart.items || [];
  const savings = saveVsAggregator(cart.subtotal || 0);

  const cartIds = new Set(items.map((i) => i.id));
  const crossSell = menuItems.filter((m) => !cartIds.has(m.id)).slice(0, 8);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5">
          <div className="flex items-center gap-3 px-4 py-3">
            <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-white/60 hover:text-white">
              <ArrowLeft size={22} />
            </button>
            <h1 className="text-base font-semibold">Cart</h1>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/30">
              <path d="M6 6h15l-1.5 9h-12L6 6z" /><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold mb-1">Your cart is empty</h2>
          <p className="text-sm text-white/40 mb-6">Add delicious, RD-verified meals to get started</p>
          <button onClick={() => navigate(ROUTES.menu)} className="btn-primary px-8 rounded-xl">Browse Menu</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-32">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-white/60 hover:text-white">
            <ArrowLeft size={22} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-semibold truncate">{cart.restaurantName}</h1>
            <div className="flex items-center gap-2 text-[11px] text-white/40">
              <Clock size={10} /> 25-30 mins &middot; <MapPin size={10} /> {ADDRESS}
            </div>
          </div>
        </div>
      </div>

      {/* Savings Banner */}
      {savings > 0 && (
        <div className="mx-4 mt-3 p-3 savings-banner flex items-center gap-2">
          <Tag size={14} className="text-blue-400 shrink-0" />
          <p className="text-xs text-blue-300">You saved <span className="font-bold">{p(savings)}</span> on this order vs Swiggy</p>
        </div>
      )}

      {/* Free Delivery Threshold */}
      {cart.subtotal < 499 && (
        <div className="mx-4 mt-3 p-3 card border border-green-500/20">
          <div className="flex items-center gap-2">
            <Truck size={16} className="text-green-400 shrink-0" />
            <p className="text-xs text-white/60">Add <span className="font-bold text-green-400">{p(499 - cart.subtotal)}</span> more for <span className="font-bold text-green-400">FREE delivery</span></p>
          </div>
          <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-green-400 rounded-full" style={{ width: `${Math.min(100, (cart.subtotal / 499) * 100)}%` }} />
          </div>
        </div>
      )}

      {/* Gold Upsell */}
      <div className="mx-4 mt-3 p-3 bg-gradient-to-r from-[#D4AF37]/15 to-transparent border border-[#D4AF37]/20 rounded-xl flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center shrink-0">
          <Crown size={16} className="text-[#D4AF37]" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-[#D4AF37]">Get Gold & save 20%</p>
          <p className="text-[9px] text-white/40">This order would cost {p(Math.round(cart.total * 0.8))} with Gold</p>
        </div>
        <button onClick={() => navigate(ROUTES.gold)} className="shrink-0 px-2.5 py-1 bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] text-[9px] font-bold rounded">
          Upgrade
        </button>
      </div>

      {/* Subscription Upsell */}
      <div className="mx-4 mt-3 p-3 card border border-green-500/20 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
          <Calendar size={16} className="text-green-400" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-green-400">Subscribe & save 30%</p>
          <p className="text-[9px] text-white/40">Daily meals from {p(199)}/meal</p>
        </div>
        <button onClick={() => navigate(ROUTES.subscriptions)} className="shrink-0 px-2.5 py-1 bg-green-500/20 border border-green-500/30 text-green-400 text-[9px] font-bold rounded">
          View
        </button>
      </div>

      {/* Cart Items */}
      <div className="mx-4 mt-4 card-elevated p-4 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            <div className="mt-0.5">
              {item.isVeg ? (
                <div className="w-4 h-4 border border-green-500 rounded-sm flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                </div>
              ) : (
                <div className="w-4 h-4 border border-red-500 rounded-sm flex items-center justify-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium truncate">{item.name}</h3>
              <button onClick={() => navigate(ROUTES.dish(item.id))} className="text-[10px] text-[#D4AF37] mt-0.5 flex items-center gap-0.5">
                <Edit3 size={8} /> Edit
              </button>
            </div>
            <div className="qty-stepper">
              <button onClick={() => cartStore.updateQty(item.id, item.qty - 1)}><Minus size={12} strokeWidth={3} /></button>
              <span>{item.qty}</span>
              <button onClick={() => cartStore.updateQty(item.id, item.qty + 1)}><Plus size={12} strokeWidth={3} /></button>
            </div>
            <div className="text-right shrink-0 min-w-[60px]">
              <p className="text-sm font-semibold">{p(item.price * item.qty)}</p>
            </div>
          </div>
        ))}
        <div className="h-px bg-white/5" />
        <Link to={ROUTES.menu} className="flex items-center gap-2 text-sm text-[#D4AF37]">
          <Plus size={14} /> Add more items
        </Link>
      </div>

      {/* Notes */}
      <div className="mx-4 mt-3 card p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Edit3 size={16} className="text-white/40" />
          <span className="text-sm">Add a note for the restaurant</span>
          <ChevronRight size={14} className="text-white/20 ml-auto" />
        </div>
        <div className="h-px bg-white/5" />
        <button onClick={() => setNoCutlery(!noCutlery)} className="flex items-center gap-3 w-full text-left">
          <Scissors size={16} className={noCutlery ? "text-green-400" : "text-white/40"} />
          <span className="text-sm flex-1">Don't send cutlery</span>
          {noCutlery && (
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          )}
        </button>
      </div>

      {/* Cross-sell */}
      {crossSell.length > 0 && (
        <div className="mt-5">
          <h2 className="text-sm font-semibold px-4 mb-3">Complete your meal with</h2>
          <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-2">
            {crossSell.map((item) => (
              <button key={item.id} onClick={() => cartStore.addItem({ id: item.id, name: item.name, price: item.price, image: item.image, isVeg: item.is_vegetarian })}
                className="shrink-0 w-32 text-left">
                <div className="w-32 h-24 rounded-xl overflow-hidden bg-[#1c1c1c] mb-2 relative">
                  <img src={item.image || `/dish/${item.id}.jpg`} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute bottom-1 right-1 w-6 h-6 bg-[#E23744] rounded-full flex items-center justify-center">
                    <Plus size={12} strokeWidth={3} className="text-white" />
                  </div>
                </div>
                <p className="text-[11px] font-medium truncate">{item.name}</p>
                <p className="text-[10px] text-white/40">{p(item.price)}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bill */}
      <div className="mx-4 mt-5 card p-4 space-y-2.5">
        <h2 className="text-sm font-semibold mb-2">Bill Details</h2>
        <div className="flex justify-between text-sm"><span className="text-white/50">Item Total</span><span>{p(cart.subtotal || 0)}</span></div>
        <div className="flex justify-between text-sm"><span className="text-white/50">Delivery Fee</span><span className={cart.deliveryFee === 0 ? "text-green-400 font-medium" : ""}>{cart.deliveryFee === 0 ? "FREE" : p(cart.deliveryFee)}</span></div>
        <div className="flex justify-between text-sm"><span className="text-white/50">GST (5%)</span><span>{p(cart.tax || 0)}</span></div>
        {cart.discount > 0 && <div className="flex justify-between text-sm text-green-400"><span>Discount ({cart.coupon})</span><span>-{p(cart.discount)}</span></div>}
        <div className="h-px bg-white/5 my-1" />
        <div className="flex justify-between"><span className="text-sm font-bold">To Pay</span><span className="text-sm font-bold">{p(cart.total || 0)}</span></div>
      </div>

      {/* Payment */}
      <div className="mx-4 mt-3 card p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#4285F4" /></svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">Google Pay UPI</p>
          <p className="text-[10px] text-white/40">Pay securely via UPI</p>
        </div>
        <ChevronRight size={14} className="text-white/20" />
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-[#0a0a0a] border-t border-white/5 p-4">
        <button onClick={() => navigate(ROUTES.checkout)} className="w-full btn-primary text-base rounded-xl">
          <span className="flex-1 text-left">Place Order</span>
          <span className="font-bold">{p(cart.total || 0)}</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
