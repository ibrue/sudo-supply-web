import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "@/context/CartContext";
import { products } from "@/lib/products";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

const testProduct = products[0];

describe("CartContext", () => {
  it("starts with empty cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it("adds an item to the cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(testProduct));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.totalItems).toBe(1);
    expect(result.current.totalPrice).toBe(testProduct.price);
  });

  it("increments quantity when adding same item twice", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem(testProduct);
      result.current.addItem(testProduct);
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.totalItems).toBe(2);
    expect(result.current.totalPrice).toBe(testProduct.price * 2);
  });

  it("removes an item from the cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(testProduct));
    act(() => result.current.removeItem(testProduct.slug));
    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
  });

  it("updates quantity", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(testProduct));
    act(() => result.current.updateQuantity(testProduct.slug, 5));
    expect(result.current.totalItems).toBe(5);
    expect(result.current.totalPrice).toBe(testProduct.price * 5);
  });

  it("removes item when quantity set to 0", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(testProduct));
    act(() => result.current.updateQuantity(testProduct.slug, 0));
    expect(result.current.items).toHaveLength(0);
  });

  it("clears the cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem(products[0]);
      result.current.addItem(products[1]);
    });
    act(() => result.current.clearCart());
    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it("throws when useCart is used outside CartProvider", () => {
    expect(() => {
      renderHook(() => useCart());
    }).toThrow("useCart must be used within CartProvider");
  });
});
