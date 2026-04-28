import { useState } from "react";
import { Settings, MapPin, Clock, DollarSign, Save, CheckCircle } from "lucide-react";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    businessName: "Tanmatra Kitchen",
    phone: "+91 98765 43210",
    address: "A-42, Sector 62, Noida, UP 201301",
    openTime: "07:00",
    closeTime: "23:00",
    deliveryRadius: "5",
    baseDeliveryFee: "49",
    freeDeliveryThreshold: "500",
    platformFeePercent: "5",
    gstPercent: "5",
    zones: ["Sector 62", "Sector 63", "Sector 15", "Sector 18", "Sector 50", "Indirapuram"],
  });

  const save = () => {
    localStorage.setItem("tanmatra_settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4">
      {saved && (
        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2 text-green-400 text-xs">
          <CheckCircle size={14} /> Settings saved successfully
        </div>
      )}

      {/* Business Info */}
      <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4 space-y-3">
        <h3 className="text-xs font-semibold text-white flex items-center gap-2"><Settings size={14} className="text-[#D4AF37]" /> Business Info</h3>
        <div>
          <label className="text-[10px] text-white/40 block mb-1">Business Name</label>
          <input value={settings.businessName} onChange={(e) => setSettings({ ...settings, businessName: e.target.value })} className="w-full px-3 py-2 bg-[#0c0f0f] border border-white/10 rounded-lg text-sm text-white" />
        </div>
        <div>
          <label className="text-[10px] text-white/40 block mb-1">Phone</label>
          <input value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} className="w-full px-3 py-2 bg-[#0c0f0f] border border-white/10 rounded-lg text-sm text-white" />
        </div>
        <div>
          <label className="text-[10px] text-white/40 block mb-1">Address</label>
          <textarea value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} className="w-full px-3 py-2 bg-[#0c0f0f] border border-white/10 rounded-lg text-sm text-white resize-none h-16" />
        </div>
      </div>

      {/* Operating Hours */}
      <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4 space-y-3">
        <h3 className="text-xs font-semibold text-white flex items-center gap-2"><Clock size={14} className="text-[#D4AF37]" /> Operating Hours</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] text-white/40 block mb-1">Opens</label>
            <input type="time" value={settings.openTime} onChange={(e) => setSettings({ ...settings, openTime: e.target.value })} className="w-full px-3 py-2 bg-[#0c0f0f] border border-white/10 rounded-lg text-sm text-white" />
          </div>
          <div>
            <label className="text-[10px] text-white/40 block mb-1">Closes</label>
            <input type="time" value={settings.closeTime} onChange={(e) => setSettings({ ...settings, closeTime: e.target.value })} className="w-full px-3 py-2 bg-[#0c0f0f] border border-white/10 rounded-lg text-sm text-white" />
          </div>
        </div>
      </div>

      {/* Delivery Settings */}
      <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4 space-y-3">
        <h3 className="text-xs font-semibold text-white flex items-center gap-2"><MapPin size={14} className="text-[#D4AF37]" /> Delivery Settings</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] text-white/40 block mb-1">Delivery Radius (km)</label>
            <input type="number" value={settings.deliveryRadius} onChange={(e) => setSettings({ ...settings, deliveryRadius: e.target.value })} className="w-full px-3 py-2 bg-[#0c0f0f] border border-white/10 rounded-lg text-sm text-white" />
          </div>
          <div>
            <label className="text-[10px] text-white/40 block mb-1">Base Delivery Fee (₹)</label>
            <input type="number" value={settings.baseDeliveryFee} onChange={(e) => setSettings({ ...settings, baseDeliveryFee: e.target.value })} className="w-full px-3 py-2 bg-[#0c0f0f] border border-white/10 rounded-lg text-sm text-white" />
          </div>
          <div>
            <label className="text-[10px] text-white/40 block mb-1">Free Delivery Above (₹)</label>
            <input type="number" value={settings.freeDeliveryThreshold} onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: e.target.value })} className="w-full px-3 py-2 bg-[#0c0f0f] border border-white/10 rounded-lg text-sm text-white" />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4 space-y-3">
        <h3 className="text-xs font-semibold text-white flex items-center gap-2"><DollarSign size={14} className="text-[#D4AF37]" /> Pricing</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] text-white/40 block mb-1">Platform Fee (%)</label>
            <input type="number" value={settings.platformFeePercent} onChange={(e) => setSettings({ ...settings, platformFeePercent: e.target.value })} className="w-full px-3 py-2 bg-[#0c0f0f] border border-white/10 rounded-lg text-sm text-white" />
          </div>
          <div>
            <label className="text-[10px] text-white/40 block mb-1">GST (%)</label>
            <input type="number" value={settings.gstPercent} onChange={(e) => setSettings({ ...settings, gstPercent: e.target.value })} className="w-full px-3 py-2 bg-[#0c0f0f] border border-white/10 rounded-lg text-sm text-white" />
          </div>
        </div>
      </div>

      {/* Delivery Zones */}
      <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4 space-y-2">
        <h3 className="text-xs font-semibold text-white flex items-center gap-2"><MapPin size={14} className="text-[#D4AF37]" /> Delivery Zones</h3>
        <div className="flex flex-wrap gap-2">
          {settings.zones.map((z) => (
            <span key={z} className="text-[10px] px-2 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20">{z}</span>
          ))}
        </div>
      </div>

      <button onClick={save} className="w-full py-3 bg-[#D4AF37] text-[#0c0f0f] rounded-xl text-sm font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
        <Save size={16} /> Save Settings
      </button>
    </div>
  );
}
