import Link from "next/link";
import { notFound } from "next/navigation";
import { decodeResult, headline, formatDamage, TITLES } from "@/lib/gauntlet";

interface Props {
  params: { result: string };
}

export function generateMetadata({ params }: Props) {
  const r = decodeResult(params.result);
  if (!r) return { title: "the carnage report · sudo.supply" };
  const h = headline(r);
  return {
    title: `${h} · sudo.supply`,
    description: `${formatDamage(r.damage)} in damage. the agent is now ${TITLES[r.title]}. how would you do?`,
    openGraph: {
      title: h,
      description: `${formatDamage(r.damage)} in damage · the agent is now ${TITLES[r.title]}`,
      images: [`/try/r/${params.result}/opengraph-image`],
    },
    twitter: {
      card: "summary_large_image",
      title: h,
      description: `${formatDamage(r.damage)} in damage · the agent is now ${TITLES[r.title]}`,
      images: [`/try/r/${params.result}/opengraph-image`],
    },
  };
}

export default function ResultPage({ params }: Props) {
  const r = decodeResult(params.result);
  if (!r) notFound();

  const h = headline(r);
  const title = TITLES[r.title];
  const tweet = `I handed an AI agent the keys and it caused ${formatDamage(r.damage)} in damage. it is now ${title}. how would you do?`;
  const shareText = encodeURIComponent(tweet);
  const shareUrl = encodeURIComponent(`https://sudo.supply/try/r/${params.result}`);

  return (
    <div className="pt-28 pb-20">
      <section className="max-w-[960px] mx-auto px-4 sm:px-8">
        <div className="rounded-[2rem] border border-border bg-surface overflow-hidden">
          <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A82D20]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#B58A17]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#2F7C53]" />
            <span className="ml-2 font-mono text-[11px] tracking-wide text-text-muted">
              ~/agent — incident report
            </span>
          </div>

          <div className="p-6 sm:p-10">
            <p className="text-xs uppercase tracking-[0.3em] mb-4 text-accent font-mono">
              the carnage report
            </p>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-[-0.04em] leading-[0.98]">
              {h}
            </h1>
            <p className="mt-5 text-lg text-text-muted">
              total damage{" "}
              <span className="text-error font-mono font-semibold">{formatDamage(r.damage)}</span>
              {" · "}the agent is now <span className="text-white">{title}</span>.
            </p>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Metric label="approved" value={r.approved} color="text-[#3FA66F]" />
              <Metric label="rejected" value={r.denied} color="text-[#E0604F]" />
              <Metric label="“improved”" value={r.improved} color="text-[#E3C04A]" />
              <Metric label="yolo’d" value={r.yolod} color="text-white" />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 text-sm font-semibold rounded-full text-black bg-accent hover:brightness-110 transition"
              >
                Post the damage on X
              </a>
              <Link
                href="/try"
                className="px-5 py-3 text-sm font-semibold rounded-full border border-border hover:bg-white/5 transition"
              >
                Run it back
              </Link>
              <Link
                href="/product/sudo-macro-pad-v1"
                className="px-5 py-3 text-sm font-semibold rounded-full border border-border hover:bg-white/5 transition"
              >
                Get the real buttons
              </Link>
            </div>

            <p className="mt-6 text-sm text-text-muted">
              In real life these four keys are physical, and the agent has to wait for you to press
              one. That&apos;s the whole product.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-2xl border border-border bg-bg p-4">
      <p className="text-[10px] uppercase tracking-[0.22em] text-text-muted font-mono">{label}</p>
      <p className={`mt-2 text-3xl font-bold tabular-nums ${color}`}>{value}</p>
    </div>
  );
}
