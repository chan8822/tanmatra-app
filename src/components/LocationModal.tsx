import { useState } from "react";
import {
  X, Search, MapPin, Navigation, Plus, Building2, Home, Dumbbell, Heart, MoreHorizontal
} from "lucide-react";

interface SavedLocation {
  id: string;
  icon: "home" | "office" | "gym";
  label: string;
  address: string;
  zone: string;
  zoneType: "elite" | "wellness";
  phone: string;
  distance: string;
  favorite: boolean;
}

const DEFAULT_LOCATIONS: SavedLocation[] = [
  {
    id: "home",
    icon: "home",
    label: "Home",
    address: "52 U Block, Sector 24, Gurgaon",
    zone: "5km zone",
    zoneType: "elite",
    phone: "+91-9876543210",
    distance: "52 U Block",
    favorite: true,
  },
  {
    id: "office",
    icon: "office",
    label: "Office",
    address: "DLF Phase 3, Sector 26, Gurgaon",
    zone: "10km zone",
    zoneType: "wellness",
    phone: "+91-9876543210",
    distance: "378 m",
    favorite: false,
  },
  {
    id: "gym",
    icon: "gym",
    label: "Gym",
    address: "Near Phoenix Mall, Sector 27, Gurgaon",
    zone: "5km zone",
    zoneType: "elite",
    phone: "+91-9876543210",
    distance: "1.2 km",
    favorite: false,
  },
];

function getIcon(type: SavedLocation["icon"]) {
  switch (type) {
    case "home": return <Home size={16} className="text-white" />;
    case "office": return <Building2 size={16} className="text-white" />;
    case "gym": return <Dumbbell size={16} className="text-white" />;
    default: return <MapPin size={16} className="text-white" />;
  }
}

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (loc: SavedLocation) => void;
}

export function LocationModal({ isOpen, onClose, onSelect }: LocationModalProps) {
  const [search, setSearch] = useState("");
  const [locations, setLocations] = useState<SavedLocation[]>(DEFAULT_LOCATIONS);

  if (!isOpen) return null;

  const toggleFav = (id: string) => {
    setLocations((prev) =>
      prev.map((l) => (l.id === id ? { ...l, favorite: !l.favorite } : l))
    );
  };

  const filtered = search
    ? locations.filter(
        (l) =>
          l.label.toLowerCase().includes(search.toLowerCase()) ||
          l.address.toLowerCase().includes(search.toLowerCase())
      )
    : locations;

  return (
    <div className="fixed inset-0 z-[200] bg-[var(--bg-primary)] flex flex-col fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <X size={20} className="text-white/40 cursor-pointer" onClick={onClose} />
          <h1 className="text-sm font-semibold text-[#D4AF37]">Select your delivery zone</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Search */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 bg-[var(--bg-secondary)] border border-white/10 rounded-lg px-3 py-2.5">
            <Search size={16} className="text-white/30 shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search area, street name..."
              className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30"
              autoFocus
            />
          </div>
        </div>

        {/* Use current location */}
        <div className="px-4">
          <button className="w-full flex items-start gap-3 p-3 bg-[var(--bg-secondary)] border border-red-500/10 rounded-xl text-left">
            <div className="w-9 h-9 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
              <Navigation size={16} className="text-[#FF6B6B]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">Use current location</p>
              <p className="text-xs text-white/40 truncate">Sector 62, Noida - Elite Zone</p>
              <p className="text-[10px] text-white/30">2.1 km away</p>
            </div>
            <span className="text-white/20">&rsaquo;</span>
          </button>
        </div>

        {/* Add Address */}
        <div className="px-4 mt-2">
          <button className="w-full flex items-center gap-3 p-3 bg-[var(--bg-secondary)] border border-[#D4AF37]/20 rounded-xl text-left">
            <div className="w-9 h-9 rounded-full bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
              <Plus size={16} className="text-[#D4AF37]" />
            </div>
            <span className="text-sm font-semibold text-white">Add Address</span>
            <span className="ml-auto text-white/20">&rsaquo;</span>
          </button>
        </div>

        {/* Saved Locations */}
        <div className="px-4 mt-6">
          <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-3">Saved Locations</p>
          <div className="space-y-2.5">
            {filtered.map((loc) => (
              <button
                key={loc.id}
                onClick={() => { onSelect(loc); onClose(); }}
                className="w-full flex items-start gap-3 p-3 bg-[var(--bg-secondary)] border border-white/5 rounded-xl text-left"
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                  loc.zoneType === "elite" ? "bg-[#D4AF37]/20" : "bg-green-500/10"
                }`}>
                  {getIcon(loc.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">{loc.label} <span className="text-white/40 font-normal">{loc.distance}</span></p>
                  </div>
                  <p className="text-xs text-white/50 mt-0.5 truncate">{loc.address}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      loc.zoneType === "elite"
                        ? "bg-[#D4AF37]/10 text-[#D4AF37]"
                        : "bg-green-500/10 text-green-400"
                    }`}>{loc.zone}</span>
                    <span className="text-[10px] text-white/30">{loc.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); }}
                      className="text-white/30"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFav(loc.id); }}
                      className={loc.favorite ? "text-[#D4AF37]" : "text-white/20"}
                    >
                      <Heart size={14} className={loc.favorite ? "fill-[#D4AF37]" : ""} />
                    </button>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <MapPin size={40} className="text-white/10 mb-3" />
            <p className="text-sm text-white/40">No locations found</p>
            <p className="text-xs text-white/20 mt-1">Try a different search</p>
          </div>
        )}
      </div>
    </div>
  );
}
