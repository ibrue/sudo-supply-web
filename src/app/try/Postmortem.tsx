import { INCIDENTS, FACTORS, ACTION_ITEMS, formatDamage, type Roll } from "@/lib/incidents";

const SEV: Record<number, string> = {
  1: "text-error border-error/40 bg-error/10",
  2: "text-[#E3C04A] border-[#E3C04A]/40 bg-[#E3C04A]/10",
  3: "text-accent border-accent/40 bg-accent/10",
};

/** The fake leaked Sev-1 doc. Server-safe (no hooks) so it renders identically
 *  in the toy (after a roll) and on the shareable /try/i permalink. */
export function Postmortem({ roll, className = "" }: { roll: Roll; className?: string }) {
  const i = INCIDENTS[roll.incident];
  return (
    <div className={`font-mono text-sm leading-relaxed ${className}`}>
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span className="text-white font-semibold tracking-wide">INCIDENT POSTMORTEM</span>
        <span className="text-text-muted">· INC-{roll.inc}</span>
        <span className={`px-2 py-0.5 rounded-md border text-xs font-semibold ${SEV[i.sev]}`}>
          SEV-{i.sev}
        </span>
        <span className="text-text-muted text-xs">· detected by: a customer, on Twitter</span>
      </div>

      <Field label="root cause">{i.rootCause}</Field>
      <Field label="blast radius">
        <ul className="space-y-0.5">
          {i.blast.map((b, k) => (
            <li key={k}>— {b}</li>
          ))}
          <li className="text-error">— {formatDamage(roll.damage)} in total damages</li>
        </ul>
      </Field>
      <Field label="contributing factor">{FACTORS[roll.factor]}</Field>
      <Field label="what you said in #incidents">
        <span className="text-text">&gt; &ldquo;{i.lastWords}&rdquo;</span>
      </Field>
      <Field label="action items">
        <ul className="space-y-0.5">
          {ACTION_ITEMS.map((a, k) => (
            <li key={k} className={a.startsWith("[x]") ? "text-text-muted line-through" : ""}>
              {a}
            </li>
          ))}
        </ul>
      </Field>

      <p className="mt-5 text-text-muted">— signed, the agent (now {i.agentBecame})</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <p className="text-accent uppercase tracking-[0.2em] text-[11px] font-pixel mb-1">{label}</p>
      <div className="text-text-muted">{children}</div>
    </div>
  );
}
