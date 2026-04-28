import { Link, useLocation } from "react-router-dom";
import { Home, Salad, ShoppingCart, User } from "lucide-react";
import { useState, useEffect } from "react";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/menu", label: "Wellness", icon: Salad },
  { to: "/basket", label: "Cart", icon: ShoppingCart, showBadge: true },
  { to: "/profile", label: "Profile", icon: User },
];

function getCartCount(): number {
  try {
    const cart = JSON.parse(localStorage.getItem("tanmatra_cart") || "null") || { items: [] };
    return (cart.items || []).reduce((s: number, i: any) => s + (i.quantity || 1), 0);
  } catch { return 0; }
}

export function BottomNav() {
  const location = useLocation();
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(getCartCount());
    const handler = () => setCount(getCartCount());
    window.addEventListener("cartUpdated", handler);
    return () => window.removeEventListener("cartUpdated", handler);
  }, []);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#121212]/95 backdrop-blur-md border-t border-[#D4AF37]/20">
      <div className="max-w-[450px] mx-auto flex items-center justify-around py-1.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link key={item.to} to={item.to} className={`relative flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-lg transition-colors ${isActive ? "text-[#D4AF37]" : "text-white/40 hover:text-white/60"}`}>
              <div className="relative">
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                {item.showBadge && count > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">{count > 9 ? "9+" : count}</span>
                )}
              </div>
              <span className="text-[9px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
