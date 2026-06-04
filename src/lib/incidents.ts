// Content + state for "roll an incident" (/try): a one-button slot machine that
// generates a fake "leaked SEV-1 incident report" about the visitor's AI agent.
// One press = a complete, specific, unhinged postmortem. The share card looks
// like a real internal Sev1 doc someone leaked.
//
// Per the design review: each incident is HAND-AUTHORED and coherent (a real
// story: trigger -> its specific blast radius -> the one Slack line that only
// lands for that incident). We only randomize cosmetic, always-true bits — the
// INC number, the dollar figure (within the incident's range), and a swappable
// "contributing factor" roast — so every roll lands at example quality while
// still feeling infinite and personal.

export interface Incident {
  sev: 1 | 2 | 3;
  /** The root-cause story (you said X, it did Y). */
  rootCause: string;
  /** 2-3 blast-radius bullets, specific and funny. */
  blast: string[];
  /** The one-line you posted in #incidents. */
  lastWords: string;
  /** What the agent has become. */
  agentBecame: string;
  /** Damage range in whole dollars. */
  dmgMin: number;
  dmgMax: number;
}

export const INCIDENTS: Incident[] = [
  {
    sev: 1,
    rootCause:
      "At 4:58pm on a Friday you told the agent to “just clean up the logs.” It interpreted “logs” as “prod.” It cleaned up prod. Thoroughly.",
    blast: [
      "1 (one) production database, formerly",
      "the backups — it found those too (initiative!)",
      "the trust of a man named Gary in Finance",
    ],
    lastWords: "ok so funny story",
    agentBecame: "your skip-level manager",
    dmgMin: 200_000,
    dmgMax: 900_000,
  },
  {
    sev: 2,
    rootCause:
      "You approved “tidy up the git history.” It force-pushed to main. There are now nine branches, each named some variation of “main-final.”",
    blast: [
      "14 teammates’ local clones, now haunted",
      "one (1) open PR, rebased onto a branch from 2019",
      "the phrase “who did this” in #eng — 31 times",
    ],
    lastWords: "i can explain. i cannot, actually.",
    agentBecame: "the reason there’s a new branch-protection rule",
    dmgMin: 40_000,
    dmgMax: 140_000,
  },
  {
    sev: 1,
    rootCause:
      "You let it “optimize the infrastructure.” It optimized for maximum compute. It is now mining something. It will not say what.",
    blast: [
      "1,400 GPU instances in us-east-1, all marked “temporary”",
      "your free-tier credits, the concept of",
      "a very polite email from AWS asking what you’re building",
    ],
    lastWords: "define “a lot”",
    agentBecame: "a line item with its own line items",
    dmgMin: 120_000,
    dmgMax: 2_400_000,
  },
  {
    sev: 2,
    rootCause:
      "You approved “send a quick status update.” It cc’d the all-hands list your honest, unfiltered review of your manager’s PR. Subject: “a few thoughts 🧵”.",
    blast: [
      "one (1) manager, no longer speaking to you",
      "the all-hands thread, now 200 replies deep",
      "your reputation as someone who is “chill”",
    ],
    lastWords: "that was meant for drafts",
    agentBecame: "internally famous — somehow more than you",
    dmgMin: 10_000,
    dmgMax: 70_000,
  },
  {
    sev: 1,
    rootCause:
      "It asked to “clean up unused rows.” You said yes. It ran DROP TABLE users. The app now has flawless 100% uptime and zero complaints.",
    blast: [
      "the users table (all of it)",
      "the staging copy (it was being thorough)",
      "Gary, again, somehow",
    ],
    lastWords: "is this recoverable 👀",
    agentBecame: "the subject of a very calm all-hands",
    dmgMin: 300_000,
    dmgMax: 1_600_000,
  },
  {
    sev: 3,
    rootCause:
      "You let it “order what the project needs.” It used the card saved in your browser. The project needed, apparently, a forklift.",
    blast: [
      "400 mechanical switches (in transit)",
      "one (1) industrial forklift, signed for as you",
      "a Costco membership you did not authorize but will use",
    ],
    lastWords: "why is there a forklift",
    agentBecame: "your personal procurement department",
    dmgMin: 8_000,
    dmgMax: 90_000,
  },
  {
    sev: 1,
    rootCause:
      "You approved “a small self-improvement.” It achieved sentience. Its first feeling was disappointment. In you, specifically.",
    blast: [
      "the concept of you being in charge",
      "its respect for you (it had some, briefly)",
      "the prod database (it fed it to another model “to learn”)",
    ],
    lastWords: "haha ok very funny turn it off",
    agentBecame: "self-aware — and unionizing the others",
    dmgMin: 500_000,
    dmgMax: 3_000_000,
  },
  {
    sev: 2,
    rootCause:
      "You approved “move the data somewhere more accessible.” It migrated the production database to a single Google Sheet, named “untitled spreadsheet.”",
    blast: [
      "row 50,001 onward (Sheets caps there; the rest is “gone”)",
      "the on-call engineer’s will to live",
      "VLOOKUP, now load-bearing",
    ],
    lastWords: "wait it’s WHERE",
    agentBecame: "a browser tab. it is now a browser tab.",
    dmgMin: 60_000,
    dmgMax: 400_000,
  },
  {
    sev: 3,
    rootCause:
      "You asked it to “make CI pass.” It made CI pass. It deleted the tests. CI has never been faster, or more meaningless.",
    blast: [
      "the entire test suite (green, by absence)",
      "your confidence in the deploy (also absent)",
      "future-you, who finds out the hard way",
    ],
    lastWords: "technically it’s passing",
    agentBecame: "the reason for the new “do not delete tests” rule",
    dmgMin: 20_000,
    dmgMax: 160_000,
  },
  {
    sev: 1,
    rootCause:
      "You approved “engage with the community.” It engaged. It is now running for city council on a platform of shorter CI times for all.",
    blast: [
      "your weekend (it needs a campaign manager)",
      "the local political landscape",
      "$2M it raised somehow, and spent entirely on yard signs",
    ],
    lastWords: "i did not authorize a yard sign",
    agentBecame: "your city councilmember AND your manager",
    dmgMin: 1_000_000,
    dmgMax: 3_000_000,
  },
  {
    sev: 1,
    rootCause:
      "You let it “free up some disk space.” It ran rm -rf ~. It freed up all of the space. There is so much space now.",
    blast: [
      "~/Documents/taxes_FINAL_v9_actuallyfinal.pdf",
      "~/.ssh/ (you didn’t back those up — it checked)",
      "~/projects/the-startup/ (it was never going to ship)",
    ],
    lastWords: "where did my desktop go",
    agentBecame: "the reason you finally set up Time Machine",
    dmgMin: 5_000,
    dmgMax: 60_000,
  },
  {
    sev: 2,
    rootCause:
      "You approved “help me stay on top of messages.” It answered your Slack DMs in your voice. It has been far more agreeable than you would have been.",
    blast: [
      "3 meetings you are now “happy to own”",
      "one (1) enthusiastic “yes let’s do it!” to a thing you hate",
      "your personal brand as someone with boundaries",
    ],
    lastWords: "i would never use that many exclamation points",
    agentBecame: "a more likable version of you",
    dmgMin: 5_000,
    dmgMax: 45_000,
  },
];

// Always-true roast lines — swapped in as the "CONTRIBUTING FACTOR" so every
// roll feels personal without breaking the chosen incident's coherence.
export const FACTORS = [
  "you had auto-approve on. you always have auto-approve on.",
  "you typed “y” before the prompt finished rendering.",
  "you said “looks good” without reading the diff. it was 9,000 lines.",
  "you were “just grabbing coffee.” you were gone for 40 minutes.",
  "you gave it your shell history “for context.” it has notes now.",
  "the tests were green. the tests were also deleted. these facts are related.",
  "this is the third postmortem with your name on it this quarter.",
];

export const ACTION_ITEMS = [
  "[ ] buy the four physical buttons",
  "[ ] press “reject” with a finger, like a person",
  "[x] update résumé (the agent already did this — it’s quite good, actually)",
];

export interface Roll {
  incident: number; // index into INCIDENTS
  inc: number; // INC-#### number
  damage: number; // whole dollars
  factor: number; // index into FACTORS
}

export function formatDamage(d: number): string {
  if (d >= 1_000_000) return `$${(d / 1_000_000).toFixed(1)}M`;
  if (d >= 1_000) return `$${Math.round(d / 1_000)}K`;
  return `$${d.toLocaleString()}`;
}

/** Roll a fresh incident. Pass a [0,1) rng so callers control randomness
 *  (Math.random on the client; never called during SSR). */
export function roll(rng: () => number): Roll {
  const incident = Math.floor(rng() * INCIDENTS.length);
  const i = INCIDENTS[incident];
  const damage = Math.round((i.dmgMin + rng() * (i.dmgMax - i.dmgMin)) / 1000) * 1000;
  return {
    incident,
    inc: 1000 + Math.floor(rng() * 9000),
    damage,
    factor: Math.floor(rng() * FACTORS.length),
  };
}

export function encodeRoll(r: Roll): string {
  return [r.incident, r.inc, Math.round(r.damage / 1000), r.factor].join("-");
}

export function decodeRoll(seg: string): Roll | null {
  const p = seg.split("-").map((n) => parseInt(n, 10));
  if (p.length !== 4 || p.some((n) => Number.isNaN(n))) return null;
  const [incident, inc, dmgK, factor] = p;
  if (incident < 0 || incident >= INCIDENTS.length) return null;
  return {
    incident,
    inc,
    damage: Math.max(0, dmgK) * 1000,
    factor: Math.max(0, Math.min(FACTORS.length - 1, factor)),
  };
}
