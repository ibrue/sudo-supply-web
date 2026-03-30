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
  addItem: (product: Product) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.slug === product.slug);
      const newQty = existing ? existing.quantity + 1 : 1;
      toastBus.emit(
        sudoCmd.addToCart(product.slug, 1),
        `Package ${product.slug} (qty: ${newQty}) added to cart.`
      );
      trackCartActivity(product.slug, "add");
      if (existing) {
        return prev.map((i) =>
          i.product.slug === product.slug
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((slug: string) => {
    toastBus.emit(sudoCmd.removeFromCart(slug), `Package ${slug} removed.`);
    trackCartActivity(slug, "remove");
    setItems((prev) => prev.filter((i) => i.product.slug !== slug));
  }, []);

  const updateQuantity = useCallback((slug: string, quantity: number) => {
    if (quantity <= 0) {
      toastBus.emit(sudoCmd.removeFromCart(slug), `Package ${slug} removed.`);
      setItems((prev) => prev.filter((i) => i.product.slug !== slug));
      return;
    }
    toastBus.emit(sudoCmd.updateQty(slug, quantity), `Quantity updated to ${quantity}.`);
    setItems((prev) =>
      prev.map((i) =>
        i.product.slug === slug ? { ...i, quantity } : i
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    toastBus.emit(sudoCmd.clearCart(), "All packages removed.");
    setItems([]);
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
