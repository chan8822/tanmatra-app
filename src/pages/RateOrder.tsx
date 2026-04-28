import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Star, Bike, UtensilsCrossed, CheckCircle } from "lucide-react";

export default function RateOrderPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order") || "TAN-1001";

  const [foodRating, setFoodRating] = useState(0);
  const [riderRating, setRiderRating] = useState(0);
  const [foodReview, setFoodReview] = useState("");
  const [riderReview, setRiderReview] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const foodTags = ["Great Taste", "Fresh", "Good Portions", "Well Packed", "Timely Delivery", "Value for Money"];
  const riderTags = ["Polite", "On Time", "Careful Handling", "Followed Instructions"];

  const toggleTag = (tag: string) => {
    setTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  };

  const submit = () => {
    const reviews = JSON.parse(localStorage.getItem("tanmatra_reviews") || "[]");
    reviews.push({
      order_id: orderId,
      food_rating: foodRating,
      rider_rating: riderRating,
      food_review: foodReview,
      rider_review: riderReview,
      tags,
      created_at: new Date().toISOString(),
    });
    localStorage.setItem("tanmatra_reviews", JSON.stringify(reviews));
    setSubmitted(true);
  };

  const StarInput = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} onClick={() => onChange(n)} className="p-0.5">
          <Star size={24} className={n <= value ? "fill-[#D4AF37] text-[#D4AF37]" : "text-white/20"} />
        </button>
      ))}
    </div>
  );

  if (submitted) {
    return (
      <div className="fade-in min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <CheckCircle size={48} className="text-green-400 mb-4" />
        <h2 className="text-lg font-semibold text-white mb-2">Thank You!</h2>
        <p className="text-sm text-white/50 mb-6">Your feedback helps us serve you better.</p>
        <Link to="/orders" className="px-6 py-3 bg-[#D4AF37] text-[#0c0f0f] rounded-xl text-sm font-semibold">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="fade-in pb-10">
      <Header title="Rate Your Order" backTo="/orders" />

      <div className="px-4 py-4 space-y-5">
        {/* Order info */}
        <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4">
          <p className="text-xs text-white/30">Order #{orderId}</p>
          <p className="text-sm text-white/70 mt-1">How was your experience?</p>
        </div>

        {/* Food Rating */}
        <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <UtensilsCrossed size={16} className="text-[#D4AF37]" />
            <h3 className="text-sm font-semibold text-white">Food Quality</h3>
          </div>
          <StarInput value={foodRating} onChange={setFoodRating} />
          <textarea
            value={foodReview}
            onChange={(e) => setFoodReview(e.target.value)}
            placeholder="How was the taste, freshness, packaging?"
            className="w-full px-3 py-2 bg-[#0c0f0f] border border-white/10 rounded-lg text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]/50 resize-none h-16"
          />
        </div>

        {/* Rider Rating */}
        <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Bike size={16} className="text-[#D4AF37]" />
            <h3 className="text-sm font-semibold text-white">Delivery Experience</h3>
          </div>
          <StarInput value={riderRating} onChange={setRiderRating} />
          <textarea
            value={riderReview}
            onChange={(e) => setRiderReview(e.target.value)}
            placeholder="Was the rider polite? On time? Food intact?"
            className="w-full px-3 py-2 bg-[#0c0f0f] border border-white/10 rounded-lg text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]/50 resize-none h-16"
          />
        </div>

        {/* Tags */}
        <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-white mb-2">Quick Tags</h3>
          <div className="flex flex-wrap gap-2">
            {[...foodTags, ...riderTags].map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-2.5 py-1 rounded-full text-[10px] border ${tags.includes(tag) ? "bg-[#D4AF37]/15 border-[#D4AF37]/50 text-[#D4AF37]" : "bg-[#0c0f0f] border-white/10 text-white/40"}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={submit}
          disabled={foodRating === 0 || riderRating === 0}
          className="w-full py-3.5 bg-[#D4AF37] text-[#0c0f0f] rounded-xl font-semibold text-sm disabled:opacity-40 active:scale-[0.98] transition-transform"
        >
          Submit Review
        </button>
      </div>
    </div>
  );
}
