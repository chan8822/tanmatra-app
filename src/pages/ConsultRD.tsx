import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Calendar, Clock, Phone, MessageSquare, CheckCircle, Stethoscope, Apple, Heart } from "lucide-react";

const TIME_SLOTS = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM",
];

const CONCERNS = [
  "Weight Management", "Muscle Building", "Diabetes", "PCOS",
  "Thyroid", "Digestive Health", "Heart Health", "General Wellness",
];

export default function ConsultRDPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"form" | "confirm">("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const toggleConcern = (c: string) => {
    setSelectedConcerns((p) => p.includes(c) ? p.filter((x) => x !== c) : [...p, c]);
  };

  const handleSubmit = () => {
    if (!name || !phone || selectedConcerns.length === 0 || !selectedDate || !selectedTime) return;
    setStep("confirm");
  };

  if (step === "confirm") {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center px-6 text-center fade-in">
        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
          <CheckCircle size={40} className="text-green-400" />
        </div>
        <h2 className="text-xl font-bold">Booking Confirmed!</h2>
        <p className="text-sm text-white/60 mt-2">Your RD consultation is scheduled for</p>
        <p className="text-lg font-semibold text-[#D4AF37] mt-1">{selectedDate} at {selectedTime}</p>
        <p className="text-xs text-white/40 mt-2">Our dietitian will call you on {phone}</p>
        <div className="mt-6 space-y-3 w-full max-w-xs">
          <button onClick={() => navigate("/")} className="w-full py-3 bg-[#D4AF37] text-[#0c0f0f] font-bold rounded-xl">Back to Home</button>
          <button onClick={() => { setStep("form"); }} className="w-full py-3 bg-white/5 text-white border border-white/10 rounded-xl text-sm">Book Another</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white fade-in pb-6">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#121212] border-b border-white/5 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-white/60"><ChevronLeft size={22} /></button>
        <div>
          <h1 className="text-base font-semibold">Talk to Our RD</h1>
          <p className="text-[10px] text-white/40">Free 15-min nutrition consultation</p>
        </div>
      </div>

      {/* Hero */}
      <div className="mx-4 mt-4 p-4 bg-gradient-to-br from-[#2a2520] to-[#1a1c1c] border border-[#D4AF37]/20 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
            <Stethoscope size={22} className="text-[#D4AF37]" />
          </div>
          <div>
            <p className="text-sm font-semibold">Dr. Priya Sharma</p>
            <p className="text-xs text-white/40">Senior Clinical Dietitian, 12+ years</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Heart size={10} className="text-green-400 fill-green-400" />
              <span className="text-[10px] text-green-400">4.9 rating</span>
              <span className="text-white/20 mx-1">|</span>
              <span className="text-[10px] text-white/40">500+ consultations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Name */}
      <div className="px-4 mt-4">
        <label className="text-xs text-white/60 mb-1.5 block">Your Name</label>
        <div className="flex items-center gap-2 bg-[#1a1c1c] border border-white/10 rounded-xl px-3 py-2.5">
          <Phone size={16} className="text-white/30" />
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30" />
        </div>
      </div>

      {/* Phone */}
      <div className="px-4 mt-3">
        <label className="text-xs text-white/60 mb-1.5 block">Phone Number</label>
        <div className="flex items-center gap-2 bg-[#1a1c1c] border border-white/10 rounded-xl px-3 py-2.5">
          <Phone size={16} className="text-white/30" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91-9876543210" className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30" />
        </div>
      </div>

      {/* Health Concerns */}
      <div className="px-4 mt-4">
        <label className="text-xs text-white/60 mb-2 block">Health Concerns (select all that apply)</label>
        <div className="flex flex-wrap gap-2">
          {CONCERNS.map((c) => (
            <button key={c} onClick={() => toggleConcern(c)}
              className={`px-3 py-2 rounded-full text-xs border transition-colors ${selectedConcerns.includes(c) ? "bg-[#D4AF37]/15 border-[#D4AF37]/40 text-[#D4AF37]" : "bg-[#1a1c1c] border-white/10 text-white/50"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Date */}
      <div className="px-4 mt-4">
        <label className="text-xs text-white/60 mb-2 block flex items-center gap-1"><Calendar size={12} /> Preferred Date</label>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {["Today", "Tomorrow", "Wed 30", "Thu 1", "Fri 2", "Sat 3"].map((d) => (
            <button key={d} onClick={() => setSelectedDate(d)}
              className={`shrink-0 px-4 py-2.5 rounded-xl border text-xs text-center ${selectedDate === d ? "bg-[#D4AF37]/15 border-[#D4AF37]/40 text-[#D4AF37]" : "bg-[#1a1c1c] border-white/10 text-white/50"}`}>
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Time */}
      <div className="px-4 mt-4">
        <label className="text-xs text-white/60 mb-2 block flex items-center gap-1"><Clock size={12} /> Preferred Time</label>
        <div className="grid grid-cols-5 gap-2">
          {TIME_SLOTS.map((t) => (
            <button key={t} onClick={() => setSelectedTime(t)}
              className={`px-2 py-2 rounded-lg border text-[10px] text-center ${selectedTime === t ? "bg-[#D4AF37]/15 border-[#D4AF37]/40 text-[#D4AF37]" : "bg-[#1a1c1c] border-white/10 text-white/50"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Book Button */}
      <div className="px-4 mt-6">
        <button onClick={handleSubmit}
          disabled={!name || !phone || selectedConcerns.length === 0 || !selectedDate || !selectedTime}
          className="w-full py-3.5 bg-[#D4AF37] text-[#0c0f0f] font-bold rounded-xl disabled:opacity-30 active:scale-[0.98] transition-transform">
          Book Free Consultation
        </button>
        <p className="text-[10px] text-white/30 text-center mt-2">You will receive a confirmation call 30 min before</p>
      </div>

      {/* Trust badges */}
      <div className="px-4 mt-4 space-y-2">
        {[
          { icon: Stethoscope, text: "Certified clinical dietitians" },
          { icon: Apple, text: "Personalized meal plans" },
          { icon: MessageSquare, text: "Follow-up via WhatsApp" },
        ].map((b) => (
          <div key={b.text} className="flex items-center gap-2 text-xs text-white/40">
            <b.icon size={14} className="text-[#D4AF37]" /> {b.text}
          </div>
        ))}
      </div>
    </div>
  );
}
