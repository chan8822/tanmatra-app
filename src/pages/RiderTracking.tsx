import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { API } from "@/lib/api";
import { MapPin, Phone, Clock, Bike, Star, MessageSquare, Navigation, Shield } from "lucide-react";

export default function RiderTrackingPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order") || "TAN-1001";
  const [tracking, setTracking] = useState<any>(null);
  const [elapsed, setElapsed] = useState(0);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    API.tracking(orderId).then(setTracking);
    // Simulate live updates
    const timer = setInterval(() => {
      setElapsed((e) => e + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [orderId]);

  useEffect(() => {
    // Simulated rider messages
    const msgs = [
      "Picked up your order from the kitchen",
      "Heading to Sector 62 via main road",
      "Traffic is light, should arrive on time",
      "Reached your sector, looking for Tower 4",
    ];
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < msgs.length) {
        setMessages((prev) => [...prev, msgs[idx]]);
        idx++;
      }
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  if (!tracking) return <div className="text-center py-20 text-white/40">Loading tracking...</div>;

  const eta = Math.max(0, (tracking.eta_minutes || 18) - Math.floor(elapsed / 60));
  const progress = Math.min(100, (elapsed / ((tracking.eta_minutes || 18) * 60)) * 100);

  return (
    <div className="fade-in pb-10">
      <Header title="Live Tracking" backTo="/orders" />

      {/* Map Area (simulated) */}
      <div className="h-56 bg-gradient-to-br from-[#1a1c1c] to-[#0c0f0f] relative overflow-hidden">
        {/* Simulated road grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full" style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 39px, #333 39px, #333 40px),
                             repeating-linear-gradient(90deg, transparent, transparent 39px, #333 39px, #333 40px)`,
          }} />
        </div>
        {/* Route line */}
        <svg className="absolute inset-0 w-full h-full">
          <path d="M 50 200 Q 150 180 200 120 T 350 80" stroke="#D4AF37" strokeWidth="3" fill="none" strokeDasharray="6 4" className="animate-pulse" />
          {/* Rider dot */}
          <circle cx={50 + (progress * 3)} cy={200 - (progress * 1.2)} r="8" fill="#D4AF37" />
          {/* Destination */}
          <circle cx="350" cy="80" r="6" fill="#22c55e" />
        </svg>
        {/* Labels */}
        <div className="absolute bottom-3 left-3 bg-[#0c0f0f]/80 backdrop-blur px-2 py-1 rounded text-[10px] text-white/70">
          <MapPin size={10} className="inline mr-1 text-[#D4AF37]" /> Kitchen
        </div>
        <div className="absolute top-3 right-3 bg-[#0c0f0f]/80 backdrop-blur px-2 py-1 rounded text-[10px] text-white/70">
          <MapPin size={10} className="inline mr-1 text-green-400" /> Your Location
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* ETA Card */}
        <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-xs text-white/40">Estimated Arrival</p>
              <p className="text-xl font-bold text-[#D4AF37]">{eta} min</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/40">Order</p>
            <p className="text-sm font-semibold text-white">#{orderId}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-[#D4AF37] rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-white/30">
            <span>Preparing</span>
            <span>Picked Up</span>
            <span>En Route</span>
            <span>Delivered</span>
          </div>
        </div>

        {/* Rider Card */}
        <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37]/30 to-[#1a1c1c] flex items-center justify-center text-xl">
              🏍️
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-white">{tracking.rider?.name || "Rider"}</h3>
              <div className="flex items-center gap-1 text-xs text-white/40">
                <Star size={10} className="text-[#D4AF37]" /> {tracking.rider?.rating || 4.7}
                <span className="mx-1">·</span>
                <Bike size={10} /> {tracking.rider?.bike || "UP16 GH 3456"}
              </div>
            </div>
            <a href={`tel:${tracking.rider?.phone || "9876543213"}`} className="p-2.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg text-[#D4AF37]">
              <Phone size={16} />
            </a>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white/60 flex items-center justify-center gap-1.5">
              <MessageSquare size={12} /> Message
            </button>
            <button className="flex-1 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white/60 flex items-center justify-center gap-1.5">
              <Navigation size={12} /> Navigate
            </button>
          </div>
        </div>

        {/* Live Updates */}
        <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-white mb-2">Live Updates</h3>
          <div className="space-y-2">
            {messages.length === 0 && (
              <p className="text-[10px] text-white/30">Waiting for rider updates...</p>
            )}
            {messages.map((msg, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className="text-[#D4AF37]">●</span>
                <span className="text-white/60">{msg}</span>
                <span className="text-white/20 ml-auto">{Math.max(1, messages.length - i)}m ago</span>
              </div>
            ))}
          </div>
        </div>

        {/* Safety */}
        <div className="flex items-center gap-2 p-3 bg-green-500/5 border border-green-500/10 rounded-lg">
          <Shield size={14} className="text-green-400 shrink-0" />
          <p className="text-[10px] text-white/40">Tamper-evident packaging. Temperature verified at pickup. Your food is in safe hands.</p>
        </div>
      </div>
    </div>
  );
}
