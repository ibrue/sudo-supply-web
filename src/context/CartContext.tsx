"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Product } from "@/lib/products";
import { toastBus, sudoCmd } from "@/lib/toastBus";

function trackCartActivity(slug: string, action: "add" | "remove") {
  fetch("/api/cart-activity", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug, action }),
  }).catch(() => {});
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, qty?: number) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // NOTE: side effects (toast, telemetry) live OUTSIDE the setState updater.
  // React 18 StrictMode invokes updater functions twice in dev to surface
  // impure code — emitting toasts from inside an updater fires the bus twice.
  const addItem = useCallback((product: Product, qty: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.slug === product.slug);
      if (existing) {
        return prev.map((i) =>
          i.product.slug === product.slug ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { product, quantity: qty }];
    });
    toastBus.emit(
      sudoCmd.addToCart(product.slug, qty),
      `Package ${product.slug} (qty: ${qty}) added to cart.`
    );
    trackCartActivity(product.slug, "add");
  }, []);

  const removeItem = useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.product.slug !== slug));
    toastBus.emit(sudoCmd.removeFromCart(slug), `Package ${slug} removed.`);
    trackCartActivity(slug, "remove");
  }, []);

  const updateQuantity = useCallback((slug: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.product.slug !== slug));
      toastBus.emit(sudoCmd.removeFromCart(slug), `Package ${slug} removed.`);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.product.slug === slug ? { ...i, quantity } : i))
    );
    toastBus.emit(sudoCmd.updateQty(slug, quantity), `Quantity updated to ${quantity}.`);
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    toastBus.emit(sudoCmd.clearCart(), "All packages removed.");
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
