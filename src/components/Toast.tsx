import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, X, Info } from "lucide-react";

interface Toast {
  id: number;
  type: "success" | "error" | "info";
  message: string;
}

let toastId = 0;
const listeners: ((toasts: Toast[]) => void)[] = [];
let toasts: Toast[] = [];

function notify() {
  listeners.forEach((l) => l([...toasts]));
}

export function showToast(type: "success" | "error" | "info", message: string) {
  const id = ++toastId;
  toasts = [...toasts, { id, type, message }];
  notify();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  }, 3000);
}

export function ToastContainer() {
  const [visible, setVisible] = useState<Toast[]>([]);

  useEffect(() => {
    const handler = (t: Toast[]) => setVisible(t);
    listeners.push(handler);
    return () => {
      const idx = listeners.indexOf(handler);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  if (visible.length === 0) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-[300] flex flex-col items-center gap-2 pointer-events-none px-4">
      {visible.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium max-w-sm animate-in fade-in slide-in-from-top-2 ${
            t.type === "success" ? "bg-green-500/90 text-white" :
            t.type === "error" ? "bg-red-500/90 text-white" :
            "bg-[#D4AF37]/90 text-[#0c0f0f]"
          }`}
        >
          {t.type === "success" ? <CheckCircle size={16} /> : t.type === "error" ? <AlertCircle size={16} /> : <Info size={16} />}
          <span>{t.message}</span>
          <button onClick={() => { toasts = toasts.filter((x) => x.id !== t.id); notify(); }} className="ml-2 opacity-60 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
