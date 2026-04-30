import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Stethoscope, Calendar, Clock, CheckCircle, MessageSquare, User, Phone } from "lucide-react";
import { ROUTES } from "@/lib/routes";

const RD_PROFILES = [
  { name: "Dr. Priya Sharma", title: "Senior Clinical Dietitian", exp: "12 years", slots: "10 AM - 6 PM", image: "/dish/sa1.jpg" },
  { name: "Dr. Arjun Mehta", title: "Sports Nutritionist", exp: "8 years", slots: "11 AM - 7 PM", image: "/dish/bb1.jpg" },
];

const TIME_SLOTS = ["10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

export default function ConsultRDPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedRD, setSelectedRD] = useState(0);
  const [selectedDate, setSelectedDate] = useState("Today");
  const [selectedTime, setSelectedTime] = useState("");
  const [concern, setConcern] = useState("");

  const dates = ["Today", "Tomorrow", "Day after"];

  if (step === 3) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
          <CheckCircle size={32} className="text-green-400" />
        </div>
        <h2 className="text-xl font-bold mb-2">Booking Confirmed!</h2>
        <p className="text-sm text-white/50 mb-1">{RD_PROFILES[selectedRD].name}</p>
        <p className="text-sm text-white/50 mb-6">{selectedDate} at {selectedTime}</p>
        <button onClick={() => navigate(ROUTES.home)} className="btn-gold px-8 rounded-xl text-sm">Back to Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center gap-3">
        <button onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)} className="text-white/60"><ArrowLeft size={22} /></button>
        <h1 className="text-base font-semibold">Consult an RD</h1>
      </div>

      {step === 1 && (
        <div className="px-4 py-4 space-y-3">
          <p className="text-sm text-white/40 mb-3">Select a registered dietitian</p>
          {RD_PROFILES.map((rd, i) => (
            <button key={i} onClick={() => setSelectedRD(i)} className={`w-full card p-4 text-left flex items-start gap-3 border-2 transition-colors ${selectedRD === i ? "border-[#D4AF37] bg-[#D4AF37]/5" : "border-transparent"}`}>
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#141414] shrink-0"><img src={rd.image} alt={rd.name} className="w-full h-full object-cover" /></div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{rd.name}</p>
                <p className="text-xs text-white/40">{rd.title}</p>
                <p className="text-[10px] text-[#D4AF37] mt-1">{rd.exp} experience &middot; {rd.slots}</p>
              </div>
              {selectedRD === i && <CheckCircle size={16} className="text-[#D4AF37] shrink-0" />}
            </button>
          ))}
          <button onClick={() => setStep(2)} className="w-full btn-primary rounded-xl mt-4">Continue</button>
        </div>
      )}

      {step === 2 && (
        <div className="px-4 py-4 space-y-4">
          <div>
            <p className="text-sm font-semibold mb-2">Select Date</p>
            <div className="flex gap-2">
              {dates.map((d) => (
                <button key={d} onClick={() => setSelectedDate(d)} className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-colors ${selectedDate === d ? "bg-[#D4AF37] text-[#0a0a0a] border-[#D4AF37]" : "bg-[#141414] text-white/50 border-white/10"}`}>{d}</button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold mb-2">Available Slots</p>
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map((t) => (
                <button key={t} onClick={() => setSelectedTime(t)} className={`py-2.5 rounded-xl text-xs font-semibold border transition-colors ${selectedTime === t ? "bg-[#D4AF37] text-[#0a0a0a] border-[#D4AF37]" : "bg-[#141414] text-white/50 border-white/10"}`}>{t}</button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold mb-2">Your Health Concern</p>
            <textarea value={concern} onChange={(e) => setConcern(e.target.value)} placeholder="e.g. Weight management, diabetes diet..." className="w-full h-24 bg-[#141414] border border-white/10 rounded-xl p-3 text-sm placeholder:text-white/30 outline-none resize-none" />
          </div>

          <button onClick={() => setStep(3)} disabled={!selectedTime} className="w-full btn-primary rounded-xl mt-2 disabled:opacity-30">Confirm Booking</button>
        </div>
      )}
    </div>
  );
}
