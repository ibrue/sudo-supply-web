import { describe, it, expect } from "vitest";
import { products, getProduct } from "@/lib/products";

describe("products", () => {
  it("should have at least one product", () => {
    expect(products.length).toBeGreaterThan(0);
  });

  it("every product should have required fields", () => {
    for (const product of products) {
      expect(product.slug).toBeTruthy();
      expect(product.name).toBeTruthy();
      expect(product.price).toBeGreaterThan(0);
      expect(product.description).toBeTruthy();
      expect(product.image).toBeTruthy();
      expect(product.specs).toBeDefined();
    }
  });

  it("every product slug should be unique", () => {
    const slugs = products.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("getProduct should return correct product by slug", () => {
    const product = getProduct("sudo-macro-pad-v1");
    expect(product).toBeDefined();
    expect(product!.name).toBe("sudo macro pad v1");
  });

  it("getProduct should return undefined for unknown slug", () => {
    expect(getProduct("nonexistent")).toBeUndefined();
  });
});
