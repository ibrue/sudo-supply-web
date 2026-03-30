"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { createCheckout } from "@/lib/shopify";
import { toastBus, sudoCmd } from "@/lib/toastBus";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setCheckingOut(true);
    setError(null);
    toastBus.emit(sudoCmd.checkout(totalPrice.toFixed(2)), "Redirecting to secure checkout...");

    try {
      const lineItems = items.map((item) => ({
        variantId: item.product.shopifyVariantId || item.product.slug,
        quantity: item.quantity,
      }));

      const checkout = await createCheckout(lineItems);
      window.location.href = checkout.webUrl;
    } catch (err) {
      console.error("Checkout error:", err);
      setError(
        "Checkout is not configured yet. Connect your Shopify store to enable purchases."
      );
      setCheckingOut(false);
    }
  }

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 max-w-3xl mx-auto">
      <p className="text-text-muted text-sm mb-8 animate-fade-in">~/cart</p>

      <div className="font-mono text-sm animate-fade-in-delay glass p-4 sm:p-6">
        <p className="text-accent mb-4">cart@sudo.supply ~&gt;</p>

        {items.length === 0 ? (
          <div className="text-text-muted py-8">
            <p className="mb-4">cart is empty.</p>
            <Link href="/shop" className="btn-terminal text-xs">
              [ browse products ]
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {items.map((item, i) => (
                <div key={item.product.slug} className="border-b border-border pb-3 last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-text-muted text-xs">item_{i + 1}:</span>
                    <span className="text-text text-xs sm:text-sm truncate ml-2">{item.product.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.slug, item.quantity - 1)}
                        className="text-text-muted hover:text-accent text-xs"
                      >
                        [-]
                      </button>
                      <span className="tabular-nums">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.slug, item.quantity + 1)}
                        className="text-text-muted hover:text-accent text-xs"
                      >
                        [+]
                      </button>
                      <button
                        onClick={() => removeItem(item.product.slug)}
                        className="text-text-muted hover:text-error text-xs ml-2"
                      >
                        [x]
                      </button>
                    </div>
                    <span className="tabular-nums">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 mb-6">
              <div className="flex justify-between text-base">
                <span>total:</span>
                <span className="tabular-nums">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {error && (
              <p className="text-error text-xs mb-4 border border-error p-3">
                {error}
              </p>
            )}

            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="btn-terminal-accent w-full text-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {checkingOut ? "[ REDIRECTING... ]" : "[ CHECKOUT ]"}
            </button>

            <p className="text-text-muted text-xs mt-3 text-center">
              secure checkout powered by Shopify
            </p>
          </>
        )}
      </div>
    </div>
  );
}
