import { useNavigate } from "react-router-dom";
import {
  ChevronLeft, ChevronRight, Crown, Wallet, Ticket, Leaf, Eye, Moon,
  CreditCard, ShoppingBag, MapPin, Bookmark, Settings, HelpCircle,
  MessageSquare, Gift, Heart, LogOut
} from "lucide-react";

interface MenuItem {
  icon: any;
  label: string;
  to?: string;
  badge?: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const menuSections: MenuSection[] = [
  {
    title: "Food Delivery",
    items: [
      { icon: ShoppingBag, label: "Your orders", to: "/orders" },
      { icon: MapPin, label: "Address book", to: "/address" },
      { icon: Bookmark, label: "Your collections" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { icon: Leaf, label: "Veg Mode", badge: "Off" },
      { icon: Eye, label: "Show personalised ratings" },
      { icon: Moon, label: "Appearance", badge: "Dark" },
      { icon: CreditCard, label: "Payment methods" },
    ],
  },
  {
    title: "More",
    items: [
      { icon: MessageSquare, label: "Online ordering help", to: "/support" },
      { icon: Settings, label: "Settings", to: "/settings" },
      { icon: HelpCircle, label: "Your feedback" },
    ],
  },
];

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#121212] text-white fade-in pb-6">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#121212] border-b border-white/5 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate("/")} className="text-white/60"><ChevronLeft size={22} /></button>
        <h1 className="text-base font-semibold">Profile</h1>
      </div>

      {/* Profile Card */}
      <div className="relative mx-4 mt-4 p-4 rounded-2xl bg-gradient-to-br from-[#2a2520] to-[#1a1c1c] border border-[#D4AF37]/20 overflow-hidden">
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#0c0f0f] text-xl font-bold border-2 border-[#D4AF37]/50">
            T
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold">Tanmatra Member</h2>
            <p className="text-xs text-white/40">member@tanmatra.com</p>
          </div>
        </div>

        {/* Gold Member Badge */}
        <button
          onClick={() => navigate("/gold")}
          className="mt-4 flex items-center justify-between w-full p-3 bg-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/20"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#D4AF37] flex items-center justify-center">
              <Crown size={14} className="text-[#0c0f0f]" />
            </div>
            <span className="text-sm font-semibold text-[#D4AF37]">Gold member</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded-full">saved &#8377;2,450</span>
            <ChevronRight size={14} className="text-[#D4AF37]" />
          </div>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mx-4 mt-3">
        <div className="p-3 bg-[#1a1c1c] border border-white/5 rounded-xl flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
            <Wallet size={16} />
          </div>
          <div>
            <p className="text-[10px] text-white/40">Tanmatra Money</p>
            <p className="text-sm font-bold">&#8377;0</p>
          </div>
        </div>
        <div className="p-3 bg-[#1a1c1c] border border-white/5 rounded-xl flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400">
            <Ticket size={16} />
          </div>
          <div>
            <p className="text-[10px] text-white/40">Your coupons</p>
            <p className="text-sm font-bold text-green-400">3 new</p>
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      {menuSections.map((section) => (
        <div key={section.title} className="mx-4 mt-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-4 bg-red-500 rounded-full" />
            <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider">{section.title}</h3>
          </div>
          <div className="bg-[#1a1c1c] border border-white/5 rounded-xl overflow-hidden">
            {section.items.map((item, i) => (
              <button
                key={item.label}
                onClick={() => item.to && navigate(item.to)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-white/5 ${
                  i < section.items.length - 1 ? "border-b border-white/5" : ""
                }`}
              >
                <item.icon size={18} className="text-white/40" />
                <span className="flex-1 text-sm">{item.label}</span>
                {item.badge && <span className="text-xs text-white/40">{item.badge}</span>}
                <ChevronRight size={14} className="text-white/20" />
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Referral Promo */}
      <div className="mx-4 mt-4 p-4 bg-[#1a1c1c] border border-white/5 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
            <Gift size={18} className="text-[#D4AF37]" />
          </div>
          <div>
            <p className="text-sm font-semibold">Invite friends to Tanmatra</p>
            <p className="text-xs text-white/40 mt-1 leading-relaxed">Get &#8377;200 gift coupons every time your friends complete their first order</p>
          </div>
        </div>
      </div>

      {/* Social Impact */}
      <div className="mx-4 mt-4 p-4 bg-gradient-to-r from-green-900/20 to-[#1a1c1c] border border-green-500/10 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <Heart size={14} className="text-green-400 fill-green-400" />
          <span className="text-xs font-semibold text-green-400">Feeding Noida</span>
        </div>
        <p className="text-xs text-white/40">12 meals donated, and counting! Every order helps feed someone in need.</p>
      </div>

      {/* Sign Out */}
      <div className="mx-4 mt-6">
        <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-500/20 text-red-400 text-sm">
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );
}
