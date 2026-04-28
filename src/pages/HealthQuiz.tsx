import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, CheckCircle, Activity, Brain, Dumbbell, Salad, Heart } from "lucide-react";

interface Question {
  id: number;
  question: string;
  icon: any;
  options: { label: string; segment: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "What is your primary health goal?",
    icon: Activity,
    options: [
      { label: "Build muscle & strength", segment: "athlete" },
      { label: "Lose weight healthily", segment: "wellness" },
      { label: "Manage a health condition", segment: "senior" },
      { label: "Eat better daily", segment: "everyday" },
    ],
  },
  {
    id: 2,
    question: "How active are you?",
    icon: Dumbbell,
    options: [
      { label: "Daily gym/sports", segment: "athlete" },
      { label: "Walk 3-4x a week", segment: "wellness" },
      { label: "Light activity only", segment: "senior" },
      { label: "Mostly sedentary", segment: "everyday" },
    ],
  },
  {
    id: 3,
    question: "Any dietary preference?",
    icon: Salad,
    options: [
      { label: "High protein", segment: "athlete" },
      { label: "Low calorie", segment: "wellness" },
      { label: "Low sodium/sugar", segment: "senior" },
      { label: "No preference", segment: "everyday" },
    ],
  },
  {
    id: 4,
    question: "How many meals do you eat out?",
    icon: Brain,
    options: [
      { label: "None — I cook", segment: "everyday" },
      { label: "1-2 per week", segment: "wellness" },
      { label: "3-5 per week", segment: "athlete" },
      { label: "Almost daily", segment: "senior" },
    ],
  },
];

const SEGMENT_RESULTS: Record<string, { title: string; desc: string; dishes: string[] }> = {
  athlete: {
    title: "Athlete Track",
    desc: "High-protein, performance-focused meals for active lifestyles.",
    dishes: ["Grilled Chicken Protein Bowl", "Paneer Tikka Wrap", "Egg White Omelette"],
  },
  wellness: {
    title: "Wellness Track",
    desc: "Balanced, nutrient-dense meals for holistic health.",
    dishes: ["Mediterranean Salad", "Detox Green Soup", "Quinoa Buddha Bowl"],
  },
  senior: {
    title: "Senior Care Track",
    desc: "Low-sodium, easy-digest meals with essential nutrients.",
    dishes: ["Khichdi with Vegetables", "Dal Soup", "Soft Paneer Curry"],
  },
  everyday: {
    title: "Everyday Balance",
    desc: "Wholesome, affordable meals for daily nutrition.",
    dishes: ["Veg Thali", "Chicken Wrap", "Dal Roti Combo"],
  },
};

export default function HealthQuizPage() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const selectOption = (segment: string) => {
    const next = [...answers, segment];
    setAnswers(next);
    if (current < QUESTIONS.length - 1) {
      setCurrent(current + 1);
    } else {
      setShowResult(true);
      // Save segment to localStorage
      const counts: Record<string, number> = {};
      next.forEach((s) => { counts[s] = (counts[s] || 0) + 1; });
      const topSegment = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "everyday";
      localStorage.setItem("tanmatra_segment", topSegment);
    }
  };

  if (showResult) {
    const counts: Record<string, number> = {};
    answers.forEach((s) => { counts[s] = (counts[s] || 0) + 1; });
    const topSegment = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "everyday";
    const result = SEGMENT_RESULTS[topSegment];

    return (
      <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center px-6 text-center fade-in pb-6">
        <div className="w-20 h-20 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-4">
          <Heart size={36} className="text-[#D4AF37]" />
        </div>
        <p className="text-xs text-[#D4AF37] uppercase tracking-wider mb-2">Your Personalized Track</p>
        <h2 className="text-2xl font-bold">{result.title}</h2>
        <p className="text-sm text-white/60 mt-2 leading-relaxed">{result.desc}</p>

        <div className="w-full max-w-xs mt-6 bg-[#1a1c1c] border border-white/5 rounded-xl p-4 text-left">
          <p className="text-xs font-semibold text-white/60 mb-3 uppercase tracking-wider">Recommended for you</p>
          {result.dishes.map((d) => (
            <div key={d} className="flex items-center gap-2 py-2 border-b border-white/5 last:border-0">
              <CheckCircle size={14} className="text-green-400 shrink-0" />
              <span className="text-sm text-white">{d}</span>
            </div>
          ))}
        </div>

        <div className="w-full max-w-xs mt-6 space-y-3">
          <button onClick={() => navigate("/menu")} className="w-full py-3 bg-[#D4AF37] text-[#0c0f0f] font-bold rounded-xl flex items-center justify-center gap-2">
            Explore Your Menu <ChevronRight size={16} />
          </button>
          <button onClick={() => navigate("/subscriptions")} className="w-full py-3 bg-white/5 text-white border border-white/10 rounded-xl text-sm">
            View Meal Plans
          </button>
          <button onClick={() => { setShowResult(false); setCurrent(0); setAnswers([]); }} className="w-full text-xs text-white/30 py-2">
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  const q = QUESTIONS[current];
  const QIcon = q.icon;

  return (
    <div className="min-h-screen bg-[#121212] text-white fade-in flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#121212] border-b border-white/5 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-white/60"><ChevronLeft size={22} /></button>
        <div className="flex-1">
          <h1 className="text-base font-semibold">Health Quiz</h1>
          <p className="text-[10px] text-white/40">Question {current + 1} of {QUESTIONS.length}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 pt-4">
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-[#D4AF37] rounded-full transition-all" style={{ width: `${((current + 1) / QUESTIONS.length) * 100}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-4">
          <QIcon size={28} className="text-[#D4AF37]" />
        </div>
        <h2 className="text-lg font-bold text-center leading-snug">{q.question}</h2>

        <div className="w-full max-w-xs mt-6 space-y-2.5">
          {q.options.map((opt) => (
            <button
              key={opt.label}
              onClick={() => selectOption(opt.segment)}
              className="w-full p-3.5 bg-[#1a1c1c] border border-white/5 rounded-xl text-left text-sm text-white/80 hover:bg-white/5 hover:border-[#D4AF37]/30 active:scale-[0.98] transition-all"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
