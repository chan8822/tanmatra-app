import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Search, ChevronLeft, Navigation, Plus, Home, Briefcase, Building2 } from "lucide-react";

interface SavedAddress {
  id: number;
  label: string;
  address: string;
  phone: string;
  distance: string;
  icon: string;
}

const initialAddresses: SavedAddress[] = [
  { id: 1, label: "u block", address: "A-42, Tower 4, U Block, Sector 62, Noida, UP 201301", phone: "+91 98765 43210", distance: "0.8 km", icon: "home" },
  { id: 2, label: "Hotel Crystal", address: "Plot 15, Sector 18 Market, Noida, UP 201301", phone: "+91 98765 43210", distance: "3.2 km", icon: "building" },
  { id: 3, label: "Work", address: "Floor 7, Unitech Cyber Park, Sector 39, Gurgaon, HR 122001", phone: "+91 98765 43210", distance: "18 km", icon: "briefcase" },
];

export default function AddressSelector() {
  const navigate = useNavigate();
  const [addresses] = useState<SavedAddress[]>(initialAddresses);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selectAddress = (addr: SavedAddress) => {
    localStorage.setItem("tanmatra_selected_address", JSON.stringify(addr));
    setSelectedId(addr.id);
    setTimeout(() => navigate("/"), 300);
  };

  const iconMap: Record<string, any> = {
    home: <Home size={16} />,
    building: <Building2 size={16} />,
    briefcase: <Briefcase size={16} />,
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] fade-in">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[var(--bg-primary)] border-b border-white/5 px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="p-1 text-white/60">
            <ChevronLeft size={22} />
          </button>
          <h1 className="text-base font-semibold text-white">Select a location</h1>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 bg-[var(--bg-secondary)] border border-white/10 rounded-lg px-3 py-2.5">
          <Search size={16} className="text-white/30 shrink-0" />
          <input
            placeholder="Search for area, street name..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
          />
        </div>
      </div>

      {/* Use Current Location */}
      <div className="px-4 pb-3">
        <button className="w-full flex items-center gap-3 p-3 bg-[var(--bg-secondary)] border border-[#D4AF37]/20 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
            <Navigation size={16} />
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-[#D4AF37]">Use current location</p>
            <p className="text-[10px] text-white/40">A-42, U Block, Sector 62, Noida</p>
          </div>
        </button>
      </div>

      {/* Add Address */}
      <div className="px-4 pb-4">
        <button className="w-full flex items-center gap-2 py-2.5 border border-dashed border-white/15 rounded-lg text-xs text-white/50 justify-center">
          <Plus size={14} /> Add Address
        </button>
      </div>

      {/* Saved Addresses */}
      <div className="px-4">
        <p className="text-[10px] uppercase tracking-wider text-white/30 font-semibold mb-3">Saved Addresses</p>
        <div className="space-y-3">
          {addresses.map((addr) => (
            <button
              key={addr.id}
              onClick={() => selectAddress(addr)}
              className={`w-full text-left p-3 rounded-xl border flex items-start gap-3 transition-colors ${
                selectedId === addr.id ? "bg-[#D4AF37]/10 border-[#D4AF37]/40" : "bg-[var(--bg-secondary)] border-white/5"
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0 mt-0.5">
                {iconMap[addr.icon] || <MapPin size={16} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white">{addr.label}</h3>
                  <span className="text-[9px] text-white/30">{addr.distance}</span>
                </div>
                <p className="text-[10px] text-white/40 mt-0.5 leading-relaxed">{addr.address}</p>
                <p className="text-[10px] text-white/30 mt-0.5">{addr.phone}</p>
              </div>
              {selectedId === addr.id && (
                <div className="w-5 h-5 rounded-full bg-[#D4AF37] flex items-center justify-center shrink-0">
                  <span className="text-[#0c0f0f] text-xs font-bold">✓</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
