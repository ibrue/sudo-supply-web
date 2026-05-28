import { products } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export const metadata = {
  title: "shop · sudo.supply",
  description:
    "Three things. The assembled macro pad, the bare PCB, and the keycap set. Hand-assembled, open hardware.",
};

// Same per-product 3D config used on the product pages — single GLB,
// per-product hides decide which meshes render in each card thumbnail.
const MODEL_SRC = "/models/sudo-macropad.glb";
const HIDE_MATERIALS: Record<string, string | undefined> = {
  "sudo-macro-pad-v1": undefined,
  "sudo-pcb": "^(CASE|KEYCAP|SCREW)",
  "sudo-keycaps": "^(CASE|SCREW|SUBSTRATE|SILKSCREEN|METAL|COMPONENT|PCB)",
};

export default function ShopPage() {
  return (
    <div className="pt-32 pb-16 max-w-[1280px] mx-auto px-4 sm:px-8">
      <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] mb-3 text-accent font-mono">
            $ ls --everything
          </p>
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-[-0.04em] leading-[0.95]">
            Three things.
            <br />
            <span className="text-accent">That&apos;s the shop.</span>
          </h1>
          <p className="mt-6 max-w-xl text-text-muted leading-relaxed">
            Open hardware, hand-assembled. The whole macro pad, the bare PCB,
            or just the keycaps. Free US shipping over $100; bulk pricing for
            teams of 5+.
          </p>
        </div>
        <div className="shrink-0 rounded-2xl border border-border bg-surface px-5 py-4 text-right font-mono">
          <p className="text-[10px] uppercase tracking-[0.25em] text-text-muted">products</p>
          <p className="text-5xl font-bold text-accent leading-none tabular-nums mt-1">
            {String(products.length).padStart(2, "0")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product, i) => (
          <ProductCard
            key={product.slug}
            product={product}
            index={i + 1}
            total={products.length}
            modelSrc={MODEL_SRC}
            hideMaterialsMatching={HIDE_MATERIALS[product.slug]}
          />
        ))}
      </div>
    </div>
  );
}
