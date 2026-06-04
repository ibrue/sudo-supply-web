import Link from "next/link";
import { AppSwitcher } from "./AppSwitcher";

export const metadata = {
  title: "one pad, every app · sudo.supply",
  description:
    "[sudo] auto-detects the app in front of you and remaps the four keys — Claude, Cursor, ChatGPT, the terminal, VS Code, Discord. Same buttons, the app decides what they do.",
};

export default function TryPage() {
  return (
    <div className="pt-28 pb-20">
      <section className="max-w-[760px] mx-auto px-4 sm:px-8">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.3em] mb-4 text-accent font-mono">
            $ sudo profiles --auto
          </p>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-[-0.04em] leading-[0.95]">
            One pad.
            <br />
            Every app.
          </h1>
          <p className="mt-5 max-w-md mx-auto text-text-muted leading-relaxed">
            The companion app sees which window is in front and remaps the four keys to match.
            Switch apps below and watch the buttons follow.
          </p>
        </div>

        <AppSwitcher />

        <p className="mt-6 text-center text-sm text-text-muted">
          It detects apps via the accessibility tree, OCR, or window title — and you can override
          any mapping.{" "}
          <Link href="/download" className="text-accent hover:underline">
            See the app →
          </Link>
        </p>
      </section>
    </div>
  );
}
