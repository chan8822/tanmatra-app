import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { API } from "@/lib/api";
import { MapPin, CreditCard, Phone, ArrowRight, Shield, CheckCircle } from "lucide-react";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [zone, setZone] = useState("Sector 62");
  const [priority, setPriority] = useState("Direct");
  const [step, setStep] = useState<"details" | "payment">("details");
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tanmatra_cart") || "[]");
    setCart(saved);
    API.items().then((data: any) => setItems(data.items || data || []));
    const user = JSON.parse(localStorage.getItem("tanmatra_user") || "null");
    if (user?.phone) setPhone(user.phone);
  }, []);

  const enriched = useMemo(() => {
    return cart.map((c: any) => {
      const it = items.find((i) => i.id === (c.itemId || c.menu_item_id));
      return { ...c, item: it || {} };
    }).filter((c) => c.item && c.item.id);
  }, [cart, items]);

  const subtotal = enriched.reduce((s, c) => s + (c.item.price || 0) * (c.qty || 1), 0);
  const delivery = subtotal > 500 ? 0 : 49;
  const total = subtotal + delivery;

  const placeOrder = async () => {
    if (!address.trim() || !phone.trim()) return;
    setPlacing(true);
    try {
      const user = JSON.parse(localStorage.getItem("tanmatra_user") || "null");
      const orderItems = enriched.map((c) => ({
        menu_item_id: c.item.id,
        quantity: c.qty || 1,
        unit_price: c.item.price,
        special_instructions: ""
      }));
      const order = await API.createOrder({
        user_id: user?.id || 1,
        items: orderItems,
        delivery_address: address,
        delivery_zone: zone,
        delivery_priority: priority,
        phone,
        total_amount: total,
        payment_method: "razorpay",
        payment_status: "pending"
      });
      localStorage.removeItem("tanmatra_cart");
      window.dispatchEvent(new Event("storage"));
      navigate(`/order/${order.order_id || order.id}`);
    } catch (e) {
      alert("Order failed. Please try again.");
      setPlacing(false);
    }
  };

  if (enriched.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header title="Checkout" backTo="/cart" />
        <div className="flex-1 flex items-center justify-center text-white/40 text-sm">Your cart is empty</div>
      </div>
    );
  }

  return (
    <div className="fade-in pb-24">
      <Header title="Checkout" backTo="/cart" />

      {/* Progress */}
      <div className="px-4 py-3 flex items-center gap-2">
        <div className={`flex-1 h-1 rounded-full ${step === "details" ? "bg-[#D4AF37]" : "bg-[#D4AF37]/30"}`} />
        <div className={`flex-1 h-1 rounded-full ${step === "payment" ? "bg-[#D4AF37]" : "bg-white/10"}`} />
      </div>

      {step === "details" ? (
        <div className="px-4 py-2 space-y-4">
          {/* Contact */}
          <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2"><Phone size={16} className="text-[#D4AF37]" /> Contact</h3>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              className="w-full px-3 py-2.5 bg-[#0c0f0f] border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]/50"
            />
          </div>

          {/* Address */}
          <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2"><MapPin size={16} className="text-[#D4AF37]" /> Delivery Address</h3>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Full address (house, sector, landmark)"
              className="w-full px-3 py-2.5 bg-[#0c0f0f] border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]/50"
            />
            <select
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#0c0f0f] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#D4AF37]/50"
            >
              <option>Sector 62</option>
              <option>Sector 63</option>
              <option>Sector 15</option>
              <option>Sector 18</option>
              <option>Sector 50</option>
              <option>Indirapuram</option>
            </select>
          </div>

          {/* Priority */}
          <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2"><Shield size={16} className="text-[#D4AF37]" /> Delivery Priority</h3>
            <div className="grid grid-cols-3 gap-2">
              {["Elite", "Direct", "Aggregator"].map((p) => (
                <button key={p} onClick={() => setPriority(p)} className={`py-2 rounded-lg text-xs font-medium border ${priority === p ? "bg-[#D4AF37]/15 border-[#D4AF37]/50 text-[#D4AF37]" : "bg-[#0c0f0f] border-white/10 text-white/50"}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Order summary */}
          <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4 space-y-2">
            <h3 className="text-sm font-semibold text-white mb-2">Order Summary</h3>
            {enriched.map((c) => (
              <div key={c.item.id} className="flex justify-between text-xs">
                <span className="text-white/60">{c.item.name} x{c.qty}</span>
                <span className="text-white">₹{(c.item.price || 0) * (c.qty || 1)}</span>
              </div>
            ))}
            <div className="border-t border-white/5 pt-2 flex justify-between text-sm font-bold text-white">
              <span>Total</span><span className="text-[#D4AF37]">₹{total}</span>
            </div>
          </div>

          <button onClick={() => setStep("payment")} className="w-full py-3.5 bg-[#D4AF37] text-[#0c0f0f] rounded-xl font-semibold text-sm active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
            Continue <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        <div className="px-4 py-2 space-y-4">
          {/* Payment */}
          <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2"><CreditCard size={16} className="text-[#D4AF37]" /> Payment</h3>
            <div className="p-3 bg-[#0c0f0f] border border-[#D4AF37]/20 rounded-lg flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]"><Shield size={16} /></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Razorpay Secure Checkout</p>
                <p className="text-[10px] text-white/40">UPI, Cards, NetBanking — All enabled</p>
              </div>
              <CheckCircle size={18} className="text-[#D4AF37]" />
            </div>
            <p className="text-[10px] text-white/30">Razorpay test mode active. Use test card 5267 3181 8797 5449, any future expiry, any CVV.</p>
          </div>

          {/* Final summary */}
          <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm text-white/60"><span>Items</span><span>₹{subtotal}</span></div>
            <div className="flex justify-between text-sm text-white/60"><span>Delivery</span><span>{delivery === 0 ? "FREE" : `₹${delivery}`}</span></div>
            <div className="border-t border-white/5 pt-2 flex justify-between text-lg font-bold text-white">
              <span>Pay</span><span className="text-[#D4AF37]">₹{total}</span>
            </div>
          </div>

          <button onClick={placeOrder} disabled={placing} className="w-full py-3.5 bg-[#D4AF37] text-[#0c0f0f] rounded-xl font-semibold text-sm active:scale-[0.98] transition-transform disabled:opacity-50 flex items-center justify-center gap-2">
            {placing ? "Placing Order..." : <>Pay ₹{total} <ArrowRight size={16} /></>}
          </button>
        </div>
      )}
    </div>
  );
}
