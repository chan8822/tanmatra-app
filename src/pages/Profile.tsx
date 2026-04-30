import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, ChevronRight, Crown, Heart, MapPin, CreditCard, Bell, HelpCircle, LogOut, ShieldCheck, Calendar, X } from "lucide-react";
import { ROUTES } from "@/lib/routes";

const sections = [
  { icon: Crown, label: "Tanmatra Gold", sub: "Save up to 20% on every order", route: ROUTES.gold, highlight: true },
  { icon: Heart, label: "Health Profile", sub: "Your nutrition preferences", route: ROUTES.wellness },
  { icon: MapPin, label: "Saved Addresses", sub: "Manage delivery locations" },
  { icon: CreditCard, label: "Payment Methods", sub: "UPI, cards & wallets" },
  { icon: Bell, label: "Notifications", sub: "Order alerts & offers", route: ROUTES.notifications },
  { icon: ShieldCheck, label: "Data & Privacy", sub: "Manage your data" },
  { icon: HelpCircle, label: "Help & Support", sub: "FAQs & chat with us", route: ROUTES.support },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const gold = localStorage.getItem("tanmatra_gold");
  const subscription = localStorage.getItem("tanmatra_subscription");
  const goldData = gold ? JSON.parse(gold) : null;
  const subData = subscription ? JSON.parse(subscription) : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5 px-4 py-3">
        <h1 className="text-base font-semibold">Profile</h1>
      </div>

      <div className="px-4 py-4 flex items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-[#D4AF37]/15 border-2 border-[#D4AF37]/30 flex items-center justify-center">
          <User size={24} className="text-[#D4AF37]" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-semibold">Rahul Sharma</h2>
          <p className="text-xs text-white/40">+91-9876543210 &middot; rahul@email.com</p>
          <div className="flex gap-1.5 mt-1.5">
            {goldData && (
              <span className="text-[9px] px-1.5 py-0.5 bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] rounded-full flex items-center gap-0.5">
                <Crown size={8} /> Gold Active
              </span>
            )}
            {subData && (
              <span className="text-[9px] px-1.5 py-0.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full flex items-center gap-0.5">
                <Calendar size={8} /> {subData.plan}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 space-y-2">
        {sections.map((s) => (
          <button key={s.label}
            onClick={() => s.route ? navigate(s.route) : alert("Coming soon!")}
            className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-colors active:scale-[0.98] ${s.highlight ? "bg-[#D4AF37]/5 border-[#D4AF37]/20" : "bg-[#141414] border-white/5"}`}>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${s.highlight ? "bg-[#D4AF37]/10" : "bg-white/5"}`}>
              <s.icon size={16} className={s.highlight ? "text-[#D4AF37]" : "text-white/40"} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${s.highlight ? "text-[#D4AF37]" : ""}`}>{s.label}</p>
              <p className="text-[10px] text-white/40">{s.sub}</p>
            </div>
            <ChevronRight size={14} className="text-white/20 shrink-0" />
          </button>
        ))}

        <button onClick={() => setShowLogoutConfirm(true)} className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-red-500/20 bg-red-500/5 text-left mt-4 active:scale-[0.98] transition-transform">
          <LogOut size={16} className="text-red-400" />
          <span className="text-sm text-red-400">Log Out</span>
        </button>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[10000] bg-black/80 flex items-center justify-center p-4" onClick={() => setShowLogoutConfirm(false)}>
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-5 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-3">
              <LogOut size={18} className="text-red-400" />
              <h3 className="text-sm font-bold">Log Out?</h3>
            </div>
            <p className="text-xs text-white/50 mb-4">Your cart items and preferences will be saved. You can log back in anytime.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 py-2.5 bg-[#141414] border border-white/10 rounded-xl text-xs font-semibold text-white/60 active:scale-[0.98]">Cancel</button>
              <button onClick={() => { localStorage.clear(); window.location.href = "/#/"; }} className="flex-1 py-2.5 bg-red-500/20 border border-red-500/30 rounded-xl text-xs font-semibold text-red-400 active:scale-[0.98]">Log Out</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
