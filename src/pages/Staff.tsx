import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Users, UserCheck, Clock, Phone } from "lucide-react";
import { ROUTES } from "@/lib/routes";

const INITIAL = [
  { id: 1, name: "Amit Kumar", role: "Head Chef", phone: "+91-9876543211", status: "on_duty", shift: "9 AM - 6 PM" },
  { id: 2, name: "Priya Singh", role: "Sous Chef", phone: "+91-9876543212", status: "on_duty", shift: "10 AM - 7 PM" },
  { id: 3, name: "Ravi Patel", role: "Prep Cook", phone: "+91-9876543213", status: "off_duty", shift: "6 AM - 3 PM" },
  { id: 4, name: "Sneha Gupta", role: "RD Consultant", phone: "+91-9876543214", status: "on_duty", shift: "10 AM - 6 PM" },
  { id: 5, name: "Vikram Rao", role: "Packaging", phone: "+91-9876543215", status: "on_duty", shift: "11 AM - 8 PM" },
];

export default function StaffPage() {
  const [staff, setStaff] = useState(INITIAL);

  const toggle = (id: number) => {
    setStaff(staff.map((s) => s.id === id ? { ...s, status: s.status === "on_duty" ? "off_duty" : "on_duty" } : s));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4">
      <div className="flex items-center gap-3 mb-5">
        <Link to={ROUTES.admin} className="text-white/60"><ArrowLeft size={22} /></Link>
        <Users size={20} className="text-blue-400" />
        <h1 className="text-base font-semibold">Staff</h1>
        <span className="ml-auto text-xs text-white/40">{staff.filter((s) => s.status === "on_duty").length} on duty</span>
      </div>

      <div className="space-y-2">
        {staff.map((s) => (
          <div key={s.id} className="card p-3.5 flex items-start gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${s.status === "on_duty" ? "bg-green-500/10" : "bg-white/5"}`}>
              <UserCheck size={18} className={s.status === "on_duty" ? "text-green-400" : "text-white/30"} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">{s.name}</p>
                <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-medium ${s.status === "on_duty" ? "bg-green-500/15 text-green-400" : "bg-white/5 text-white/30"}`}>{s.status === "on_duty" ? "ON DUTY" : "OFF"}</span>
              </div>
              <p className="text-xs text-white/40">{s.role}</p>
              <div className="flex items-center gap-3 mt-1.5 text-[10px] text-white/30">
                <span className="flex items-center gap-0.5"><Clock size={8} /> {s.shift}</span>
                <span className="flex items-center gap-0.5"><Phone size={8} /> {s.phone}</span>
              </div>
            </div>
            <button onClick={() => toggle(s.id)} className={`shrink-0 px-3 py-1 rounded-lg text-[10px] font-semibold border transition-colors ${s.status === "on_duty" ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-green-500/10 border-green-500/30 text-green-400"}`}>
              {s.status === "on_duty" ? "Clock Out" : "Clock In"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
