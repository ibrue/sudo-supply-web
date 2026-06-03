import Link from "next/link";
import { notFound } from "next/navigation";
import { decodeResult, HEADLINES } from "@/lib/gauntlet";

interface Props {
  params: { result: string };
}

export function generateMetadata({ params }: Props) {
  const result = decodeResult(params.result);
  if (!result) {
    return {
      title: "permission gauntlet · sudo.supply",
    };
  }

  const headline = HEADLINES[result.headline];
  return {
    title: `${result.score}/100 · permission gauntlet`,
    description: `${headline} Play the [sudo] permission gauntlet.`,
    openGraph: {
      title: `${result.score}/100 · permission gauntlet`,
      description: headline,
      images: [`/try/r/${params.result}/opengraph-image`],
    },
    twitter: {
      card: "summary_large_image",
      title: `${result.score}/100 · permission gauntlet`,
      description: headline,
      images: [`/try/r/${params.result}/opengraph-image`],
    },
  };
}

export default function ResultPage({ params }: Props) {
  const result = decodeResult(params.result);
  if (!result) notFound();

  const headline = HEADLINES[result.headline];
  const shareText = encodeURIComponent(
    `I scored ${result.score}/100 on the [sudo] permission gauntlet: ${headline}`,
  );
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
              permission-gauntlet/results
            </span>
          </div>

          <div className="p-6 sm:p-10">
            <p className="text-xs uppercase tracking-[0.3em] mb-4 text-accent font-mono">
              incident report
            </p>
            <div className="grid gap-8 lg:grid-cols-[1fr_260px] lg:items-end">
              <div>
                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-[-0.04em] leading-[0.95]">
                  {headline}
                </h1>
                <p className="mt-5 text-text-muted leading-relaxed max-w-xl">
                  Eight agent requests. One nervous operator. Share the score,
                  then try again before the next agent asks for root.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-bg p-5">
                <p className="text-[10px] uppercase tracking-[0.25em] text-text-muted font-mono">
                  score
                </p>
                <p className="mt-1 text-6xl font-extrabold text-accent tabular-nums leading-none">
                  {result.score}
                </p>
                <p className="mt-1 text-xs font-mono text-text-muted">/100</p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Metric label="approve" value={result.approve} color="text-[#2F7C53]" />
              <Metric label="reject" value={result.reject} color="text-[#A82D20]" />
              <Metric label="better" value={result.better} color="text-[#B58A17]" />
              <Metric label="yolo" value={result.yolo} color="text-white" />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
                className="px-5 py-3 text-sm font-semibold rounded-full text-black bg-accent hover:brightness-110 transition"
              >
                Share on Twitter
              </a>
              <Link
                href="/try"
                className="px-5 py-3 text-sm font-semibold rounded-full border border-border hover:bg-white/5 transition"
              >
                Run it back
              </Link>
              <Link
                href="/shop"
                className="px-5 py-3 text-sm font-semibold rounded-full border border-border hover:bg-white/5 transition"
              >
                Get the pad
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-2xl border border-border bg-bg p-4">
      <p className="text-[10px] uppercase tracking-[0.22em] text-text-muted font-mono">
        {label}
      </p>
      <p className={`mt-2 text-3xl font-bold tabular-nums ${color}`}>{value}</p>
    </div>
  );
}
