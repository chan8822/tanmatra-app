import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { Send, Phone, Clock } from "lucide-react";

const QUICK_TOPICS = [
  { label: "Order Delay", response: "I understand your concern about the delivery time. Let me check the live tracking for your order and update you immediately." },
  { label: "Wrong Item", response: "I'm sorry for the mix-up. Please share your order ID and a photo of what you received. We'll resend the correct item within 30 minutes." },
  { label: "Refund Status", response: "Refunds typically process within 5-7 business days to your original payment method. Would you like me to escalate this for faster processing?" },
  { label: "Subscription", response: "I can help you pause, modify, or cancel your subscription. What would you like to do?" },
  { label: "Nutrition Info", response: "All our dishes have RD-verified nutrition cards. I can send you the detailed macro breakdown for any dish you've ordered." },
  { label: "Speak to Human", response: "Connecting you to a support specialist now. Expected wait time: 2 minutes. Please hold..." },
];

export default function SupportPage() {
  const [messages, setMessages] = useState<{ from: "user" | "bot"; text: string; time: string }[]>([
    { from: "bot", text: "Hello! I'm your Tanmatra support assistant. How can I help you today?", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((prev) => [...prev, { from: "user", text, time }]);
    setInput("");
    setTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const found = QUICK_TOPICS.find((t) => text.toLowerCase().includes(t.label.toLowerCase()));
      const response = found?.response || "Thanks for reaching out. I've noted your concern. A support specialist will follow up within 15 minutes. Is there anything else I can help with?";
      setMessages((prev) => [...prev, { from: "bot", text: response, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
      setTyping(false);
    }, 1500);
  };

  return (
    <div className="fade-in flex flex-col h-screen pb-20">
      <Header title="Support" backTo="/" />

      {/* Quick topics */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar border-b border-white/5">
        {QUICK_TOPICS.slice(0, 4).map((t) => (
          <button
            key={t.label}
            onClick={() => sendMessage(t.label)}
            className="shrink-0 px-3 py-1.5 bg-[#1a1c1c] border border-white/10 rounded-full text-[10px] text-white/60"
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] p-3 rounded-xl text-xs ${
              m.from === "user"
                ? "bg-[#D4AF37] text-[#0c0f0f] rounded-br-none"
                : "bg-[#1a1c1c] border border-white/5 text-white/80 rounded-bl-none"
            }`}>
              <p className="leading-relaxed">{m.text}</p>
              <p className={`text-[9px] mt-1 ${m.from === "user" ? "text-[#0c0f0f]/50" : "text-white/30"}`}>{m.time}</p>
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="bg-[#1a1c1c] border border-white/5 rounded-xl rounded-bl-none p-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0c0f0f] border-t border-white/5 z-40">
        <div className="flex gap-2 max-w-[450px] mx-auto">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2.5 bg-[#1a1c1c] border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]/50"
          />
          <button onClick={() => sendMessage(input)} className="p-2.5 bg-[#D4AF37] text-[#0c0f0f] rounded-lg">
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Contact options */}
      <div className="px-4 py-2 flex gap-2 border-t border-white/5">
        <a href="tel:+919876543210" className="flex-1 py-2 bg-[#1a1c1c] border border-white/5 rounded-lg text-xs text-white/60 flex items-center justify-center gap-1.5">
          <Phone size={12} /> Call Us
        </a>
        <div className="flex-1 py-2 bg-[#1a1c1c] border border-white/5 rounded-lg text-xs text-white/60 flex items-center justify-center gap-1.5">
          <Clock size={12} /> 9 AM - 11 PM
        </div>
      </div>
    </div>
  );
}
