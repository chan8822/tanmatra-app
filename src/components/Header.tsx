import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Bell, Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export function Header({ title, backTo }: { title: string; backTo?: string }) {
  const [cartCount, setCartCount] = useState(0);
  const [notifCount, setNotifCount] = useState(0);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const update = () => {
      const cart = JSON.parse(localStorage.getItem("tanmatra_cart") || "[]");
      setCartCount(cart.reduce((s: number, c: any) => s + (c.qty || 1), 0));
      const notifs = JSON.parse(localStorage.getItem("tanmatra_notifications") || "[]");
      setNotifCount(notifs.filter((n: any) => !n.read).length);
    };
    update();
    window.addEventListener("storage", update);
    return () => window.removeEventListener("storage", update);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#0c0f0f]/90 backdrop-blur-md border-b border-white/5">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {backTo && (
            <Link to={backTo} className="p-1.5 -ml-1.5 text-white/60 hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </Link>
          )}
          <h1 className="text-base font-semibold tracking-tight text-white">{title}</h1>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 text-white/50 hover:text-[#D4AF37] transition-colors"
            title={theme === "dark" ? "Switch to light" : "Switch to dark"}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link to="/notifications" className="relative p-2 text-white/50 hover:text-white transition-colors">
            <Bell size={16} />
            {notifCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                {notifCount > 9 ? "9+" : notifCount}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative p-2 text-white/50 hover:text-white transition-colors">
            <ShoppingCart size={16} />
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#D4AF37] rounded-full text-[9px] font-bold text-[#0c0f0f] flex items-center justify-center">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
