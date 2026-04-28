import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft, Crown, Bike, Percent, MessageCircle, HelpCircle, FileText, ChevronDown
} from "lucide-react";

const benefits = [
  {
    icon: Bike,
    title: "Free delivery",
    description: "Free delivery on all orders above ₹99. No surge fees, ever. Valid across all menu categories.",
  },
  {
    icon: Percent,
    title: "Up to 30% extra off",
    description: "Additional discounts on top of existing offers across all healthy meals, salads, and signature dishes.",
  },
  {
    icon: Crown,
    title: "Priority support",
    description: "Skip the queue with dedicated Gold member customer support. Average response under 2 minutes.",
  },
];

const faqs = [
  {
    section: "Benefits",
    questions: [
      "Which dishes do I get free delivery on?",
      "How does the 30% extra off work?",
      "Can I combine Gold offers with coupons?",
    ],
  },
  {
    section: "General",
    questions: [
      "How do I apply my Gold membership coupon?",
      "What happens when my Gold membership expires?",
      "Can I transfer my Gold membership?",
    ],
  },
  {
    section: "Billing",
    questions: [
      "How do I cancel my Gold auto-renewal?",
      "Is there a refund policy for Gold?",
    ],
  },
];

export default function Gold() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] fade-in pb-6">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[var(--bg-primary)] border-b border-white/5 px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-white/60"><ChevronLeft size={22} /></button>
          <h1 className="text-base font-semibold text-white">Tanmatra Gold</h1>
        </div>
      </div>

      {/* Gold Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#2a2520] to-[var(--bg-primary)] px-6 pt-8 pb-6">
        {/* Decorative pattern */}
        <div className="absolute top-4 right-4 w-24 h-24 opacity-5">
          <div className="grid grid-cols-3 gap-1">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="w-7 h-7 border border-[#D4AF37] rotate-45" />
            ))}
          </div>
        </div>

        <div className="text-center">
          <p className="text-lg font-bold text-white/20 tracking-wider">tanmatra</p>
          <h2 className="text-4xl font-black text-[#D4AF37] mt-1 tracking-tight">
            G<span className="inline-flex items-center justify-center"><Crown size={28} className="mb-1" /></span>LD
          </h2>
          <p className="text-[10px] text-[#D4AF37]/60 uppercase tracking-[0.3em] mt-2">
            Member till 28th May 2026
          </p>
          <p className="text-xs text-[#D4AF37]/40 mt-1">\u2B50 FEEL THE PRIVILEGE \u2B50</p>
        </div>
      </div>

      {/* Savings Tracker */}
      <div className="mx-4 p-4 bg-[var(--bg-secondary)] border border-white/5 rounded-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
            <Bike size={18} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">On delivery</p>
            <p className="text-xs text-white/40">Used 47 times</p>
          </div>
          <p className="text-lg font-bold text-[#D4AF37]">₹2,450</p>
        </div>

        <p className="text-[10px] text-white/40 uppercase tracking-wider text-center mb-3">
          \u2B50 Savings till now \u2B50
        </p>

        {/* Progress bar */}
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full w-[60%] bg-gradient-to-r from-[#D4AF37] to-[#D4AF37]/60 rounded-full" />
        </div>
      </div>

      {/* Current Benefits */}
      <div className="px-4 mt-6">
        <p className="text-[10px] text-[#D4AF37]/60 uppercase tracking-[0.3em] text-center mb-4">
          \u2B50 Current Benefits \u2B50
        </p>
        <div className="space-y-3">
          {benefits.map((b) => (
            <div key={b.title} className="flex gap-3 p-3 bg-[var(--bg-secondary)] border border-white/5 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
                <b.icon size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{b.title}</h3>
                <p className="text-xs text-white/40 mt-1 leading-relaxed">{b.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coupon Code */}
      <div className="mx-4 mt-4 p-1 border border-dashed border-[#D4AF37]/30 rounded-xl">
        <div className="flex items-center gap-2 px-3 py-2">
          <input
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Have a coupon code?"
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
          />
          <button className="text-sm font-semibold text-[#D4AF37] px-3 py-1">Apply</button>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="px-4 mt-6 space-y-4">
        {faqs.map((section) => (
          <div key={section.section}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-4 bg-red-500 rounded-full" />
              <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider">{section.section}</h3>
            </div>
            <div className="bg-[var(--bg-secondary)] border border-white/5 rounded-xl overflow-hidden">
              {section.questions.map((q, i) => (
                <button
                  key={q}
                  onClick={() => setOpenFaq(openFaq === q ? null : q)}
                  className={`w-full text-left px-4 py-3.5 flex items-center justify-between ${
                    i < section.questions.length - 1 ? "border-b border-white/5" : ""
                  }`}
                >
                  <span className="text-sm text-white pr-4">{q}</span>
                  <ChevronDown
                    size={14}
                    className={`text-white/30 shrink-0 transition-transform ${openFaq === q ? "rotate-180" : ""}`}
                  />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Support Links */}
      <div className="px-4 mt-4 space-y-2">
        <button className="w-full flex items-center gap-3 p-4 bg-[var(--bg-secondary)] border border-white/5 rounded-xl text-left">
          <HelpCircle size={18} className="text-white/40" />
          <span className="flex-1 text-sm text-white">Frequently asked questions</span>
        </button>
        <button className="w-full flex items-center gap-3 p-4 bg-[var(--bg-secondary)] border border-white/5 rounded-xl text-left">
          <FileText size={18} className="text-white/40" />
          <span className="flex-1 text-sm text-white">Terms and Conditions</span>
        </button>
        <button
          onClick={() => navigate("/support")}
          className="w-full flex items-center gap-3 p-4 bg-[var(--bg-secondary)] border border-white/5 rounded-xl text-left"
        >
          <MessageCircle size={18} className="text-[#D4AF37]" />
          <span className="flex-1 text-sm text-white">Need help? Chat with us</span>
        </button>
      </div>
    </div>
  );
}
