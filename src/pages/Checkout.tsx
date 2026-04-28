import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, CheckCircle, ArrowLeft } from "lucide-react";

const SAVED_ADDRESSES = [
  { id: "home", label: "Home", address: "52 U Block, Sector 24, Gurgaon", phone: "+91-9876543210" },
  { id: "office", label: "Office", address: "DLF Phase 3, Sector 26, Gurgaon", phone: "+91-9876543210" },
];

function getCart() {
  try { return JSON.parse(localStorage.getItem("tanmatra_cart") || "null") || { items: [] }; }
  catch { return { items: [] }; }
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [] });
  const [selectedAddress, setSelectedAddress] = useState("home");
  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    setCart(getCart());
  }, []);

  const items = cart.items || [];

  const handlePay = () => {
    const oid = "TAN-" + Math.floor(1000 + Math.random() * 9000);
    setOrderId(oid);
    setPlaced(true);
    localStorage.removeItem("tanmatra_cart");
    window.dispatchEvent(new Event("cartUpdated"));
  };

  if (placed) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center px-6 text-center">
        <CheckCircle size={40} className="text-green-400 mb-4" />
        <h2 className="text-xl font-bold">Order Placed!</h2>
        <p className="text-sm text-white/60 mt-2">Order <span className="text-[#D4AF37]">{orderId}</span> confirmed.</p>
        <button onClick={() => navigate("/")} className="mt-6 px-6 py-2 bg-[#D4AF37] text-[#0c0f0f] rounded-full">Back to Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white p-4">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate("/basket")} className="text-white/60"><ArrowLeft size={20} /></button>
        <h1 className="text-base font-semibold">Checkout</h1>
      </div>

      <h2 className="text-xs font-bold text-white/60 uppercase mb-3">Delivery Address</h2>
      {SAVED_ADDRESSES.map((addr) => (
        <button key={addr.id} onClick={() => setSelectedAddress(addr.id)}
          className={`w-full flex items-start gap-3 p-3 rounded-xl border mb-2 text-left ${selectedAddress === addr.id ? "bg-[#D4AF37]/10 border-[#D4AF37]/40" : "bg-[#1a1c1c] border-white/5"}`}>
          <MapPin size={16} className={selectedAddress === addr.id ? "text-[#D4AF37]" : "text-white/40"} />
          <div>
            <p className="text-sm font-semibold">{addr.label}</p>
            <p className="text-xs text-white/40">{addr.address}</p>
          </div>
        </button>
      ))}

      <h2 className="text-xs font-bold text-white/60 uppercase mt-6 mb-3">Order Summary</h2>
      <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-3">
        {items.map((item: any) => (
          <div key={item.id} className="flex justify-between text-sm mb-1">
            <span className="text-white/60">{item.dish_name} x{item.quantity}</span>
            <span>&#8377;{item.price * item.quantity}</span>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-white/40">No items</p>}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#121212] border-t border-white/5">
        <button onClick={handlePay} className="w-full py-3.5 bg-[#D4AF37] text-[#0c0f0f] font-bold rounded-xl">
          Place Order
        </button>
      </div>
    </div>
  );
}
