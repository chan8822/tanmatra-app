import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface SectionHeaderProps {
  title: string;
  seeAllTo?: string;
  subtext?: string;
}

export function SectionHeader({ title, seeAllTo, subtext }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 mb-3">
      <div>
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-red-500 rounded-full" />
          <h2 className="text-xs font-bold text-white/60 uppercase tracking-[0.15em]">{title}</h2>
        </div>
        {subtext && <p className="text-[10px] text-white/30 ml-3 mt-0.5">{subtext}</p>}
      </div>
      {seeAllTo && (
        <Link to={seeAllTo} className="flex items-center gap-0.5 text-[11px] text-[#D4AF37] font-medium">
          See all <ChevronRight size={12} />
        </Link>
      )}
    </div>
  );
}
