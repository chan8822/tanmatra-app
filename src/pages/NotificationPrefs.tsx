import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Mail, Bell, MessageCircle } from "lucide-react";

interface Channel {
  icon: any;
  label: string;
  enabled: boolean;
}

interface NotificationCategory {
  id: string;
  title: string;
  description: string;
  channels: Channel[];
}

export default function NotificationPrefs() {
  const navigate = useNavigate();
  const [enableAll, setEnableAll] = useState(true);
  const [categories, setCategories] = useState<NotificationCategory[]>([
    {
      id: "newsletters",
      title: "Newsletters",
      description: "Receive newsletter to stay up-to-date with healthy eating tips and new menu items",
      channels: [
        { icon: Mail, label: "Email", enabled: true },
      ],
    },
    {
      id: "promos",
      title: "Promos and offers",
      description: "Receive updates about coupons, promotions and money-saving offers",
      channels: [
        { icon: Mail, label: "Email", enabled: true },
        { icon: Bell, label: "Push", enabled: true },
        { icon: MessageCircle, label: "WhatsApp", enabled: false },
      ],
    },
    {
      id: "orders",
      title: "Orders and purchases",
      description: "Receive updates related to your order status, memberships, and more",
      channels: [
        { icon: Mail, label: "Email", enabled: true },
        { icon: Bell, label: "Push", enabled: true },
        { icon: MessageCircle, label: "WhatsApp", enabled: false },
      ],
    },
    {
      id: "updates",
      title: "Important updates",
      description: "Receive important updates related to your account",
      channels: [
        { icon: Mail, label: "Email", enabled: true },
      ],
    },
  ]);

  const toggleChannel = (catIdx: number, chIdx: number) => {
    setCategories((prev) => {
      const next = [...prev];
      next[catIdx] = { ...next[catIdx], channels: [...next[catIdx].channels] };
      next[catIdx].channels[chIdx] = {
        ...next[catIdx].channels[chIdx],
        enabled: !next[catIdx].channels[chIdx].enabled,
      };
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] fade-in pb-6">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[var(--bg-primary)] border-b border-white/5 px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-white/60"><ChevronLeft size={22} /></button>
          <h1 className="text-base font-semibold text-white">Notification Preferences</h1>
        </div>
      </div>

      {/* Enable All */}
      <div className="flex items-center justify-between px-4 py-4">
        <div>
          <p className="text-base font-semibold text-white">Enable all</p>
          <p className="text-xs text-white/40 mt-0.5">Activate all notifications</p>
        </div>
        <button
          onClick={() => setEnableAll(!enableAll)}
          className={`w-12 h-6 rounded-full transition-colors relative ${enableAll ? "bg-red-500" : "bg-white/20"}`}
        >
          <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${enableAll ? "right-0.5" : "left-0.5"}`} />
        </button>
      </div>

      {/* Categories */}
      {categories.map((cat, catIdx) => (
        <div key={cat.id} className="mt-4 border-t border-white/5 pt-4">
          <div className="px-4 mb-3">
            <h3 className="text-sm font-semibold text-white">{cat.title}</h3>
            <p className="text-xs text-white/40 mt-1 leading-relaxed">{cat.description}</p>
          </div>
          <div className="px-4 space-y-1">
            {cat.channels.map((ch, chIdx) => (
              <div key={ch.label} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <ch.icon size={18} className="text-white/40" />
                  <span className="text-sm text-white">{ch.label}</span>
                </div>
                <button
                  onClick={() => toggleChannel(catIdx, chIdx)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    ch.enabled && enableAll ? "bg-red-500" : "bg-white/20"
                  }`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                    ch.enabled && enableAll ? "right-0.5" : "left-0.5"
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Tanmatra branding */}
      <div className="flex justify-center mt-8 mb-4">
        <span className="text-lg font-bold text-white/10">tanmatra</span>
      </div>

      {/* Save Button */}
      <div className="px-4">
        <button className="w-full py-3.5 rounded-xl bg-[#D4AF37] text-sm font-semibold text-[#0c0f0f]">
          Save Changes
        </button>
      </div>
    </div>
  );
}
