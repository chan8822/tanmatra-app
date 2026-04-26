import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { API } from "@/lib/api";
import { MapPin, CreditCard, Phone, ArrowRight, Shield, CheckCircle, Clock, Home, Plus, Info } from "lucide-react";

const SAVED_ADDRESSES = [
  { id: 1, label: "Home", address: "A-42, Tower 4, Sector 62, Noida", phone: "9876543210" },
  { id: 2, label: "Office", address: "Floor 3, Unitech Cyber Park, Sector 39, Gurgaon", phone: "9876543210" },
];

const ZONES = ["Sector 62", "Sector 63", "Sector 15", "Sector 18", "Sector 50", "Indirapuram", "Sector 137", "Sector 74"];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [extras, setExtras] = useState<any>({ tip: 0, deliveryInstructions: "" });

  // Auth state
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Address
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [newAddress, setNewAddress] = useState("");
  const [newZone, setNewZone] = useState("Sector 62");
  const [showNewAddress, setShowNewAddress] = useState(false);

  // Scheduling
  const [scheduleType, setScheduleType] = useState<"asap" | "later">("asap");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");

  // Payment
  const [step, setStep] = useState<"details" | "payment">("details");
  const [placing, setPlacing] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  // Saved addresses from localStorage
  const [addresses, setAddresses] = useState(SAVED_ADDRESSES);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tanmatra_cart") || "[]");
    setCart(saved);
    API.items().then((data: any) => setItems(data.items || data || []));
    const ext = JSON.parse(localStorage.getItem("tanmatra_checkout_extras") || "{}");
    setExtras(ext);

    const savedUser = JSON.parse(localStorage.getItem("tanmatra_user") || "null");
    if (savedUser?.phone) {
      setLoggedIn(true);
      setUser(savedUser);
      setPhone(savedUser.phone);
    }

    const savedAddrs = JSON.parse(localStorage.getItem("tanmatra_addresses") || "null");
    if (savedAddrs) setAddresses(savedAddrs);
  }, []);

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
  const total = subtotal + extraCharges + delivery + platformFee + gst + (extras.tip || 0);

  const sendOTP = () => {
    if (!phone.match(/^[6-9]\d{9}$/)) return;
    setOtpSent(true);
  };

  const verifyOTP = () => {
    if (otp === "123456") {
      const user = { id: 1, phone, name: "Rahul" };
      setLoggedIn(true);
      setUser(user);
      localStorage.setItem("tanmatra_user", JSON.stringify(user));
    }
  };

  const addNewAddress = () => {
    if (!newAddress.trim()) return;
    const addr = { id: Date.now(), label: "New", address: newAddress, phone: user?.phone || phone };
    const updated = [...addresses, addr];
    setAddresses(updated);
    localStorage.setItem("tanmatra_addresses", JSON.stringify(updated));
    setSelectedAddress(addr.id);
    setShowNewAddress(false);
    setNewAddress("");
  };

  const placeOrder = async () => {
    const addr = addresses.find((a) => a.id === selectedAddress);
    if (!addr && !newAddress.trim()) {
      setPaymentError("Please select or add a delivery address");
      return;
    }
    setPlacing(true);
    setPaymentError("");

    try {
      // Create Razorpay order (real test API call if keys are present, otherwise simulated)
      const orderItems = enriched.map((c) => ({
        menu_item_id: c.item.id,
        quantity: c.qty || 1,
        unit_price: c.item.price,
        special_instructions: c.instructions || "",
        spice_level: c.spiceLevel || "medium",
        customizations: c.customizations || [],
      }));

      const order = await API.createOrder({
        user_id: user?.id || 1,
        items: orderItems,
        delivery_address: addr?.address || newAddress,
        delivery_zone: addr ? ZONES[0] : newZone,
        delivery_priority: "Direct",
        phone: user?.phone || phone,
        total_amount: total,
        payment_method: "razorpay",
        payment_status: "pending",
        scheduled_for: scheduleType === "later" ? `${deliveryDate}T${deliveryTime}` : null,
        tip: extras.tip || 0,
        delivery_instructions: extras.deliveryInstructions || "",
      });

      localStorage.removeItem("tanmatra_cart");
      localStorage.removeItem("tanmatra_checkout_extras");
      window.dispatchEvent(new Event("storage"));
      navigate(`/order/${order.order_id || order.id}`);
    } catch (e: any) {
      setPaymentError(e.message || "Payment failed. Please try again.");
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
          {/* Login */}
          {!loggedIn ? (
            <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2"><Phone size={16} className="text-[#D4AF37]" /> Login with OTP</h3>
              {!otpSent ? (
                <>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter 10-digit phone number"
                    maxLength={10}
                    className="w-full px-3 py-2.5 bg-[#0c0f0f] border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]/50"
                  />
                  <button onClick={sendOTP} disabled={!phone.match(/^[6-9]\d{9}$/)} className="w-full py-2.5 bg-[#D4AF37] text-[#0c0f0f] rounded-lg text-sm font-semibold disabled:opacity-40">Send OTP</button>
                  <p className="text-[10px] text-white/30">Use 123456 as OTP for demo</p>
                </>
              ) : (
                <>
                  <p className="text-xs text-white/50">OTP sent to +91 {phone}</p>
                  <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className="w-full px-3 py-2.5 bg-[#0c0f0f] border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]/50"
                  />
                  <button onClick={verifyOTP} className="w-full py-2.5 bg-[#D4AF37] text-[#0c0f0f] rounded-lg text-sm font-semibold">Verify & Continue</button>
                </>
              )}
            </div>
          ) : (
            <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                <CheckCircle size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{user?.phone || phone}</p>
                <p className="text-xs text-white/40">Logged in via OTP</p>
              </div>
            </div>
          )}

          {/* Address */}
          <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2"><MapPin size={16} className="text-[#D4AF37]" /> Delivery Address</h3>
            {addresses.map((addr) => (
              <button
                key={addr.id}
                onClick={() => setSelectedAddress(addr.id)}
                className={`w-full text-left p-3 rounded-lg border flex items-start gap-3 ${selectedAddress === addr.id ? "bg-[#D4AF37]/10 border-[#D4AF37]/40" : "bg-[#0c0f0f] border-white/10"}`}
              >
                <Home size={16} className={selectedAddress === addr.id ? "text-[#D4AF37] mt-0.5" : "text-white/40 mt-0.5"} />
                <div>
                  <p className={`text-xs font-semibold ${selectedAddress === addr.id ? "text-[#D4AF37]" : "text-white/70"}`}>{addr.label}</p>
                  <p className="text-[10px] text-white/40">{addr.address}</p>
                </div>
              </button>
            ))}
            {!showNewAddress ? (
              <button onClick={() => setShowNewAddress(true)} className="w-full py-2.5 border border-dashed border-white/15 rounded-lg text-xs text-white/40 flex items-center justify-center gap-2">
                <Plus size={14} /> Add New Address
              </button>
            ) : (
              <div className="space-y-2">
                <input value={newAddress} onChange={(e) => setNewAddress(e.target.value)} placeholder="Full address" className="w-full px-3 py-2 bg-[#0c0f0f] border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30" />
                <select value={newZone} onChange={(e) => setNewZone(e.target.value)} className="w-full px-3 py-2 bg-[#0c0f0f] border border-white/10 rounded-lg text-sm text-white">
                  {ZONES.map((z) => <option key={z}>{z}</option>)}
                </select>
                <div className="flex gap-2">
                  <button onClick={addNewAddress} className="flex-1 py-2 bg-[#D4AF37] text-[#0c0f0f] rounded-lg text-xs font-semibold">Save Address</button>
                  <button onClick={() => setShowNewAddress(false)} className="flex-1 py-2 bg-white/5 text-white/60 rounded-lg text-xs">Cancel</button>
                </div>
              </div>
            )}
          </div>

          {/* Scheduling */}
          <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2"><Clock size={16} className="text-[#D4AF37]" /> Delivery Time</h3>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setScheduleType("asap")} className={`py-2.5 rounded-lg text-xs font-medium border ${scheduleType === "asap" ? "bg-[#D4AF37]/15 border-[#D4AF37]/50 text-[#D4AF37]" : "bg-[#0c0f0f] border-white/10 text-white/50"}`}>
                ASAP (~30 min)
              </button>
              <button onClick={() => setScheduleType("later")} className={`py-2.5 rounded-lg text-xs font-medium border ${scheduleType === "later" ? "bg-[#D4AF37]/15 border-[#D4AF37]/50 text-[#D4AF37]" : "bg-[#0c0f0f] border-white/10 text-white/50"}`}>
                Schedule Later
              </button>
            </div>
            {scheduleType === "later" && (
              <div className="flex gap-2">
                <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className="flex-1 px-3 py-2 bg-[#0c0f0f] border border-white/10 rounded-lg text-sm text-white" />
                <input type="time" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} className="flex-1 px-3 py-2 bg-[#0c0f0f] border border-white/10 rounded-lg text-sm text-white" />
              </div>
            )}
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
            <div className="border-t border-white/5 pt-2 space-y-1">
              <div className="flex justify-between text-xs text-white/40"><span>Delivery</span><span>{delivery === 0 ? "FREE" : `₹${delivery}`}</span></div>
              <div className="flex justify-between text-xs text-white/40"><span>Platform Fee + GST</span><span>₹{platformFee + gst}</span></div>
              {extras.tip > 0 && <div className="flex justify-between text-xs text-white/40"><span>Rider Tip</span><span>₹{extras.tip}</span></div>}
            </div>
            <div className="flex justify-between text-sm font-bold text-white pt-1">
              <span>Total</span><span className="text-[#D4AF37]">₹{total}</span>
            </div>
          </div>

          <button onClick={() => setStep("payment")} disabled={!loggedIn || (!selectedAddress && !newAddress)} className="w-full py-3.5 bg-[#D4AF37] text-[#0c0f0f] rounded-xl font-semibold text-sm active:scale-[0.98] transition-transform disabled:opacity-40 flex items-center justify-center gap-2">
            Continue <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        <div className="px-4 py-2 space-y-4">
          {/* Payment */}
          <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2"><CreditCard size={16} className="text-[#D4AF37]" /> Payment Method</h3>
            <div className="p-3 bg-[#0c0f0f] border border-[#D4AF37]/20 rounded-lg flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]"><Shield size={16} /></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Razorpay Secure Checkout</p>
                <p className="text-[10px] text-white/40">UPI, Cards, NetBanking, Wallets</p>
              </div>
              <CheckCircle size={18} className="text-[#D4AF37]" />
            </div>
            <div className="p-2 bg-blue-500/5 border border-blue-500/10 rounded-lg">
              <p className="text-[10px] text-blue-400 flex items-start gap-1.5">
                <Info size={12} className="shrink-0 mt-0.5" />
                Test mode active. Use card 5267 3181 8797 5449, any future expiry, any CVV. No real money will be deducted.
              </p>
            </div>
          </div>

          {/* Final summary */}
          <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm text-white/60"><span>Items ({enriched.length})</span><span>₹{subtotal + extraCharges}</span></div>
            <div className="flex justify-between text-xs text-white/40"><span>Delivery</span><span>{delivery === 0 ? "FREE" : `₹${delivery}`}</span></div>
            <div className="flex justify-between text-xs text-white/40"><span>Platform + GST</span><span>₹{platformFee + gst}</span></div>
            {extras.tip > 0 && <div className="flex justify-between text-xs text-white/40"><span>Rider Tip</span><span>₹{extras.tip}</span></div>}
            <div className="border-t border-white/5 pt-2 flex justify-between text-lg font-bold text-white">
              <span>Pay</span><span className="text-[#D4AF37]">₹{total}</span>
            </div>
          </div>

          {paymentError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">{paymentError}</div>
          )}

          <button onClick={placeOrder} disabled={placing} className="w-full py-3.5 bg-[#D4AF37] text-[#0c0f0f] rounded-xl font-semibold text-sm active:scale-[0.98] transition-transform disabled:opacity-50 flex items-center justify-center gap-2">
            {placing ? (
              <>Processing Payment...</>
            ) : (
              <>Pay ₹{total} Securely <ArrowRight size={16} /></>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
