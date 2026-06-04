import { notFound } from "next/navigation";
import Link from "next/link";
import { products, getProduct } from "@/lib/products";
import { ProductConfigurator } from "./ProductConfigurator";
import { ReviewSection } from "./ReviewSection";
import { QASection } from "./QASection";
import { FAQ } from "./FAQ";
import { resolveImageUrl } from "@/lib/imageUrl";
import { ModelPreloader } from "@/components/ModelPreloader";
import { PRODUCT_TURNTABLE } from "@/lib/turntables";

// All three products share one GLB; per-product hides control what renders.
const MODEL_SRC: Record<string, string | undefined> = {
  "sudo-macro-pad-v1": "/models/sudo-macropad.glb",
  "sudo-pcb": "/models/sudo-macropad.glb",
  "sudo-keycaps": "/models/sudo-macropad.glb",
};
const MODEL_IOS_SRC: Record<string, string | undefined> = {
  "sudo-macro-pad-v1": "/models/sudo-macropad.usdz",
  "sudo-pcb": "/models/sudo-macropad.usdz",
  "sudo-keycaps": "/models/sudo-macropad.usdz",
};
const VARIANT_KINDS: Record<string, ("case" | "keycaps")[]> = {
  "sudo-macro-pad-v1": ["case", "keycaps"],
  "sudo-keycaps": ["keycaps"],
  "sudo-pcb": [],
};
const HIDE_MATERIALS: Record<string, string | undefined> = {
  "sudo-pcb": "^(CASE|KEYCAP|SCREW)",
  // Keycap set: hide everything that isn't a KEYCAP.
  "sudo-keycaps": "^(CASE|SCREW|SUBSTRATE|SILKSCREEN|METAL|COMPONENT|PCB)",
};

const inBox: Record<string, string[]> = {
  "sudo-macro-pad-v1": [
    "1× sudo macro pad (assembled)",
    "1× USB-C cable (1.5 m, braided)",
    "1× spare keycap set (matching color)",
    "1× sticker pack + setup card",
  ],
  "sudo-keycaps": ["4× PBT keycaps", "1× keycap puller"],
  "sudo-pcb": ["1× sudo macro pad PCB", "1× USB-C cable (1.5 m, braided)"],
};

const trustBand = [
  { label: "30-day returns", sub: "unopened, full refund" },
  { label: "1-year warranty", sub: "replace if it breaks" },
  { label: "Free US shipping", sub: "over $100" },
];

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) return { title: "not found · sudo.supply" };
  return {
    title: `${product.name} · sudo.supply`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const gallery = (product.images?.length ? product.images : [product.image]).map(resolveImageUrl);

  return (
    <div className="pt-32 pb-16 max-w-[1280px] mx-auto px-4 sm:px-8">
      <ModelPreloader />
      {/* Breadcrumb */}
      <p className="text-xs uppercase tracking-[0.2em] mb-6 text-text-muted font-mono">
        <Link href="/shop" className="hover:text-white">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-white">{product.name}</span>
      </p>

      <ProductConfigurator
        product={product}
        galleryImages={gallery}
        modelSrc={MODEL_SRC[product.slug]}
        modelIosSrc={MODEL_IOS_SRC[product.slug]}
        variantKinds={VARIANT_KINDS[product.slug] ?? []}
        hideMaterialsMatching={HIDE_MATERIALS[product.slug]}
        turntable={PRODUCT_TURNTABLE[product.slug]}
      />

      {/* What's in the box + specs (full width below the configurator) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        {inBox[product.slug] && (
          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs uppercase tracking-[0.2em] mb-3 text-text-muted font-mono">
              $ sudo unbox
            </p>
            <ul className="space-y-2 text-sm">
              {inBox[product.slug].map((item) => (
                <li key={item} className="flex items-center gap-3 text-text">
                  <span className="text-accent font-mono">›</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="rounded-2xl border border-border overflow-hidden">
          <div className="px-5 py-3 border-b border-border text-text-muted text-xs uppercase tracking-[0.2em] font-mono">
            Specifications
          </div>
          <table className="w-full text-sm">
            <tbody>
              {Object.entries(product.specs).map(([key, value]) => (
                <tr key={key} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 text-text-muted whitespace-nowrap capitalize">
                    {key.replace(/_/g, " ")}
                  </td>
                  <td className="px-5 py-3 text-right font-mono text-white">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trust band */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {trustBand.map((t) => (
          <div
            key={t.label}
            className="rounded-2xl border border-border bg-surface p-5 text-center"
          >
            <p className="font-semibold text-white text-base">{t.label}</p>
            <p className="text-text-muted text-sm mt-1">{t.sub}</p>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="mt-16">
        <FAQ />
      </div>

      {/* Reviews & Q&A */}
      <div className="mt-20">
        <ReviewSection slug={product.slug} />
      </div>
      <div className="mt-12">
        <QASection slug={product.slug} />
      </div>
    </div>
  );
}
