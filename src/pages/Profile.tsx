import { useNavigate } from "react-router-dom";
import { User, ChevronRight, Crown, Heart, MapPin, CreditCard, Bell, HelpCircle, LogOut, ShieldCheck } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5 px-4 py-3">
        <h1 className="text-base font-semibold">Profile</h1>
      </div>

      <div className="px-4 py-4 flex items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-[#D4AF37]/15 border-2 border-[#D4AF37]/30 flex items-center justify-center">
          <User size={24} className="text-[#D4AF37]" />
        </div>
        <div>
          <h2 className="text-base font-semibold">Rahul Sharma</h2>
          <p className="text-xs text-white/40">+91-9876543210 &middot; rahul@email.com</p>
        </div>
      </div>

      <div className="px-4 space-y-2">
        {sections.map((s) => (
          <button key={s.label} onClick={() => s.route ? navigate(s.route) : null}
            className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-colors ${s.highlight ? "bg-[#D4AF37]/5 border-[#D4AF37]/20" : "bg-[#141414] border-white/5"}`}>
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

        <button onClick={() => navigate(ROUTES.home)} className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-red-500/20 bg-red-500/5 text-left mt-4">
          <LogOut size={16} className="text-red-400" />
          <span className="text-sm text-red-400">Log Out</span>
        </button>
      </div>
    </div>
  );
}
