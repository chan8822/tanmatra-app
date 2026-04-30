import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, HelpCircle, MessageCircle, Mail, Phone, ChevronRight, Search, FileText, Shield } from "lucide-react";

const faqs = [
  { q: "How do I track my order?", a: "Go to Orders tab and tap on any active order to see real-time tracking." },
  { q: "Can I modify my order after placing it?", a: "You can modify within 5 minutes of placing. Contact support for urgent changes." },
  { q: "What is RD Verified?", a: "Every dish is approved by our registered dietitians for nutritional accuracy." },
  { q: "How does Tanmatra Gold work?", a: "Subscribe to save 20% on every order + free delivery + priority support." },
  { q: "Do you offer corporate meal plans?", a: "Yes! Contact us at corporate@tanmatra.com for bulk meal packages." },
];

export default function SupportPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filtered = faqs.filter((f) => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-6">
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-white/60"><ArrowLeft size={22} /></button>
        <HelpCircle size={20} className="text-[#D4AF37]" />
        <h1 className="text-base font-semibold">Help & Support</h1>
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search FAQs..." className="w-full pl-9 pr-3 py-2.5 bg-[#141414] border border-white/10 rounded-xl text-sm placeholder:text-white/30 outline-none" />
        </div>
      </div>

      {/* Contact Cards */}
      <div className="px-4 grid grid-cols-2 gap-2 mb-4">
        <div className="card p-3 text-center">
          <MessageCircle size={18} className="text-green-400 mx-auto mb-1" />
          <p className="text-xs font-medium">Chat</p>
          <p className="text-[10px] text-white/40">Typically replies in 2 min</p>
        </div>
        <div className="card p-3 text-center">
          <Phone size={18} className="text-blue-400 mx-auto mb-1" />
          <p className="text-xs font-medium">Call</p>
          <p className="text-[10px] text-white/40">+91-9876543200</p>
        </div>
      </div>

      {/* FAQs */}
      <div className="px-4 space-y-2">
        <h3 className="text-xs font-bold text-white/40 uppercase mb-2">Frequently Asked</h3>
        {filtered.map((f, i) => (
          <button key={i} onClick={() => setOpen(open === i ? null : i)} className="w-full card p-3 text-left">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{f.q}</span>
              <ChevronRight size={14} className={`text-white/20 shrink-0 transition-transform ${open === i ? "rotate-90" : ""}`} />
            </div>
            {open === i && <p className="text-xs text-white/50 mt-2 leading-relaxed">{f.a}</p>}
          </button>
        ))}
        {filtered.length === 0 && <p className="text-sm text-white/30 text-center py-4">No results found</p>}
      </div>

      {/* Links */}
      <div className="px-4 mt-4 space-y-2">
        <div className="flex items-center gap-3 p-3 card">
          <FileText size={16} className="text-white/40" />
          <span className="text-sm">Terms of Service</span>
          <ChevronRight size={14} className="text-white/20 ml-auto" />
        </div>
        <div className="flex items-center gap-3 p-3 card">
          <Shield size={16} className="text-white/40" />
          <span className="text-sm">Privacy Policy</span>
          <ChevronRight size={14} className="text-white/20 ml-auto" />
        </div>
      </div>
    </div>
  );
}
