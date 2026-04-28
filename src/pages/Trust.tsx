import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Shield, CheckCircle, Microscope, Truck, Award, Lock } from "lucide-react";

const pillars = [
  { icon: <Shield size={20} />, title: "RD-Verified Nutrition", desc: "Every recipe is reviewed by a Registered Dietitian for macro accuracy and health alignment." },
  { icon: <Microscope size={20} />, title: "Lab-Tested Macros", desc: "Calories, protein, carbs, and fat are tested in certified labs—not just calculated." },
  { icon: <CheckCircle size={20} />, title: "100% Ingredient Transparency", desc: "Every ingredient is listed. No hidden additives, no ambiguous 'spices mix'." },
  { icon: <Truck size={20} />, title: "Clinical Delivery Protocol", desc: "Tamper-evident packaging, temperature logs, and sealed RD nutrition cards in every box." },
  { icon: <Lock size={20} />, title: "Allergen Segregation", desc: "Dedicated prep stations and utensils. Full traceability for every batch." },
  { icon: <Award size={20} />, title: "FSSAI Licensed", desc: "All kitchens hold valid FSSAI licenses. Regular third-party audits." },
];

const audits = [
  { date: "Apr 2025", score: "98/100", label: "Hygiene Audit" },
  { date: "Mar 2025", score: "96/100", label: "Nutrition Audit" },
  { date: "Feb 2025", score: "99/100", label: "Supplier Audit" },
];

export default function TrustPage() {
  return (
    <div className="fade-in pb-10">
      <Header title="Trust Center" backTo="/" />

      <div className="px-4 py-6">
        <h1 className="font-serif text-3xl text-white mb-2">Why Trust<br/><span className="text-[#D4AF37]">Tanmatra</span></h1>
        <p className="text-sm text-white/50">Radical transparency in every meal we craft.</p>
      </div>

      {/* Scorecard */}
      <div className="px-4 mb-6">
        <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4 grid grid-cols-3 gap-3">
          {audits.map((a) => (
            <div key={a.label} className="text-center">
              <div className="text-lg font-bold text-[#D4AF37]">{a.score}</div>
              <div className="text-[10px] text-white/40">{a.label}</div>
              <div className="text-[9px] text-white/25">{a.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pillars */}
      <div className="px-4 space-y-3">
        {pillars.map((p, i) => (
          <div key={i} className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4 flex gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center shrink-0 text-[#D4AF37]">{p.icon}</div>
            <div>
              <h3 className="text-sm font-semibold text-white">{p.title}</h3>
              <p className="text-xs text-white/50 leading-relaxed mt-0.5">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="px-4 py-8">
        <Link to="/menu" className="block w-full py-3.5 bg-[#D4AF37] text-[#0c0f0f] rounded-xl font-semibold text-sm text-center active:scale-[0.98] transition-transform">
          Browse the Menu
        </Link>
      </div>
    </div>
  );
}
