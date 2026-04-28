import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { X, Search, Clock, Flame, Dumbbell, Heart as HeartIcon, Sparkles, Apple } from "lucide-react";

const RECENT_SEARCHES = ["High-Protein", "Salad", "Quick meals", "Paneer"];
const POPULAR_SEGMENTS = [
  { label: "Athlete", icon: Dumbbell, color: "text-orange-400", bg: "bg-orange-400/10" },
  { label: "Senior", icon: HeartIcon, color: "text-purple-400", bg: "bg-purple-400/10" },
  { label: "Wellness", icon: Sparkles, color: "text-blue-400", bg: "bg-blue-400/10" },
  { label: "Everyday", icon: Apple, color: "text-green-400", bg: "bg-green-400/10" },
];
const TRENDING = ["Protein Bowl", "Keto Friendly", "Post Workout", "Family Thali", "Detox Smoothie"];

const ALL_DISHES = [
  { id: "hm3", name: "Grilled Chicken + Veggies", tags: ["High-Protein", "Athlete"], price: 299 },
  { id: "sa1", name: "Grilled Paneer Salad", tags: ["Wellness", "RD Verified"], price: 200 },
  { id: "w1", name: "Paneer Tikka Wrap", tags: ["Quick", "Everyday"], price: 160 },
  { id: "s1", name: "Hot & Sour Soup", tags: ["Quick", "Wellness"], price: 80 },
  { id: "p1", name: "Creamy Alfredo Pasta", tags: ["Comfort", "Everyday"], price: 180 },
  { id: "bb1", name: "Paneer Rice Bowl", tags: ["High-Protein", "Athlete"], price: 249 },
  { id: "o4", name: "Mushroom Spinach Omelette", tags: ["Breakfast", "Wellness"], price: 129 },
  { id: "b1", name: "English Breakfast", tags: ["Weekend", "Family"], price: 220 },
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return ALL_DISHES.filter(
      (d) => d.name.toLowerCase().includes(q) || d.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-[var(--bg-primary)] flex flex-col fade-in">
      {/* Header with search */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
        <div className="flex-1 flex items-center gap-2 bg-[var(--bg-secondary)] border border-white/10 rounded-lg px-3 py-2.5">
          <Search size={16} className="text-white/30 shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dishes, segments, nutrition..."
            className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-white/30">
              <X size={14} />
            </button>
          )}
        </div>
        <button onClick={onClose} className="text-[11px] text-white/60 font-medium">Cancel</button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Search Results */}
        {query.trim() ? (
          <div className="px-4 py-3">
            <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-3">
              {results.length} RESULTS FOR &quot;{query}&quot;
            </p>
            {results.length === 0 ? (
              <div className="flex flex-col items-center py-8">
                <Search size={32} className="text-white/10 mb-2" />
                <p className="text-sm text-white/40">No results found</p>
                <p className="text-xs text-white/20">Try different keywords</p>
              </div>
            ) : (
              <div className="space-y-2">
                {results.map((dish) => (
                  <button
                    key={dish.id}
                    onClick={() => { navigate(`/dish/${dish.id}`); onClose(); }}
                    className="w-full flex items-center gap-3 p-3 bg-[var(--bg-secondary)] border border-white/5 rounded-xl text-left"
                  >
                    <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] text-lg font-bold shrink-0">
                      {dish.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{dish.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {dish.tags.map((t) => (
                          <span key={t} className="text-[9px] px-1.5 py-0.5 bg-white/5 rounded text-white/40">{t}</span>
                        ))}
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[#D4AF37]">₹{dish.price}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Recent Searches */}
            <div className="px-4 py-3">
              <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-3">Recent Searches</p>
              <div className="flex flex-wrap gap-2">
                {RECENT_SEARCHES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-[var(--bg-secondary)] border border-white/5 rounded-full text-xs text-white/60"
                  >
                    <Clock size={12} className="text-white/30" /> {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Segments */}
            <div className="px-4 py-3">
              <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-3">Popular Segments</p>
              <div className="grid grid-cols-4 gap-3">
                {POPULAR_SEGMENTS.map((seg) => (
                  <button
                    key={seg.label}
                    onClick={() => setQuery(seg.label)}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border border-white/5 ${seg.bg}`}
                  >
                    <seg.icon size={18} className={seg.color} />
                    <span className="text-[10px] font-medium text-white/60">{seg.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Trending */}
            <div className="px-4 py-3">
              <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-3">Trending Now</p>
              <div className="space-y-1">
                {TRENDING.map((t, i) => (
                  <button
                    key={t}
                    onClick={() => setQuery(t)}
                    className="w-full flex items-center gap-3 py-2.5 text-left"
                  >
                    <span className="text-xs font-bold text-[#D4AF37]">{String(i + 1).padStart(2, "0")}</span>
                    <Flame size={14} className="text-orange-400" />
                    <span className="text-sm text-white/60">{t}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
