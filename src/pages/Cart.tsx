import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { API } from "@/lib/api";
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag, Bike, MessageSquare, ChevronDown } from "lucide-react";

const COUPONS = [
  { code: "FIRST20", discount: 20, type: "percent", max: 100, desc: "20% off your first order" },
  { code: "TANMATRA50", discount: 50, type: "flat", max: 50, desc: "Flat ₹50 off" },
  { code: "HEALTHY10", discount: 10, type: "percent", max: 50, desc: "10% off healthy meals" },
];

const TIP_OPTIONS = [0, 30, 50, 100];

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [tip, setTip] = useState(0);
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [showCoupons, setShowCoupons] = useState(false);

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
  const extraCharges = enriched.reduce((s, c) => {
    const extra = (c.customizations || []).includes("extra_protein") ? 30 : 0;
    return s + extra * (c.qty || 1);
  }, 0);
  const delivery = subtotal > 500 ? 0 : 49;
  const platformFee = 5;
  const gst = Math.round((subtotal + extraCharges + platformFee) * 0.05);

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === "percent") {
      return Math.min(Math.round(subtotal * appliedCoupon.discount / 100), appliedCoupon.max);
    }
    return Math.min(appliedCoupon.discount, subtotal);
  }, [appliedCoupon, subtotal]);

  const total = subtotal + extraCharges + delivery + platformFee + gst + tip - discount;

  const applyCoupon = () => {
    const found = COUPONS.find((c) => c.code === couponCode.trim().toUpperCase());
    if (found) setAppliedCoupon(found);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  // Persist tip + instructions for checkout
  useEffect(() => {
    localStorage.setItem("tanmatra_checkout_extras", JSON.stringify({ tip, deliveryInstructions }));
  }, [tip, deliveryInstructions]);

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
            <Link to={`/dish/${c.item.id}`} className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-[#0c0f0f]">
              <img
                src={c.item.image || `/dish/${c.item.id}.jpg`}
                alt={c.item.name}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = `/dish/${c.item.category_id}.jpg`; }}
              />
            </Link>
            <div className="flex-1 min-w-0">
              <Link to={`/dish/${c.item.id}`}>
                <h3 className="text-sm font-semibold text-white truncate">{c.item.name}</h3>
              </Link>
              <p className="text-xs text-white/40">{c.item.calories || 0} kcal</p>
              {c.customizations && c.customizations.length > 0 && (
                <p className="text-[10px] text-[#D4AF37] mt-0.5">{c.customizations.join(", ")}</p>
              )}
              {c.spiceLevel && c.spiceLevel !== "medium" && (
                <p className="text-[10px] text-white/30">Spice: {c.spiceLevel}</p>
              )}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2 bg-[#0c0f0f] border border-white/10 rounded-lg">
                  <button onClick={() => updateQty(c.itemId || c.menu_item_id, -1)} className="p-1.5 text-[#D4AF37]"><Minus size={14} /></button>
                  <span className="text-xs font-semibold w-4 text-center text-white">{c.qty || 1}</span>
                  <button onClick={() => updateQty(c.itemId || c.menu_item_id, 1)} className="p-1.5 text-[#D4AF37]"><Plus size={14} /></button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#D4AF37]">
                    ₹{((c.item.price || 0) + ((c.customizations || []).includes("extra_protein") ? 30 : 0)) * (c.qty || 1)}
                  </span>
                  <button onClick={() => removeItem(c.itemId || c.menu_item_id)} className="p-1.5 text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon */}
      <div className="px-4 py-2">
        <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Tag size={14} className="text-[#D4AF37]" />
            <h3 className="text-sm font-semibold text-white">Coupon Code</h3>
          </div>
          {appliedCoupon ? (
            <div className="flex items-center justify-between p-2 bg-[#D4AF37]/10 rounded-lg border border-[#D4AF37]/20">
              <div>
                <span className="text-sm font-semibold text-[#D4AF37]">{appliedCoupon.code}</span>
                <p className="text-[10px] text-white/50">{appliedCoupon.desc}</p>
              </div>
              <button onClick={removeCoupon} className="text-xs text-red-400">Remove</button>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter code (try FIRST20)"
                  className="flex-1 px-3 py-2 bg-[#0c0f0f] border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]/50"
                />
                <button onClick={applyCoupon} className="px-4 py-2 bg-[#D4AF37] text-[#0c0f0f] rounded-lg text-xs font-semibold">Apply</button>
              </div>
              <button onClick={() => setShowCoupons(!showCoupons)} className="flex items-center gap-1 text-xs text-white/40 mt-2">
                <ChevronDown size={12} className={showCoupons ? "rotate-180" : ""} /> View available coupons
              </button>
              {showCoupons && (
                <div className="mt-2 space-y-2">
                  {COUPONS.map((c) => (
                    <button key={c.code} onClick={() => { setCouponCode(c.code); applyCoupon(); }} className="w-full text-left p-2 bg-[#0c0f0f] border border-white/5 rounded-lg">
                      <span className="text-xs font-semibold text-[#D4AF37]">{c.code}</span>
                      <p className="text-[10px] text-white/40">{c.desc}</p>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delivery Instructions */}
      <div className="px-4 py-2">
        <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare size={14} className="text-[#D4AF37]" />
            <h3 className="text-sm font-semibold text-white">Delivery Instructions</h3>
          </div>
          <textarea
            value={deliveryInstructions}
            onChange={(e) => setDeliveryInstructions(e.target.value)}
            placeholder="Leave at door, call before arriving, gate code, etc."
            className="w-full px-3 py-2 bg-[#0c0f0f] border border-white/10 rounded-lg text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]/50 resize-none h-16"
          />
        </div>
      </div>

      {/* Rider Tip */}
      <div className="px-4 py-2">
        <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Bike size={14} className="text-[#D4AF37]" />
            <h3 className="text-sm font-semibold text-white">Tip Your Rider</h3>
          </div>
          <div className="flex gap-2">
            {TIP_OPTIONS.map((t) => (
              <button
                key={t}
                onClick={() => setTip(t)}
                className={`flex-1 py-2 rounded-lg text-xs font-medium border ${tip === t ? "bg-[#D4AF37]/15 border-[#D4AF37]/50 text-[#D4AF37]" : "bg-[#0c0f0f] border-white/10 text-white/50"}`}
              >
                {t === 0 ? "No Tip" : `₹${t}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bill summary */}
      <div className="px-4 py-2">
        <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm text-white/60"><span>Item Total</span><span>₹{subtotal + extraCharges}</span></div>
          {extraCharges > 0 && <div className="flex justify-between text-xs text-white/40"><span>Customizations</span><span>₹{extraCharges}</span></div>}
          <div className="flex justify-between text-sm text-white/60"><span>Delivery Fee</span><span>{delivery === 0 ? "FREE" : `₹${delivery}`}</span></div>
          <div className="flex justify-between text-xs text-white/40"><span>Platform Fee</span><span>₹{platformFee}</span></div>
          <div className="flex justify-between text-xs text-white/40"><span>GST (5%)</span><span>₹{gst}</span></div>
          {tip > 0 && <div className="flex justify-between text-xs text-white/40"><span>Rider Tip</span><span>₹{tip}</span></div>}
          {discount > 0 && <div className="flex justify-between text-sm text-green-400"><span>Discount ({appliedCoupon?.code})</span><span>-₹{discount}</span></div>}
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
