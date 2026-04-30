// Coupon code registry — single source of truth for all promotion codes
// Referenced by build-contracts.cjs to validate UI strings against actual codes

export const COUPON_REGISTRY = [
  { code: "FIRST100", discount: 100, minOrder: 299, description: "₹100 off your first order" },
  { code: "TAN100", discount: 100, minOrder: 299, description: "₹100 off any order" },
  { code: "FIRST20", discount: 20, minOrder: 199, description: "₹20 off starter orders" },
  { code: "GOLD50", discount: 50, minOrder: 299, description: "₹50 off for Gold members" },
];

export function getCoupon(code: string) {
  return COUPON_REGISTRY.find((c) => c.code === code.toUpperCase());
}

export function useReferral() {
  const share = () => {
    const text = "Order healthy meals on Tanmatra and get ₹50 off! Use my code: TAN50";
    if (navigator.share) {
      navigator.share({ title: "Tanmatra", text });
    } else {
      navigator.clipboard.writeText(text);
    }
  };
  return { share };
}
