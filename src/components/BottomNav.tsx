import { Link, useLocation } from "react-router-dom";
import { Home, Salad, ShoppingCart, User } from "lucide-react";
import { useState, useEffect } from "react";
import { cartStore } from "@/lib/store";
import { ROUTES } from "@/lib/routes";

const tabs = [
  { to: ROUTES.home, label: "Home", icon: Home },
  { to: ROUTES.menu, label: "Menu", icon: Salad },
  { to: ROUTES.cart, label: "Cart", icon: ShoppingCart, badge: true },
  { to: ROUTES.profile, label: "Profile", icon: User },
];

export function BottomNav() {
  const { pathname } = useLocation();
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(cartStore.getCount());
    return cartStore.subscribe(() => setCount(cartStore.getCount()));
  }, []);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[9999] bg-[#0a0a0a]/95 backdrop-blur-md border-t border-white/5">
      <div className="max-w-lg mx-auto flex items-center justify-around py-1">
        {tabs.map((t) => {
          const active = pathname === t.to;
          return (
            <Link key={t.to} to={t.to} className={`relative flex flex-col items-center gap-0.5 px-5 py-2 rounded-lg transition-colors ${active ? "text-[#D4AF37]" : "text-white/30 hover:text-white/50"}`}>
              <div className="relative">
                <t.icon size={20} strokeWidth={active ? 2.5 : 1.5} />
                {t.badge && count > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[14px] h-3.5 bg-[#E23744] text-white text-[8px] font-bold rounded-full flex items-center justify-center px-0.5">{count}</span>
                )}
              </div>
              <span className="text-[9px] font-medium">{t.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
