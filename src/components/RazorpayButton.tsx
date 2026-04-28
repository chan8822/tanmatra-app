import { useEffect, useRef } from "react";

interface RazorpayButtonProps {
  buttonId: string;
  amount: number;
  onSuccess?: (response: any) => void;
}

export function RazorpayPaymentButton({ buttonId, amount }: RazorpayButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous content
    containerRef.current.innerHTML = "";

    // Create form element
    const form = document.createElement("form");

    // Create script element
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/payment-button.js";
    script.setAttribute("data-payment_button_id", buttonId);
    script.async = true;

    form.appendChild(script);
    containerRef.current.appendChild(form);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [buttonId, amount]);

  return <div ref={containerRef} className="w-full" />;
}
