import { products } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { TerminalLink } from "@/components/TerminalLink";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="scanline-overlay" />
        <div className="relative z-20 text-center animate-scanline-in">
          <div className="mb-6 flex items-center justify-center">
            <h1 className="font-pixel text-white text-3xl sm:text-5xl md:text-7xl lg:text-8xl tracking-tight">
              [sudo]
            </h1>
            <span className="text-accent text-2xl sm:text-4xl md:text-6xl lg:text-7xl animate-blink ml-1">&#9608;</span>
          </div>
          <p className="font-mono text-text-muted text-sm sm:text-base tracking-wider">
            approve. reject. repeat.
          </p>
          <p className="font-mono text-text-muted text-xs sm:text-sm max-w-md mx-auto px-4">
            open-source macro pad + cross-platform companion app for macOS, Windows &amp; Linux
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
            <TerminalLink href="/shop">
              [ browse products ]
            </TerminalLink>
            <TerminalLink href="/download">
              [ download app ]
            </TerminalLink>
          </div>
        </div>
      </section>

      {/* Products preview */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <h2 className="text-text-muted text-sm mb-8 animate-fade-in">
          &gt; products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-fade-in-delay">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      {/* Features overview */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <h2 className="text-text-muted text-sm mb-8 animate-fade-in">
          &gt; features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="glass p-4 sm:p-6 hover:border-accent transition-colors">
            <h3 className="font-mono text-accent text-xs mb-3">cross-platform</h3>
            <p className="text-text-muted text-sm">Native apps for macOS, Windows, and Linux. Works with any AI agent in any browser or native app.</p>
          </div>
          <div className="glass p-6 hover:border-accent transition-colors">
            <h3 className="font-mono text-accent text-xs mb-3">customizable</h3>
            <p className="text-text-muted text-sm">Simple mode for system shortcuts, complex mode for AI agent control. Fully configurable key bindings.</p>
          </div>
          <div className="glass p-6 hover:border-accent transition-colors">
            <h3 className="font-mono text-accent text-xs mb-3">open firmware</h3>
            <p className="text-text-muted text-sm">QMK firmware with VIA and Vial support. Remap keys live without reflashing.</p>
          </div>
        </div>
      </section>
    </>
  );
}
