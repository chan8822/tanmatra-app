import { useState, useEffect, useCallback } from "react";
import { API } from "@/lib/api";

export interface CartItem {
  id: number;
  dish_id: string;
  dish_name: string;
  quantity: number;
  price: number;
  image?: string;
  customizations?: any[];
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  tax: number;
  delivery_fee: number;
  total: number;
  discount?: number;
  coupon?: string;
}

export function useCart() {
  const [cart, setCart] = useState<CartState>({
    items: [],
    subtotal: 0,
    tax: 0,
    delivery_fee: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [itemCount, setItemCount] = useState(0);

  // Fetch cart on mount and listen for updates
  useEffect(() => {
    const loadCart = async () => {
      try {
        const data = await API.getCart();
        setCart(data);
        setItemCount(data.items?.reduce((s: number, i: CartItem) => s + i.quantity, 0) || 0);
      } catch (e) {
        console.error("[Cart] Failed to load:", e);
      } finally {
        setLoading(false);
      }
    };
    loadCart();

    const handler = () => loadCart();
    window.addEventListener("cartUpdated", handler);
    return () => window.removeEventListener("cartUpdated", handler);
  }, []);

  const addToCart = useCallback(async (dishId: string, quantity = 1, customizations?: any[]) => {
    try {
      const res = await API.addToCart(dishId, quantity, customizations);
      const newCart = res.cart || res;
      setCart(newCart);
      setItemCount(newCart.items?.reduce((s: number, i: CartItem) => s + i.quantity, 0) || 0);

      window.dispatchEvent(new CustomEvent("showNotification", {
        detail: { type: "success", message: `Added to cart` },
      }));
      return true;
    } catch (e) {
      console.error("[Cart] Add failed:", e);
      window.dispatchEvent(new CustomEvent("showNotification", {
        detail: { type: "error", message: "Failed to add to cart" },
      }));
      return false;
    }
  }, []);

  const removeFromCart = useCallback(async (cartItemId: number) => {
    try {
      const res = await API.removeCartItem(cartItemId);
      const newCart = res.cart || res;
      setCart(newCart);
      setItemCount(newCart.items?.reduce((s: number, i: CartItem) => s + i.quantity, 0) || 0);
      return true;
    } catch (e) {
      console.error("[Cart] Remove failed:", e);
      return false;
    }
  }, []);

  const updateQuantity = useCallback(async (cartItemId: number, quantity: number) => {
    try {
      const res = await API.updateCartQuantity(cartItemId, quantity);
      const newCart = res.cart || res;
      setCart(newCart);
      setItemCount(newCart.items?.reduce((s: number, i: CartItem) => s + i.quantity, 0) || 0);
      return true;
    } catch (e) {
      console.error("[Cart] Update failed:", e);
      return false;
    }
  }, []);

  const applyCoupon = useCallback(async (code: string) => {
    try {
      const res = await API.applyCoupon(code);
      if (res.cart) setCart(res.cart);
      window.dispatchEvent(new CustomEvent("showNotification", {
        detail: { type: "success", message: `Coupon applied: ${code}` },
      }));
      return res;
    } catch (e) {
      window.dispatchEvent(new CustomEvent("showNotification", {
        detail: { type: "error", message: "Invalid coupon" },
      }));
      return null;
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      await API.clearCart();
      setCart({ items: [], subtotal: 0, tax: 0, delivery_fee: 0, total: 0 });
      setItemCount(0);
    } catch (e) {
      console.error("[Cart] Clear failed:", e);
    }
  }, []);

  return {
    cart,
    loading,
    itemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    clearCart,
  };
}
