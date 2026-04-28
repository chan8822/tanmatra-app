import { useState } from "react";
import { Plus, Trash2, Star, Clock, Calendar } from "lucide-react";

interface StaffMember {
  id: number;
  name: string;
  role: string;
  phone: string;
  rating: number;
  shifts: string;
  status: "active" | "off" | "leave";
  joined: string;
}

const initialStaff: StaffMember[] = [
  { id: 1, name: "Rajesh Kumar", role: "Head Chef", phone: "98765 43210", rating: 4.8, shifts: "Morning", status: "active", joined: "Jan 2024" },
  { id: 2, name: "Priya Singh", role: "Sous Chef", phone: "98765 43211", rating: 4.6, shifts: "Evening", status: "active", joined: "Mar 2024" },
  { id: 3, name: "Amit Sharma", role: "Prep Cook", phone: "98765 43212", rating: 4.3, shifts: "Morning", status: "active", joined: "Jun 2024" },
  { id: 4, name: "Sunita Devi", role: "Quality Inspector", phone: "98765 43213", rating: 4.9, shifts: "Full", status: "active", joined: "Feb 2024" },
  { id: 5, name: "Vikram Patel", role: "Delivery Rider", phone: "98765 43214", rating: 4.5, shifts: "Evening", status: "off", joined: "Aug 2024" },
];

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [showAdd, setShowAdd] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", role: "Prep Cook", phone: "", shifts: "Morning" });

  const addStaff = () => {
    if (!newMember.name.trim() || !newMember.phone.trim()) return;
    setStaff([...staff, { id: Date.now(), ...newMember, rating: 0, status: "active", joined: new Date().toLocaleDateString() }]);
    setShowAdd(false);
    setNewMember({ name: "", role: "Prep Cook", phone: "", shifts: "Morning" });
  };

  const removeStaff = (id: number) => setStaff(staff.filter((s) => s.id !== id));
  const toggleStatus = (id: number) => {
    setStaff(staff.map((s) => {
      if (s.id !== id) return s;
      const next: StaffMember["status"] = s.status === "active" ? "off" : s.status === "off" ? "leave" : "active";
      return { ...s, status: next };
    }));
  };

  const statusColors: Record<string, string> = {
    active: "bg-green-500/15 text-green-400 border-green-500/20",
    off: "bg-white/5 text-white/40 border-white/10",
    leave: "bg-red-500/15 text-red-400 border-red-500/20",
  };

  const activeCount = staff.filter((s) => s.status === "active").length;
  const avgRating = (staff.reduce((s, m) => s + m.rating, 0) / staff.filter((s) => s.rating > 0).length).toFixed(1);

  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-3 text-center">
          <div className="text-lg font-bold text-[#D4AF37]">{staff.length}</div>
          <div className="text-[10px] text-white/40">Total Staff</div>
        </div>
        <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-3 text-center">
          <div className="text-lg font-bold text-green-400">{activeCount}</div>
          <div className="text-[10px] text-white/40">On Duty</div>
        </div>
        <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-3 text-center">
          <div className="text-lg font-bold text-[#D4AF37]">{avgRating}</div>
          <div className="text-[10px] text-white/40">Avg Rating</div>
        </div>
      </div>

      {/* Staff List */}
      <div className="space-y-2">
        {staff.map((s) => (
          <div key={s.id} className="bg-[#1a1c1c] border border-white/5 rounded-xl p-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] text-sm font-bold">{s.name.charAt(0)}</div>
                <div>
                  <h4 className="text-xs font-semibold text-white">{s.name}</h4>
                  <p className="text-[10px] text-white/40">{s.role} · {s.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => toggleStatus(s.id)} className={`text-[10px] px-2 py-0.5 rounded-full border ${statusColors[s.status]}`}>{s.status}</button>
                <button onClick={() => removeStaff(s.id)} className="p-1 text-red-400/60"><Trash2 size={12} /></button>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-2 text-[10px] text-white/30">
              <span className="flex items-center gap-1"><Star size={10} className="text-[#D4AF37]" /> {s.rating || "—"}</span>
              <span className="flex items-center gap-1"><Clock size={10} /> {s.shifts}</span>
              <span className="flex items-center gap-1"><Calendar size={10} /> {s.joined}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add */}
      {showAdd ? (
        <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4 space-y-2">
          <h4 className="text-xs font-semibold text-white">Add Staff Member</h4>
          <input value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} placeholder="Name" className="w-full px-3 py-2 bg-[#0c0f0f] border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30" />
          <input value={newMember.phone} onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })} placeholder="Phone" className="w-full px-3 py-2 bg-[#0c0f0f] border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30" />
          <select value={newMember.role} onChange={(e) => setNewMember({ ...newMember, role: e.target.value })} className="w-full px-3 py-2 bg-[#0c0f0f] border border-white/10 rounded-lg text-sm text-white">
            {["Head Chef", "Sous Chef", "Prep Cook", "Quality Inspector", "Delivery Rider", "Dishwasher"].map((r) => <option key={r}>{r}</option>)}
          </select>
          <div className="flex gap-2">
            <button onClick={addStaff} className="flex-1 py-2 bg-[#D4AF37] text-[#0c0f0f] rounded-lg text-xs font-semibold">Add</button>
            <button onClick={() => setShowAdd(false)} className="flex-1 py-2 bg-white/5 text-white/60 rounded-lg text-xs">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowAdd(true)} className="w-full py-3 border border-dashed border-white/15 rounded-xl text-sm text-white/40 flex items-center justify-center gap-2">
          <Plus size={16} /> Add Staff Member
        </button>
      )}
    </div>
  );
}
