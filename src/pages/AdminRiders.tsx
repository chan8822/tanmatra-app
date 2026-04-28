import { useState } from "react";
import { Bike, MapPin, Phone, Star, Navigation, CheckCircle } from "lucide-react";

interface Rider {
  id: number;
  name: string;
  phone: string;
  zone: string;
  rating: number;
  status: "online" | "offline" | "on-delivery";
  eta: string;
  deliveries: number;
  bike: string;
}

const initialRiders: Rider[] = [
  { id: 1, name: "Vikram D.", phone: "98765 43213", zone: "Sector 62", rating: 4.7, status: "on-delivery", eta: "12 min", deliveries: 142, bike: "UP16 GH 3456" },
  { id: 2, name: "Ramesh K.", phone: "98765 43214", zone: "Sector 63", rating: 4.5, status: "online", eta: "—", deliveries: 98, bike: "UP16 AB 7821" },
  { id: 3, name: "Suresh P.", phone: "98765 43215", zone: "Sector 15", rating: 4.9, status: "online", eta: "—", deliveries: 203, bike: "UP16 CD 1234" },
  { id: 4, name: "Ajay M.", phone: "98765 43216", zone: "Sector 18", rating: 4.3, status: "offline", eta: "—", deliveries: 67, bike: "UP16 EF 5678" },
];

export default function AdminRidersPage() {
  const [riders] = useState<Rider[]>(initialRiders);
  const [selectedZone, setSelectedZone] = useState("All");
  const zones = ["All", "Sector 62", "Sector 63", "Sector 15", "Sector 18", "Sector 50"];

  const filtered = selectedZone === "All" ? riders : riders.filter((r) => r.zone === selectedZone);
  const onlineCount = riders.filter((r) => r.status === "online").length;
  const deliveringCount = riders.filter((r) => r.status === "on-delivery").length;

  const statusColors: Record<string, string> = {
    online: "bg-green-500/15 text-green-400 border-green-500/20",
    offline: "bg-white/5 text-white/30 border-white/10",
    "on-delivery": "bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/20",
  };

  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-3 text-center">
          <div className="text-lg font-bold text-[#D4AF37]">{riders.length}</div>
          <div className="text-[10px] text-white/40">Total Riders</div>
        </div>
        <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-3 text-center">
          <div className="text-lg font-bold text-green-400">{onlineCount}</div>
          <div className="text-[10px] text-white/40">Online</div>
        </div>
        <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-3 text-center">
          <div className="text-lg font-bold text-[#D4AF37]">{deliveringCount}</div>
          <div className="text-[10px] text-white/40">Delivering</div>
        </div>
      </div>

      {/* Zone Filter */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {zones.map((z) => (
          <button key={z} onClick={() => setSelectedZone(z)} className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] border ${selectedZone === z ? "bg-[#D4AF37] text-[#0c0f0f] border-[#D4AF37]" : "bg-[#1a1c1c] text-white/50 border-white/10"}`}>{z}</button>
        ))}
      </div>

      {/* Riders */}
      <div className="space-y-2">
        {filtered.map((r) => (
          <div key={r.id} className="bg-[#1a1c1c] border border-white/5 rounded-xl p-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                  <Bike size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-semibold text-white">{r.name}</h4>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${statusColors[r.status]}`}>{r.status.replace("-", " ")}</span>
                  </div>
                  <p className="text-[10px] text-white/40 flex items-center gap-1"><MapPin size={8} /> {r.zone} · {r.bike}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-0.5 text-[10px] text-[#D4AF37]"><Star size={10} /> {r.rating}</div>
                {r.status === "on-delivery" && <p className="text-[10px] text-[#D4AF37] mt-0.5">ETA {r.eta}</p>}
              </div>
            </div>
            <div className="flex items-center gap-4 mt-2 text-[10px] text-white/30">
              <span className="flex items-center gap-1"><Phone size={8} /> {r.phone}</span>
              <span className="flex items-center gap-1"><CheckCircle size={8} /> {r.deliveries} deliveries</span>
              <span className="flex items-center gap-1"><Navigation size={8} /> {Math.floor(Math.random() * 5) + 1} km away</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
