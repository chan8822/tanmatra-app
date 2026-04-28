import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft, Pencil, Trash2, User, Phone, Mail, Calendar, Heart, ChevronDown
} from "lucide-react";

export default function AccountSettings() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"menu" | "edit">("menu");
  const [form, setForm] = useState({
    name: "Tanmatra Member",
    phone: "98765 43210",
    email: "member@tanmatra.com",
    dob: "",
    anniversary: "",
    gender: "",
  });

  if (tab === "edit") {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] fade-in pb-6">
        <div className="sticky top-0 z-50 bg-[var(--bg-primary)] border-b border-white/5 px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setTab("menu")} className="text-white/60"><ChevronLeft size={22} /></button>
            <h1 className="text-base font-semibold text-white">Your Profile</h1>
          </div>
        </div>

        {/* Avatar */}
        <div className="flex justify-center mt-6 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#0c0f0f] text-2xl font-bold">
              T
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[var(--bg-secondary)] border border-white/10 flex items-center justify-center text-white/60">
              <Pencil size={12} />
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="px-4 space-y-4">
          {[
            { key: "name", label: "Name", icon: User, type: "text" },
            { key: "phone", label: "Mobile", icon: Phone, type: "tel", changeable: true },
            { key: "email", label: "Email", icon: Mail, type: "email", changeable: true },
            { key: "dob", label: "Date of birth", icon: Calendar, type: "date" },
            { key: "anniversary", label: "Anniversary", icon: Heart, type: "date" },
          ].map((field: any) => (
            <div key={field.key} className="relative">
              <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">{field.label}</label>
              <div className="flex items-center gap-2 bg-[var(--bg-secondary)] border border-white/10 rounded-xl px-3 py-2.5">
                <field.icon size={16} className="text-white/30 shrink-0" />
                <input
                  type={field.type}
                  value={(form as any)[field.key]}
                  onChange={(e) => setForm((p) => ({ ...p, [field.key]: e.target.value }))}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/20"
                />
                {field.changeable && (
                  <button className="text-[10px] text-red-400 font-semibold uppercase tracking-wider">Change</button>
                )}
              </div>
            </div>
          ))}

          {/* Gender Dropdown */}
          <div className="relative">
            <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Gender</label>
            <div className="flex items-center gap-2 bg-[var(--bg-secondary)] border border-white/10 rounded-xl px-3 py-2.5">
              <User size={16} className="text-white/30 shrink-0" />
              <select
                value={form.gender}
                onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value }))}
                className="flex-1 bg-transparent text-sm text-white outline-none appearance-none"
              >
                <option value="" className="bg-[#1a1c1c]">Select</option>
                <option value="male" className="bg-[#1a1c1c]">Male</option>
                <option value="female" className="bg-[#1a1c1c]">Female</option>
                <option value="other" className="bg-[#1a1c1c]">Other</option>
                <option value="prefer-not" className="bg-[#1a1c1c]">Prefer not to say</option>
              </select>
              <ChevronDown size={14} className="text-white/30 shrink-0" />
            </div>
          </div>
        </div>

        {/* Update Button */}
        <div className="px-4 mt-8">
          <button className="w-full py-3.5 rounded-xl bg-[#D4AF37] text-sm font-semibold text-[#0c0f0f]">
            Update profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] fade-in">
      <div className="sticky top-0 z-50 bg-[var(--bg-primary)] border-b border-white/5 px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-white/60"><ChevronLeft size={22} /></button>
          <h1 className="text-base font-semibold text-white">Account Settings</h1>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-3">
        <button
          onClick={() => setTab("edit")}
          className="w-full flex items-center gap-3 p-4 bg-[var(--bg-secondary)] border border-white/5 rounded-xl text-left"
        >
          <Pencil size={18} className="text-white/40" />
          <span className="flex-1 text-sm text-white">Edit Profile</span>
          <ChevronLeft size={14} className="text-white/20 rotate-180" />
        </button>

        <button className="w-full flex items-center gap-3 p-4 bg-[var(--bg-secondary)] border border-red-500/10 rounded-xl text-left">
          <Trash2 size={18} className="text-red-400" />
          <span className="flex-1 text-sm text-red-400">Delete Account</span>
          <ChevronLeft size={14} className="text-red-400/20 rotate-180" />
        </button>
      </div>
    </div>
  );
}
