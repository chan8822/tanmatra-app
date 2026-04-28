import { useState } from "react";
import {
  ArrowUpDown, Clock, Star, Tag, IndianRupee, ShieldCheck, LayoutGrid,
  X, Check
} from "lucide-react";

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
}

const navItems = [
  { id: "sort", label: "Sort By", icon: ArrowUpDown },
  { id: "time", label: "Time", icon: Clock },
  { id: "rating", label: "Rating", icon: Star },
  { id: "offers", label: "Offers", icon: Tag },
  { id: "price", label: "Dish Price", icon: IndianRupee },
  { id: "trust", label: "Trust Markers", icon: ShieldCheck },
  { id: "collections", label: "Collections", icon: LayoutGrid },
];

const sortOptions = ["Relevance", "Rating: High to Low", "Delivery Time", "Price: Low to High", "Price: High to Low"];
const ratingOptions = [
  { label: "Rated 3.5+", value: 3.5 },
  { label: "Rated 4.0+", value: 4.0 },
];
const offerOptions = ["Buy 1 Get 1", "Deals of the Day", "Gold Offers"];
const priceOptions = [
  { label: "Under ₹200", count: 1 },
  { label: "₹200 - ₹350", count: 2 },
  { label: "Above ₹350", count: 3 },
];
const trustOptions = [
  { label: "Pure Veg", icon: "\uD83E\udd66" },
  { label: "Loved by friends", icon: "\uD83E\udd1d" },
  { label: "No Packaging charges", icon: "\uD83D\uDECD\uFE0F" },
  { label: "Low plastic packaging", icon: "\u267B\uFE0F" },
  { label: "RD-Verified", icon: "\uD83D\uDC8A" },
];
const collectionOptions = ["Previously ordered", "Gourmet", "Healthy Pick", "High Protein"];

export function FilterSheet({ isOpen, onClose, onApply }: FilterSheetProps) {
  const [activeTab, setActiveTab] = useState("sort");
  const [sortBy, setSortBy] = useState("Relevance");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedOffers, setSelectedOffers] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [selectedTrust, setSelectedTrust] = useState<string[]>([]);

  if (!isOpen) return null;

  const toggleOffer = (o: string) => setSelectedOffers((p) => p.includes(o) ? p.filter((x) => x !== o) : [...p, o]);
  const toggleTrust = (t: string) => setSelectedTrust((p) => p.includes(t) ? p.filter((x) => x !== t) : [...p, t]);

  const handleApply = () => {
    onApply({ sortBy, selectedRating, selectedOffers, selectedPrice, selectedTrust });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#1a1a1c]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <h2 className="text-base font-semibold text-white">Filters and sorting</h2>
        <button onClick={onClose} className="text-white/60"><X size={20} /></button>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Nav */}
        <div className="w-24 bg-[#0c0f0f] border-r border-white/10 flex flex-col">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 py-3 px-2 text-[10px] transition-colors ${
                  isActive ? "text-[#D4AF37] bg-[#D4AF37]/10 border-l-2 border-[#D4AF37]" : "text-white/40 border-l-2 border-transparent"
                }`}
              >
                <item.icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                <span className="text-center leading-tight">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Panel */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Sort By */}
          {activeTab === "sort" && (
            <div className="space-y-2">
              <p className="text-xs text-white/40 mb-3">Sort by</p>
              {sortOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSortBy(opt)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-colors ${
                    sortBy === opt ? "bg-[#D4AF37]/10 border-[#D4AF37]/40 text-[#D4AF37]" : "bg-transparent border-white/10 text-white"
                  }`}
                >
                  {opt}
                  {sortBy === opt && <Check size={16} />}
                </button>
              ))}
            </div>
          )}

          {/* Time */}
          {activeTab === "time" && (
            <div>
              <p className="text-xs text-white/40 mb-3">Schedule</p>
              <button className="w-full flex flex-col items-center gap-2 p-6 rounded-xl border border-white/10 bg-[var(--bg-secondary)] text-white">
                <Clock size={28} className="text-[#D4AF37]" />
                <span className="text-sm">Schedule for later</span>
                <span className="text-[10px] text-white/40">Choose a delivery time</span>
              </button>
            </div>
          )}

          {/* Rating */}
          {activeTab === "rating" && (
            <div>
              <p className="text-xs text-white/40 mb-3">Restaurant Rating</p>
              <div className="grid grid-cols-2 gap-3">
                {ratingOptions.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setSelectedRating(selectedRating === r.value ? null : r.value)}
                    className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border transition-colors ${
                      selectedRating === r.value ? "bg-[#D4AF37]/10 border-[#D4AF37]/40" : "border-white/10 bg-[var(--bg-secondary)]"
                    }`}
                  >
                    <Star size={20} className={selectedRating === r.value ? "text-[#D4AF37] fill-[#D4AF37]" : "text-green-500 fill-green-500"} />
                    <span className="text-sm text-white">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Offers */}
          {activeTab === "offers" && (
            <div>
              <p className="text-xs text-white/40 mb-3">Offers</p>
              <div className="flex flex-wrap gap-2">
                {offerOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => toggleOffer(opt)}
                    className={`px-4 py-2.5 rounded-full border text-sm transition-colors ${
                      selectedOffers.includes(opt) ? "bg-[#D4AF37]/10 border-[#D4AF37]/40 text-[#D4AF37]" : "border-white/10 text-white bg-[var(--bg-secondary)]"
                    }`}
                  >
                    {opt === "Gold Offers" && <span className="mr-1">\uD83D\uDC51</span>}
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Dish Price */}
          {activeTab === "price" && (
            <div>
              <p className="text-xs text-white/40 mb-3">Dish Price</p>
              <div className="grid grid-cols-3 gap-3">
                {priceOptions.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => setSelectedPrice(selectedPrice === p.label ? null : p.label)}
                    className={`flex flex-col items-center gap-1 p-4 rounded-xl border transition-colors ${
                      selectedPrice === p.label ? "bg-[#D4AF37]/10 border-[#D4AF37]/40" : "border-white/10 bg-[var(--bg-secondary)]"
                    }`}
                  >
                    <span className="text-green-400 text-lg">{Array(p.count).fill("₹").join("")}</span>
                    <span className="text-xs text-white text-center">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trust Markers */}
          {activeTab === "trust" && (
            <div>
              <p className="text-xs text-white/40 mb-3">Trust Markers</p>
              <div className="grid grid-cols-2 gap-3">
                {trustOptions.map((t) => (
                  <button
                    key={t.label}
                    onClick={() => toggleTrust(t.label)}
                    className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border transition-colors ${
                      selectedTrust.includes(t.label) ? "bg-[#D4AF37]/10 border-[#D4AF37]/40" : "border-white/10 bg-[var(--bg-secondary)]"
                    }`}
                  >
                    <span className="text-xl">{t.icon}</span>
                    <span className="text-xs text-white text-center">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Collections */}
          {activeTab === "collections" && (
            <div>
              <p className="text-xs text-white/40 mb-3">Collections</p>
              <div className="flex flex-wrap gap-2">
                {collectionOptions.map((c) => (
                  <button key={c} className="px-4 py-2.5 rounded-full border border-white/10 text-sm text-white bg-[var(--bg-secondary)]">
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 px-4 py-3 border-t border-white/10 bg-[#0c0f0f]">
        <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/10 text-sm text-white/60">
          Close
        </button>
        <button onClick={handleApply} className="flex-1 py-3 rounded-xl bg-[#D4AF37] text-sm text-[#0c0f0f] font-semibold">
          Show results
        </button>
      </div>
    </div>
  );
}
