"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { createCheckout } from "@/lib/shopify";
import { toastBus, sudoCmd } from "@/lib/toastBus";
import { ProductThumb } from "@/components/ProductThumb";
import { ModelPreloader } from "@/components/ModelPreloader";

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
      setError("Checkout is not configured yet. Connect your Shopify store to enable purchases.");
      setCheckingOut(false);
    }
  }

  return (
    <div className="pt-32 pb-16 max-w-[900px] mx-auto px-4 sm:px-8">
      <ModelPreloader />
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.3em] mb-3 text-accent font-mono">Your bag</p>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-[-0.04em]">
          {items.length === 0 ? "Empty. For now." : "Almost yours."}
        </h1>
      </div>

      <div className="rounded-3xl border border-border bg-surface overflow-hidden">
        {items.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-pixel text-accent text-3xl mb-4">[ :| ]</p>
            <p className="text-xs font-mono text-text-muted mb-2">
              $ sudo apt list --installed → 0 packages
            </p>
            <p className="text-text-muted mb-6">
              Nothing in the bag yet. Go pick something out.
            </p>
            <Link
              href="/shop"
              className="inline-block px-6 py-3 text-sm font-semibold rounded-full text-black bg-accent hover:brightness-110 transition"
            >
              Browse the shop →
            </Link>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-border">
              {items.map((item) => {
                return (
                  // Cart line: stacks on mobile (thumb + name on top, controls
                  // beneath spread to the edges) and flows inline at sm+.
                  // Touch targets on the stepper + remove are bumped to 36–40px
                  // on mobile, then compressed at sm+ for the denser layout.
                  <li
                    key={item.product.slug}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-5"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <ProductThumb product={item.product} />
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/product/${item.product.slug}`}
                          className="font-semibold text-white hover:text-accent transition-colors block truncate"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-text-muted font-mono tabular-nums">
                          ${item.product.price.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4 justify-between sm:justify-end shrink-0">
                      <div className="flex items-center gap-1 rounded-full border border-border px-1.5 py-1">
                        <button
                          onClick={() => updateQuantity(item.product.slug, item.quantity - 1)}
                          className="w-9 h-9 sm:w-7 sm:h-7 rounded-full hover:bg-white/10 text-text-muted hover:text-white text-lg sm:text-base leading-none"
                          aria-label="decrease quantity"
                        >
                          −
                        </button>
                        <span className="font-mono text-sm tabular-nums w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.slug, item.quantity + 1)}
                          className="w-9 h-9 sm:w-7 sm:h-7 rounded-full hover:bg-white/10 text-text-muted hover:text-white text-lg sm:text-base leading-none"
                          aria-label="increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-mono text-base tabular-nums w-20 text-right">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeItem(item.product.slug)}
                        className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-text-muted hover:text-error hover:bg-white/5 text-xl sm:text-lg leading-none"
                        aria-label="remove item"
                      >
                        ×
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-border p-5 sm:p-6">
              <p className="text-xs font-mono text-text-muted mb-3">
                $ sudo total --calculate
              </p>
              <div className="flex items-center justify-between mb-1 text-text-muted text-sm">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between mb-6 text-text-muted text-sm">
                <span>Shipping</span>
                <span className="font-mono">calculated at checkout</span>
              </div>
              <div className="flex items-center justify-between mb-6 pt-4 border-t border-border">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold font-mono tabular-nums">${totalPrice.toFixed(2)}</span>
              </div>

              {error && (
                <p className="text-error text-sm mb-4 rounded-2xl border border-error/40 bg-error/5 p-3">
                  {error}
                </p>
              )}

              <button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="w-full px-6 py-4 text-base font-semibold rounded-full text-black bg-accent hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {checkingOut ? "Redirecting…" : "Checkout"}
              </button>
              <p className="text-text-muted text-xs mt-3 text-center">
                Secure checkout powered by Shopify.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
