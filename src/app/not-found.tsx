import Link from "next/link";

export const metadata = {
  title: "404 · sudo.supply",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="pt-32 pb-16 px-4 sm:px-8 max-w-2xl mx-auto text-center min-h-[80vh] flex flex-col items-center justify-center">
      <p className="font-pixel text-accent text-6xl sm:text-8xl mb-4">[ :( ]</p>
      <p className="text-xs uppercase tracking-[0.3em] mb-3 text-accent font-pixel">
        Error · 404
      </p>
      <h1 className="text-5xl sm:text-7xl font-extrabold tracking-[-0.04em] leading-[0.95] mb-6">
        Page not
        <br />
        <span className="text-accent">found.</span>
      </h1>
      <p className="text-text-muted text-lg max-w-md mx-auto mb-10">
        Whatever you were looking for, it&apos;s not here. Maybe it never was.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/"
          className="px-6 py-3 text-sm font-semibold rounded-full text-black bg-accent hover:brightness-110 transition"
        >
          Back home →
        </Link>
        <Link
          href="/shop"
          className="px-6 py-3 text-sm font-medium rounded-full border border-border hover:bg-white/5 transition"
        >
          Browse the shop
        </Link>
      </div>
      <p className="mt-12 text-xs font-mono text-text-muted">
        $ sudo cd / && retry
      </p>
    </div>
  );
}
