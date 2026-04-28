import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Gift, Copy, CheckCircle, Users, Share2 } from "lucide-react";

export default function ReferralPage() {
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("tanmatra_user") || "null");
    setUser(u);
    if (u?.phone) {
      const refCode = `TAN${u.phone.slice(-6)}`;
      setCode(refCode);
    } else {
      setCode("TANFRIEND");
    }
    const refs = JSON.parse(localStorage.getItem("tanmatra_referrals") || "[]");
    setReferrals(refs);
  }, []);

  const copyCode = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const share = () => {
    const text = `Order healthy, RD-verified meals with Tanmatra. Use my code ${code} and get ₹100 off your first order! https://tanmatra.in`;
    if (navigator.share) {
      navigator.share({ title: "Tanmatra", text });
    } else {
      navigator.clipboard?.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fade-in pb-10">
      <Header title="Refer & Earn" backTo="/" />

      <div className="px-4 py-6">
        <h1 className="font-serif text-3xl text-white mb-2">Refer &<br/><span className="text-[#D4AF37]">Earn</span></h1>
        <p className="text-sm text-white/50">Give ₹100. Get ₹100. Everyone eats better.</p>
      </div>

      {/* Code Card */}
      <div className="px-4">
        <div className="bg-gradient-to-br from-[#D4AF37]/20 to-[#1a1c1c] border border-[#D4AF37]/30 rounded-xl p-5 text-center">
          <Gift size={32} className="text-[#D4AF37] mx-auto mb-3" />
          <p className="text-xs text-white/50 mb-1">Your Referral Code</p>
          <div className="text-2xl font-bold text-[#D4AF37] tracking-wider mb-3">{code}</div>
          <div className="flex gap-2">
            <button onClick={copyCode} className="flex-1 py-2.5 bg-[#D4AF37] text-[#0c0f0f] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5">
              {copied ? <><CheckCircle size={14} /> Copied</> : <><Copy size={14} /> Copy Code</>}
            </button>
            <button onClick={share} className="flex-1 py-2.5 bg-white/5 text-white border border-white/10 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5">
              <Share2 size={14} /> Share
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-[#D4AF37]">{referrals.length}</div>
            <div className="text-[10px] text-white/40">Friends Invited</div>
          </div>
          <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-[#D4AF37]">{referrals.filter((r) => r.ordered).length}</div>
            <div className="text-[10px] text-white/40">Successful</div>
          </div>
          <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-[#D4AF37]">₹{referrals.filter((r) => r.ordered).length * 100}</div>
            <div className="text-[10px] text-white/40">Earned</div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="px-4 space-y-3">
        <h2 className="text-sm font-semibold text-white">How It Works</h2>
        {[
          { icon: <Share2 size={14} />, title: "Share Your Code", desc: "Send your unique code to friends via WhatsApp, SMS, or social media." },
          { icon: <Users size={14} />, title: "Friend Orders", desc: "They get ₹100 off their first order when they use your code at checkout." },
          { icon: <Gift size={14} />, title: "You Earn", desc: "₹100 credit is added to your Tanmatra wallet after their first delivery." },
        ].map((s, i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-[#1a1c1c] border border-white/5 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">{s.icon}</div>
            <div>
              <h3 className="text-xs font-semibold text-white">{s.title}</h3>
              <p className="text-[10px] text-white/40 mt-0.5">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {!user && (
        <div className="px-4 py-4">
          <div className="p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-lg">
            <p className="text-xs text-[#D4AF37]">Login required to track referrals and earn credits.</p>
            <Link to="/checkout" className="text-[10px] text-white/50 mt-1 inline-block">Go to checkout to login →</Link>
          </div>
        </div>
      )}
    </div>
  );
}
