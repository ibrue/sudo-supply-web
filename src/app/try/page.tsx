import Link from "next/link";
import { Gauntlet } from "./Gauntlet";

export const metadata = {
  title: "approve. or don't. · sudo.supply",
  description:
    "Hand an AI agent the keys and watch it spiral. A comedy permission simulator for [sudo], the four-key macro pad for approving AI agents on purpose.",
};

export default function TryPage() {
  return (
    <div className="pt-28 pb-20">
      <section className="max-w-[1180px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-12 gap-8 items-center">
          <div className="col-span-12 lg:col-span-5">
            <p className="text-xs uppercase tracking-[0.3em] mb-4 text-accent font-mono">
              $ sudo gauntlet
            </p>
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-[-0.04em] leading-[0.92]">
              Approve.
              <br />
              Or don&apos;t.
            </h1>
            <p className="mt-6 text-text-muted leading-relaxed max-w-md">
              Hand an AI agent the keys. It asks to do increasingly unhinged
              things. Every button makes it worse. Share the carnage.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="px-5 py-3 text-sm font-semibold rounded-full text-black bg-accent hover:brightness-110 transition"
              >
                Get the buttons
              </Link>
              <Link
                href="/install"
                className="px-5 py-3 text-sm font-semibold rounded-full border border-border hover:bg-white/5 transition"
              >
                View install script
              </Link>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-7">
            <Gauntlet />
          </div>
        </div>
      </section>
    </div>
  );
}
