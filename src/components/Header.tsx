import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Bell } from "lucide-react";
import { cartStore } from "@/lib/store";
import { ROUTES } from "@/lib/routes";

export function Header({ title, back }: { title: string; back?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(cartStore.getCount());
    return cartStore.subscribe(() => setCount(cartStore.getCount()));
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {back && (
            <Link to={back} className="p-1 -ml-1 text-white/60 hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </Link>
          )}
          <h1 className="text-base font-semibold tracking-tight">{title}</h1>
        </div>
        <div className="flex items-center gap-1">
          <Link to={ROUTES.notifications} className="relative p-2 text-white/40 hover:text-white transition-colors">
            <Bell size={16} />
          </Link>
          <Link to={ROUTES.cart} className="relative p-2 text-white/40 hover:text-white transition-colors">
            <ShoppingCart size={16} />
            {count > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 bg-[#E23744] rounded-full text-[9px] font-bold text-white flex items-center justify-center px-1">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
