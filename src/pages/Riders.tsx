import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Bike, Phone, MapPin, Package } from "lucide-react";
import { ROUTES } from "@/lib/routes";

const INITIAL = [
  { id: 1, name: "Suresh Yadav", phone: "+91-9876543220", status: "available", deliveries: 0, zone: "Sector 62" },
  { id: 2, name: "Meena Devi", phone: "+91-9876543221", status: "on_delivery", deliveries: 2, zone: "DLF Phase 1" },
  { id: 3, name: "Ramesh Kumar", phone: "+91-9876543222", status: "on_delivery", deliveries: 1, zone: "U Block" },
  { id: 4, name: "Anita Sharma", phone: "+91-9876543223", status: "available", deliveries: 0, zone: "Sector 126" },
];

export default function RidersPage() {
  const [riders, setRiders] = useState(INITIAL);

  const assign = (id: number) => {
    setRiders(riders.map((r) => r.id === id && r.status === "available" ? { ...r, status: "on_delivery", deliveries: r.deliveries + 1 } : r));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4">
      <div className="flex items-center gap-3 mb-5">
        <Link to={ROUTES.admin} className="text-white/60"><ArrowLeft size={22} /></Link>
        <Bike size={20} className="text-purple-400" />
        <h1 className="text-base font-semibold">Riders</h1>
        <span className="ml-auto text-xs text-white/40">{riders.filter((r) => r.status === "available").length} available</span>
      </div>

      <div className="space-y-2">
        {riders.map((r) => (
          <div key={r.id} className="card p-3.5 flex items-start gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${r.status === "available" ? "bg-green-500/10" : "bg-purple-500/10"}`}>
              <Bike size={18} className={r.status === "available" ? "text-green-400" : "text-purple-400"} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">{r.name}</p>
                <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-medium ${r.status === "available" ? "bg-green-500/15 text-green-400" : "bg-purple-500/15 text-purple-400"}`}>{r.status === "available" ? "FREE" : "BUSY"}</span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-[10px] text-white/30">
                <span className="flex items-center gap-0.5"><Phone size={8} /> {r.phone}</span>
                <span className="flex items-center gap-0.5"><MapPin size={8} /> {r.zone}</span>
              </div>
              {r.deliveries > 0 && (
                <p className="text-[10px] text-purple-400 mt-1 flex items-center gap-0.5"><Package size={8} /> {r.deliveries} active</p>
              )}
            </div>
            {r.status === "available" && (
              <button onClick={() => assign(r.id)} className="shrink-0 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-lg text-[10px] font-semibold text-green-400">Assign</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
