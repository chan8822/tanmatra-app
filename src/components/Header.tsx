import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, ChevronLeft } from "lucide-react";

export function Header({ title, backTo }: { title: string; backTo?: string }) {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Get cart count from localStorage (sync with cart page)
    const sync = () => {
      const cart = JSON.parse(localStorage.getItem("tanmatra_cart") || "[]");
      setCartCount(cart.reduce((s: number, c: any) => s + c.qty, 0));
    };
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  return (
    <div className="sticky top-0 z-30 bg-[rgba(12,15,15,0.92)] backdrop-blur-md border-b border-white/5 px-4 py-3">
      <div className="flex items-center gap-3">
        {backTo ? (
          <button onClick={() => navigate(backTo)} className="text-[#D4AF37] text-xl">
            <ChevronLeft size={24} />
          </button>
        ) : (
          <span className="w-6" />
        )}
        <h1 className="font-serif text-lg text-[#D4AF37] font-semibold">{title}</h1>
        <Link to="/cart" className="ml-auto relative">
          <ShoppingCart size={22} className="text-white/60" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-[#D4AF37] text-[#0c0f0f] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
}
