import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Plus, Trash2, User, Baby, Heart, Zap, ChevronRight } from "lucide-react";

interface Member {
  id: number;
  name: string;
  relation: string;
  track: string;
  age: number;
  weight: number;
}

const trackColors: Record<string, string> = {
  Athlete: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Junior: "text-green-400 bg-green-500/10 border-green-500/20",
  Senior: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  Everyday: "text-white bg-white/5 border-white/10",
};

const trackIcons: Record<string, any> = {
  Athlete: <Zap size={14} />,
  Junior: <Baby size={14} />,
  Senior: <Heart size={14} />,
  Everyday: <User size={14} />,
};

export default function FamilyPage() {
  const [members, setMembers] = useState<Member[]>([
    { id: 1, name: "Rahul", relation: "Self", track: "Athlete", age: 32, weight: 78 },
    { id: 2, name: "Priya", relation: "Spouse", track: "Everyday", age: 30, weight: 62 },
    { id: 3, name: "Aarav", relation: "Son", track: "Junior", age: 8, weight: 28 },
    { id: 4, name: "Dad", relation: "Father", track: "Senior", age: 65, weight: 75 },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", relation: "", track: "Everyday", age: 30, weight: 60 });

  const addMember = () => {
    if (!newMember.name.trim()) return;
    setMembers([...members, { ...newMember, id: Date.now() }]);
    setShowAdd(false);
    setNewMember({ name: "", relation: "", track: "Everyday", age: 30, weight: 60 });
  };

  const removeMember = (id: number) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  return (
    <div className="fade-in pb-10">
      <Header title="Family" backTo="/" />

      <div className="px-4 py-4 space-y-3">
        {members.map((m) => {
          const colorClass = trackColors[m.track] || trackColors.Everyday;
          const parts = colorClass.split(" ");
          const textColor = parts.find((p) => p.startsWith("text-")) || "text-white";
          const bgClass = parts.filter((p) => !p.startsWith("text-")).join(" ");
          const Icon = trackIcons[m.track] || trackIcons.Everyday;

          return (
            <div key={m.id} className={`${bgClass} border rounded-xl p-4`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${textColor} bg-black/20`}>{Icon}</div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{m.name}</h3>
                    <p className="text-xs text-white/40">{m.relation} · {m.age} yrs · {m.weight} kg</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${textColor} bg-black/20`}>{m.track}</span>
                  <button onClick={() => removeMember(m.id)} className="p-1.5 text-red-400/60 hover:text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>
              <Link to="/track" className="mt-3 flex items-center justify-between text-xs text-white/40 hover:text-[#D4AF37] transition-colors">
                View nutrition track <ChevronRight size={12} />
              </Link>
            </div>
          );
        })}

        {showAdd ? (
          <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white">Add Family Member</h3>
            <input value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} placeholder="Name" className="w-full px-3 py-2 bg-[#0c0f0f] border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]/50" />
            <input value={newMember.relation} onChange={(e) => setNewMember({ ...newMember, relation: e.target.value })} placeholder="Relation" className="w-full px-3 py-2 bg-[#0c0f0f] border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]/50" />
            <select value={newMember.track} onChange={(e) => setNewMember({ ...newMember, track: e.target.value })} className="w-full px-3 py-2 bg-[#0c0f0f] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#D4AF37]/50">
              <option>Athlete</option>
              <option>Everyday</option>
              <option>Junior</option>
              <option>Senior</option>
            </select>
            <div className="flex gap-2">
              <input type="number" value={newMember.age} onChange={(e) => setNewMember({ ...newMember, age: Number(e.target.value) })} placeholder="Age" className="w-full px-3 py-2 bg-[#0c0f0f] border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]/50" />
              <input type="number" value={newMember.weight} onChange={(e) => setNewMember({ ...newMember, weight: Number(e.target.value) })} placeholder="Weight (kg)" className="w-full px-3 py-2 bg-[#0c0f0f] border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]/50" />
            </div>
            <div className="flex gap-2">
              <button onClick={addMember} className="flex-1 py-2.5 bg-[#D4AF37] text-[#0c0f0f] rounded-lg text-sm font-semibold">Add Member</button>
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 bg-white/5 text-white/60 rounded-lg text-sm">Cancel</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowAdd(true)} className="w-full py-3 border border-dashed border-white/15 rounded-xl text-sm text-white/40 flex items-center justify-center gap-2 hover:border-[#D4AF37]/30 hover:text-[#D4AF37] transition-colors">
            <Plus size={16} /> Add Family Member
          </button>
        )}
      </div>
    </div>
  );
}
