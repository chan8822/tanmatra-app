import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Brain, ChevronRight, CheckCircle, Target, Heart, Zap, Salad, RotateCcw } from "lucide-react";
import { ROUTES } from "@/lib/routes";

const questions = [
  {
    q: "What's your primary health goal?",
    options: [
      { label: "Lose weight", icon: Target, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
      { label: "Build muscle", icon: Zap, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
      { label: "Eat healthier", icon: Salad, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
      { label: "Manage a condition", icon: Heart, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
    ],
  },
  {
    q: "How active are you daily?",
    options: [
      { label: "Sedentary", icon: Target, color: "text-white/50", bg: "bg-white/5", border: "border-white/10" },
      { label: "Light activity", icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
      { label: "Moderate exercise", icon: Salad, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
      { label: "Very active", icon: Heart, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
    ],
  },
  {
    q: "Any dietary preferences?",
    options: [
      { label: "No restrictions", icon: Target, color: "text-white/50", bg: "bg-white/5", border: "border-white/10" },
      { label: "Vegetarian", icon: Salad, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
      { label: "Low carb", icon: Zap, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
      { label: "High protein", icon: Heart, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
    ],
  },
  {
    q: "How many meals do you eat per day?",
    options: [
      { label: "2 meals", icon: Target, color: "text-white/50", bg: "bg-white/5", border: "border-white/10" },
      { label: "3 meals", icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
      { label: "3 + snacks", icon: Salad, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
      { label: "5+ small meals", icon: Heart, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
    ],
  },
];

const segments: Record<string, { title: string; desc: string; recs: string[] }> = {
  "Lose weight": { title: "Weight Loss Track", desc: "Calorie-controlled, high-fiber meals to help you shed pounds sustainably.", recs: ["Grilled Chicken Salad", "Quinoa Bowl", "Detox Smoothie", "Zucchini Noodles"] },
  "Build muscle": { title: "Muscle Gain Track", desc: "High-protein, nutrient-dense meals to fuel your workouts and recovery.", recs: ["Protein Wrap", "Grilled Chicken Bowl", "Egg White Omelette", "Greek Yogurt Parfait"] },
  "Eat healthier": { title: "Balanced Wellness Track", desc: "Nutrient-rich, whole-food meals for overall health and vitality.", recs: ["Rainbow Salad", "Grilled Fish", "Mixed Veg Stir-fry", "Fruit Bowl"] },
  "Manage a condition": { title: "Therapeutic Nutrition Track", desc: "Specialized meals designed for your specific health condition.", recs: ["Low-Sodium Soup", "Diabetic-Friendly Bowl", "Heart-Healthy Salad", "Anti-Inflammatory Smoothie"] },
};

export default function HealthQuizPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const select = (label: string) => {
    const next = [...answers, label];
    setAnswers(next);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setStep(step + 1);
    }
  };

  const result = segments[answers[0]] || segments["Eat healthier"];

  if (step >= questions.length) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white px-4 py-6 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="text-white/60"><ArrowLeft size={22} /></button>
          <h1 className="text-base font-semibold">Your Plan</h1>
        </div>

        <div className="card p-5 text-center mb-4">
          <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle size={28} className="text-[#D4AF37]" />
          </div>
          <h2 className="text-lg font-bold mb-1">{result.title}</h2>
          <p className="text-xs text-white/40">{result.desc}</p>
        </div>

        <div className="card p-4 mb-4">
          <h3 className="text-sm font-semibold mb-3">Recommended For You</h3>
          <div className="space-y-2">
            {result.recs.map((r) => (
              <div key={r} className="flex items-center gap-2 p-2 bg-[#141414] rounded-lg">
                <Salad size={14} className="text-green-400" />
                <span className="text-sm">{r}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => { setStep(0); setAnswers([]); }} className="flex-1 btn-outline text-sm rounded-xl flex items-center justify-center gap-2">
            <RotateCcw size={14} /> Retake
          </button>
          <button onClick={() => navigate(ROUTES.menu)} className="flex-1 btn-primary text-sm rounded-xl">Browse Menu</button>
        </div>
      </div>
    );
  }

  const q = questions[step];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => step > 0 ? setStep(step - 1) : navigate(-1)} className="text-white/60"><ArrowLeft size={22} /></button>
        <h1 className="text-base font-semibold">Health Quiz</h1>
        <span className="ml-auto text-xs text-white/40">{step + 1}/{questions.length}</span>
      </div>

      {/* Progress */}
      <div className="h-1 bg-white/10 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-[#D4AF37] rounded-full transition-all" style={{ width: `${((step + 1) / questions.length) * 100}%` }} />
      </div>

      <h2 className="text-lg font-bold mb-4">{q.q}</h2>

      <div className="space-y-2.5">
        {q.options.map((opt) => (
          <button key={opt.label} onClick={() => select(opt.label)} className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-colors ${opt.bg} ${opt.border} hover:brightness-110 active:scale-[0.98]`}>
            <div className={`w-10 h-10 rounded-lg ${opt.bg} flex items-center justify-center`}>
              <opt.icon size={18} className={opt.color} />
            </div>
            <span className="text-sm font-medium">{opt.label}</span>
            <ChevronRight size={14} className="text-white/20 ml-auto" />
          </button>
        ))}
      </div>
    </div>
  );
}
