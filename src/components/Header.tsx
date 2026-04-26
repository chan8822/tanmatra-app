import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Bell } from "lucide-react";

export function Header({ title, backTo }: { title: string; backTo?: string }) {
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [notifCount, setNotifCount] = useState(0);

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

  const showCart = !location.pathname.includes("/cart") && !location.pathname.includes("/checkout") && !location.pathname.includes("/admin");

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
        <div className="flex items-center gap-2">
          <Link to="/notifications" className="relative p-1.5 text-white/60 hover:text-white transition-colors">
            <Bell size={18} />
            {notifCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                {notifCount > 9 ? "9+" : notifCount}
              </span>
            )}
          </Link>
          {showCart && (
            <Link to="/cart" className="relative p-1.5 text-white/60 hover:text-white transition-colors">
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#D4AF37] rounded-full text-[9px] font-bold text-[#0c0f0f] flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
