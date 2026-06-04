import Link from "next/link";
import { notFound } from "next/navigation";
import { decodeRoll, INCIDENTS, formatDamage } from "@/lib/incidents";
import { Postmortem } from "../../Postmortem";

interface Props {
  params: { id: string };
}

export function generateMetadata({ params }: Props) {
  const r = decodeRoll(params.id);
  if (!r) return { title: "incident report · sudo.supply" };
  const i = INCIDENTS[r.incident];
  const title = `INC-${r.inc} · SEV-${i.sev} · the agent is now ${i.agentBecame}`;
  const desc = `${formatDamage(r.damage)} in damages. roll your own AI agent incident.`;
  const img = [`/try/i/${params.id}/opengraph-image`];
  return {
    title,
    description: desc,
    openGraph: { title, description: desc, images: img },
    twitter: { card: "summary_large_image", title, description: desc, images: img },
  };
}

export default function IncidentPage({ params }: Props) {
  const r = decodeRoll(params.id);
  if (!r) notFound();

  const tweet = encodeURIComponent(
    "my AI agent caused an incident. it has been added to the postmortem record. roll yours:",
  );
  const url = encodeURIComponent(`https://sudo.supply/try/i/${params.id}`);

  return (
    <div className="pt-28 pb-20">
      <section className="max-w-[760px] mx-auto px-4 sm:px-8">
        <p className="text-xs uppercase tracking-[0.3em] mb-4 text-accent font-pixel text-center">
          the postmortem record
        </p>
        <div className="rounded-[2rem] border border-border bg-surface overflow-hidden">
          <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A82D20]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#B58A17]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#2F7C53]" />
            <span className="ml-2 font-mono text-[11px] tracking-wide text-text-muted">
              ~/incidents/INC-{r.inc}
            </span>
          </div>
          <div className="p-6 sm:p-8">
            <Postmortem roll={r} />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <a
            href={`https://twitter.com/intent/tweet?text=${tweet}&url=${url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 text-sm font-semibold rounded-full text-black bg-accent hover:brightness-110 transition"
          >
            Post the incident on X
          </a>
          <Link
            href="/try"
            className="px-5 py-3 text-sm font-semibold rounded-full border border-border hover:bg-white/5 transition"
          >
            Roll your own
          </Link>
          <Link
            href="/product/sudo-macro-pad-v1"
            className="px-5 py-3 text-sm font-semibold rounded-full border border-border hover:bg-white/5 transition"
          >
            Get the real buttons
          </Link>
        </div>
      </section>
    </div>
  );
}
