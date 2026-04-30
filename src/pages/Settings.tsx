import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Settings, User, MapPin, Bell, Shield, Moon, Sun, ChevronRight } from "lucide-react";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [notifOrder, setNotifOrder] = useState(true);
  const [notifOffer, setNotifOffer] = useState(true);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-6">
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-white/60"><ArrowLeft size={22} /></button>
        <Settings size={20} className="text-white/40" />
        <h1 className="text-base font-semibold">Settings</h1>
      </div>

      {/* Account */}
      <div className="px-4 mt-4">
        <h3 className="text-xs font-bold text-white/40 uppercase mb-2">Account</h3>
        <div className="space-y-1">
          <div className="flex items-center gap-3 p-3 card">
            <User size={16} className="text-white/40" />
            <span className="text-sm flex-1">Edit Profile</span>
            <ChevronRight size={14} className="text-white/20" />
          </div>
          <div className="flex items-center gap-3 p-3 card">
            <MapPin size={16} className="text-white/40" />
            <span className="text-sm flex-1">Saved Addresses</span>
            <ChevronRight size={14} className="text-white/20" />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="px-4 mt-5">
        <h3 className="text-xs font-bold text-white/40 uppercase mb-2">Notifications</h3>
        <div className="space-y-1">
          <div className="flex items-center gap-3 p-3 card">
            <Bell size={16} className="text-white/40" />
            <span className="text-sm flex-1">Order Updates</span>
            <button onClick={() => setNotifOrder(!notifOrder)} className={`w-10 h-5 rounded-full transition-colors ${notifOrder ? "bg-[#D4AF37]" : "bg-white/10"}`}>
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${notifOrder ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>
          <div className="flex items-center gap-3 p-3 card">
            <Bell size={16} className="text-white/40" />
            <span className="text-sm flex-1">Offers & Promos</span>
            <button onClick={() => setNotifOffer(!notifOffer)} className={`w-10 h-5 rounded-full transition-colors ${notifOffer ? "bg-[#D4AF37]" : "bg-white/10"}`}>
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${notifOffer ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="px-4 mt-5">
        <h3 className="text-xs font-bold text-white/40 uppercase mb-2">Appearance</h3>
        <div className="flex items-center gap-3 p-3 card">
          {darkMode ? <Moon size={16} className="text-white/40" /> : <Sun size={16} className="text-yellow-400" />}
          <span className="text-sm flex-1">Dark Mode</span>
          <button onClick={() => setDarkMode(!darkMode)} className={`w-10 h-5 rounded-full transition-colors ${darkMode ? "bg-[#D4AF37]" : "bg-white/10"}`}>
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${darkMode ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
        </div>
      </div>

      {/* Privacy */}
      <div className="px-4 mt-5">
        <h3 className="text-xs font-bold text-white/40 uppercase mb-2">Privacy</h3>
        <div className="space-y-1">
          <div className="flex items-center gap-3 p-3 card">
            <Shield size={16} className="text-white/40" />
            <span className="text-sm flex-1">Data & Privacy</span>
            <ChevronRight size={14} className="text-white/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
