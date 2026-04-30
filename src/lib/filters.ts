export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category_id?: string;
  is_vegetarian?: boolean;
  rd_verified?: boolean;
  prep_time?: number;
  discount?: number;
  protein?: number;
  tags?: string[];
  calories?: number;
  [key: string]: any;
}

export function normalizeItem(item: any): MenuItem {
  return {
    ...item,
    is_vegetarian: !!item.is_vegetarian,
    rd_verified: !!item.rd_verified || !!item.is_rd_verified,
    prep_time: item.prep_time ?? 30,
    discount: item.discount ?? 0,
    protein: item.protein ?? 0,
    tags: Array.isArray(item.tags) ? item.tags : [],
    price: item.price ?? 0,
    calories: item.calories ?? 0,
  };
}

export const TILE_FILTERS: Record<string, (i: MenuItem) => boolean> = {
  offers: (i) => (i.discount ?? 0) > 0,
  quick: (i) => (i.prep_time ?? 30) <= 15,
  wellness: (i) => (i.tags || []).some((t) => ["Low Cal", "Keto", "Vit C", "Immunity", "Detox", "Fiber+", "Protein+", "Balanced"].includes(t)),
  rdverified: (i) => !!(i.rd_verified),
  family: (i) => i.price > 200,
  segment: (i) => (i.protein ?? 0) > 15,
};

export const TILE_META: Record<string, {
  title: string;
  subtitle: string;
  iconName: string;
  gradient: string;
  border: string;
  text: string;
}> = {
  offers: { title: "All Offers", subtitle: "Exclusive deals on RD-verified meals", iconName: "gift", gradient: "from-amber-500/25 to-amber-500/5", border: "border-amber-500/30", text: "text-amber-400" },
  quick: { title: "Quick Meals", subtitle: "Ready in under 15 minutes", iconName: "zap", gradient: "from-orange-500/25 to-orange-500/5", border: "border-orange-500/30", text: "text-orange-400" },
  wellness: { title: "Wellness Picks", subtitle: "Nutrient-dense, health-focused meals", iconName: "salad", gradient: "from-green-500/25 to-green-500/5", border: "border-green-500/30", text: "text-green-400" },
  rdverified: { title: "RD Verified", subtitle: "Approved by registered dietitians", iconName: "shield", gradient: "from-blue-500/25 to-blue-500/5", border: "border-blue-500/30", text: "text-blue-400" },
  family: { title: "Family Meals", subtitle: "Shareable portions for 2-4 people", iconName: "users", gradient: "from-purple-500/25 to-purple-500/5", border: "border-purple-500/30", text: "text-purple-400" },
  segment: { title: "Your Segment", subtitle: "High-protein fitness-focused picks", iconName: "target", gradient: "from-red-500/25 to-red-500/5", border: "border-red-500/30", text: "text-red-400" },
};

export function applyFilter(items: MenuItem[], filterName: string | null): MenuItem[] {
  if (!filterName || !TILE_FILTERS[filterName]) return items;
  return items.filter(TILE_FILTERS[filterName]);
}
