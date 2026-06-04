import Link from "next/link";
import { IncidentMachine } from "./IncidentMachine";

export const metadata = {
  title: "roll an incident · sudo.supply",
  description:
    "One button generates a leaked SEV-1 postmortem of the thing your AI agent did while you weren't looking. From [sudo], the four-key macro pad for approving AI agents on purpose.",
};

export default function TryPage() {
  return (
    <div className="pt-28 pb-20">
      <section className="max-w-[760px] mx-auto px-4 sm:px-8">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.3em] mb-4 text-accent font-pixel">
            $ sudo postmortem --roll
          </p>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-[-0.04em] leading-[0.95]">
            What did your agent
            <br />
            do last night?
          </h1>
          <p className="mt-5 max-w-md mx-auto text-text-muted leading-relaxed">
            Press the button. It generates the incident report. It is, statistically, your fault.
          </p>
        </div>

        <IncidentMachine />

        <p className="mt-6 text-center text-sm text-text-muted">
          The fix is four physical buttons. The agent has to wait for you to press one.{" "}
          <Link href="/product/sudo-macro-pad-v1" className="text-accent hover:underline">
            That&apos;s the product →
          </Link>
        </p>
      </section>
    </div>
  );
}
