import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { API } from "@/lib/api";
import { ShoppingCart, Heart, Shield, Sparkles } from "lucide-react";

export default function Home() {
  const [categories, setCategories] = useState<any[]>([]);
  const [aiRecs, setAiRecs] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      API.categories().catch(() => []),
      API.recommend().catch(() => null),
    ]).then(([cats, recs]) => {
      setCategories(cats);
      setAiRecs(recs);
    });
  }, []);

  return (
    <div className="fade-in">
      <Header title="Tanmatra" />

      {/* Hero */}
      <section className="relative h-[85vh] flex flex-col justify-end p-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(12,15,15,0.6)] to-[#0c0f0f] z-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(212,175,55,0.15)] via-[#0c0f0f] to-[#0c0f0f]" />
        <div className="relative z-20 space-y-6">
          <div>
            <h2 className="text-xs tracking-[0.25em] uppercase text-[#D4AF37] mb-3">Noida's Premium Kitchen</h2>
            <h1 className="font-serif text-4xl leading-tight text-white">Culinary Precision.<br/><span className="text-[#D4AF37]">Artisanal Craft.</span></h1>
          </div>
          <p className="text-sm text-white/60 leading-relaxed max-w-[340px]">
            RD-verified meals for your family&apos;s health tracks — Athlete, Junior, Senior, Everyday.
          </p>
          <div className="space-y-3">
            <Link to="/menu" className="block w-full py-3.5 rounded-lg font-semibold text-sm tracking-wide bg-[#D4AF37] text-[#0c0f0f] text-center active:scale-[0.98] transition-transform">
              Explore the Menu
            </Link>
            <Link to="/wellness" className="block w-full py-3.5 rounded-lg font-semibold text-sm tracking-wide border border-[#D4AF37]/40 text-[#D4AF37] text-center hover:bg-[#D4AF37]/10 active:scale-[0.98] transition-transform">
              Wellness Signature →
            </Link>
          </div>
        </div>
      </section>

      {/* AI Recommendations */}
      {aiRecs && (
        <section className="px-6 py-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl text-[#D4AF37] flex items-center gap-2">
              <Sparkles size={18} /> AI For You
            </h2>
          </div>
          <div className="space-y-3">
            {(aiRecs.recommendations || []).slice(0, 3).map((r: any, i: number) => (
              <Link key={i} to="/menu" className="block bg-[#1a1c1c] border border-white/5 rounded-xl p-3 active:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[rgba(212,175,55,0.2)] to-[#0c0f0f] flex items-center justify-center text-xl">🍽️</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white">{r.dish}</h3>
                    <p className="text-xs text-white/40">{r.reason}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#D4AF37]/10 text-[#D4AF37]">{r.category}</span>
                      <span className="text-xs text-[#D4AF37]">₹{r.price}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Why Tanmatra */}
      <section className="px-6 py-10">
        <h2 className="font-serif text-2xl text-[#D4AF37] mb-6">Why Tanmatra</h2>
        <div className="space-y-4">
          {[
            { icon: <Shield size={20} />, title: "RD-Verified Nutrition", desc: "Every dish reviewed by registered dietitians for macro accuracy." },
            { icon: <Heart size={20} />, title: "Per-Family Health Tracks", desc: "Athlete, Junior, Senior, Everyday — matched to each member." },
            { icon: <ShoppingCart size={20} />, title: "Clinical Delivery", desc: "Tamper-proof packaging with RD cards. Priority riders." },
          ].map((f, i) => (
            <div key={i} className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4 flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center shrink-0 text-[#D4AF37]">{f.icon}</div>
              <div>
                <h3 className="text-sm font-semibold text-white">{f.title}</h3>
                <p className="text-xs text-white/50 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Collections */}
      <section className="px-6 py-10">
        <h2 className="font-serif text-2xl text-[#D4AF37] mb-6">Collections</h2>
        <div className="space-y-4">
          {(categories.length ? categories.slice(0, 6) : [
            { id: "soups", name: "Soups", description: "Nutrient-dense soups" },
            { id: "healthy-meals", name: "Healthy Meals", description: "Complete balanced meals" },
            { id: "salads", name: "Salads", description: "RD-verified salads" },
          ]).map((c: any) => (
            <Link key={c.id} to="/menu" className="block relative h-32 rounded-xl overflow-hidden text-left">
              <div className="absolute inset-0 bg-gradient-to-r from-[rgba(212,175,55,0.25)] to-[#0c0f0f]" />
              <div className="absolute inset-0 flex items-end p-4">
                <div>
                  <h3 className="font-serif text-xl text-white">{c.name}</h3>
                  <p className="text-xs text-white/60">{c.description || "Premium selection"}</p>
                </div>
                <span className="ml-auto mb-1 text-[#D4AF37] text-xl">›</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Tracks */}
      <section className="px-6 py-10 space-y-3">
        <h2 className="font-serif text-2xl text-[#D4AF37] mb-4">Your Track</h2>
        {[
          { label: "Athlete", to: "/track", color: "bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#D4AF37]" },
          { label: "Junior", to: "/track", color: "bg-green-900/20 border-green-700/30 text-green-400" },
          { label: "Senior", to: "/track", color: "bg-blue-900/20 border-blue-700/30 text-blue-400" },
          { label: "Everyday", to: "/menu", color: "bg-white/5 border-white/10 text-white/70" },
        ].map((t) => (
          <Link key={t.label} to={t.to} className={`block border rounded-lg p-4 flex items-center justify-between ${t.color}`}>
            <span className="text-sm font-medium">{t.label} Track</span>
            <span>›</span>
          </Link>
        ))}
      </section>

      {/* Savings */}
      <section className="px-6 py-10">
        <div className="bg-gradient-to-br from-green-900/20 to-[#1a1c1c] border border-green-500/10 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">💰</span>
            <h2 className="font-serif text-lg text-[#D4AF37]">Your Savings Tracker</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-[rgba(12,15,15,0.5)] rounded-lg">
              <div className="text-2xl font-bold text-green-400">₹1,240</div>
              <div className="text-[10px] text-white/40">Saved this month</div>
            </div>
            <div className="text-center p-3 bg-[rgba(12,15,15,0.5)] rounded-lg">
              <div className="text-2xl font-bold text-green-400">32%</div>
              <div className="text-[10px] text-white/40">vs Aggregators</div>
            </div>
          </div>
          <p className="text-xs text-white/50 mt-3">Direct ordering saves ₹80-150 per meal. Subscription saves another 20%.</p>
          <Link to="/orders" className="block mt-3 py-2.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-sm font-medium text-center">
            View Savings Breakdown →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10 text-center border-t border-white/5">
        <h3 className="font-serif text-sm tracking-[0.2em] uppercase text-[#D4AF37] mb-2">TANMATRA</h3>
        <p className="text-xs text-white/30">Crafted for the discerning palate.</p>
        <div className="flex justify-center gap-4 mt-4">
          <Link to="/trust" className="text-xs text-white/40 hover:text-[#D4AF37]">Trust</Link>
          <Link to="/menu" className="text-xs text-white/40 hover:text-[#D4AF37]">Menu</Link>
          <Link to="/wellness" className="text-xs text-white/40 hover:text-[#D4AF37]">Wellness</Link>
        </div>
      </footer>
    </div>
  );
}
