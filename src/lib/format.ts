const C = "\u20B9";

export function p(n: number): string {
  return C + Math.round(n).toLocaleString("en-IN");
}

export function saveVsAggregator(subtotal: number): number {
  return Math.max(0, Math.round(subtotal * 1.53) - subtotal);
}

export function deliveryFee(subtotal: number): number {
  return subtotal > 499 ? 0 : 49;
}

export function deliveryFeeText(subtotal: number): string {
  return subtotal > 499 ? "FREE" : p(49);
}

export function taxAmount(subtotal: number): number {
  return Math.round(subtotal * 0.05);
}

export function totalWithTax(subtotal: number, discount = 0): number {
  return Math.max(0, subtotal + taxAmount(subtotal) + deliveryFee(subtotal) - discount);
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function statusLabel(s: string): string {
  const map: Record<string, string> = {
    confirmed: "Confirmed",
    preparing: "Preparing",
    ready: "Ready for Pickup",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
  };
  return map[s] || s;
}

export function statusColor(s: string): string {
  const map: Record<string, string> = {
    confirmed: "text-yellow-400 bg-yellow-400/10",
    preparing: "text-orange-400 bg-orange-400/10",
    ready: "text-blue-400 bg-blue-400/10",
    out_for_delivery: "text-purple-400 bg-purple-400/10",
    delivered: "text-green-400 bg-green-400/10",
  };
  return map[s] || "text-white/50 bg-white/5";
}
