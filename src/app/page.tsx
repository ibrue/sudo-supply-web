import Link from "next/link";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="scanline-overlay" />
        <div className="relative z-20 text-center animate-scanline-in">
          <div className="mb-6 flex items-center justify-center">
            <h1 className="font-pixel text-white text-5xl sm:text-7xl md:text-8xl tracking-tight">
              [sudo]
            </h1>
            <span className="text-accent text-4xl sm:text-6xl md:text-7xl animate-blink ml-1">&#9608;</span>
          </div>
          <p className="font-mono text-text-muted text-sm sm:text-base tracking-wider">
            approve. reject. repeat.
          </p>
          <p className="font-mono text-text-muted text-xs mt-3 max-w-md mx-auto">
            open-source macro pad + cross-platform companion app for macOS, Windows &amp; Linux
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/shop" className="btn-terminal">
              [ browse products ]
            </Link>
            <Link href="/download" className="btn-terminal">
              [ download app ]
            </Link>
          </div>
        </div>
      </section>

      {/* Products preview */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-text-muted text-sm mb-8 animate-fade-in">
          &gt; products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-delay">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      {/* Features overview */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-text-muted text-sm mb-8 animate-fade-in">
          &gt; features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border border-border p-6">
            <h3 className="font-mono text-accent text-xs mb-3">cross-platform</h3>
            <p className="text-text-muted text-sm">Native apps for macOS, Windows, and Linux. Works with any AI agent in any browser or native app.</p>
          </div>
          <div className="border border-border p-6">
            <h3 className="font-mono text-accent text-xs mb-3">customizable</h3>
            <p className="text-text-muted text-sm">Simple mode for system shortcuts, complex mode for AI agent control. Fully configurable key bindings.</p>
          </div>
          <div className="border border-border p-6">
            <h3 className="font-mono text-accent text-xs mb-3">open firmware</h3>
            <p className="text-text-muted text-sm">QMK firmware with VIA and Vial support. Remap keys live without reflashing.</p>
          </div>
        </div>
      </section>
    </>
  );
}
