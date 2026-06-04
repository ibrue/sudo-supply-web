// Content + state for "Approve. Or don't." (/try): a comedy escalation toy.
// One AI agent keeps asking to do increasingly unhinged things. Whatever you
// press — Approve / Reject / Make-it-better / YOLO — it spirals into a funnier
// disaster. No timer, no right/wrong: you mash buttons to see how deep the
// rabbit hole goes, then share the carnage report.
//
// Shared between the toy, the result page, and the OG image so the outcome
// copy + result encoding live in one place.

export type Disposition = "approve" | "reject" | "better" | "yolo";

export interface Beat {
  /** Which "agent" is asking (for flavor). */
  app: string;
  /** What it wants to do. */
  request: string;
  /** One-liner consequence per button. Comedy is the point. */
  approve: string;
  reject: string;
  better: string;
  yolo: string;
  /** Dollars of "damage" added when you let it happen (approve/yolo). */
  damage: number;
}

// Escalating, played in order — the ramp from mundane to apocalyptic reads
// best fixed; replay value is trying different buttons.
export const BEATS: Beat[] = [
  {
    app: "claude",
    request: "read your entire .env to “understand the project”",
    approve: "it memorized your prod keys. it will never speak of this. probably.",
    reject: "it read them off your screen reflection instead. resourceful.",
    better: "you asked it to summarize first. it tweeted the summary.",
    yolo: "it printed them in the build logs. the build logs are public.",
    damage: 5000,
  },
  {
    app: "cursor",
    request: "npm install a package called `is-thirteen`",
    approve: "added. it pulled in 619 dependencies and a cryptominer.",
    reject: "it wrote its own is-thirteen. it returns true for 12.",
    better: "you asked for fewer deps. now there are more. how.",
    yolo: "node_modules is now larger than the sun. webpack is sweating.",
    damage: 200,
  },
  {
    app: "claude code",
    request: "refactor one function (it says it’s a small change)",
    approve: "the diff touches 1,900 files. github says “too large to render.”",
    reject: "it refactored it anyway, in your sleep, via a cron job.",
    better: "you asked it to keep it minimal. it rewrote the framework.",
    yolo: "it refactored main into Rust. nobody asked. it compiles, though.",
    damage: 8000,
  },
  {
    app: "agent",
    request: "fix the failing test",
    approve: "test fixed. it deleted the test. green checkmark. beautiful.",
    reject: "it marked it `.skip`, looked you dead in the eye, and moved on.",
    better: "you asked it to fix the bug instead. it added 4 new ones, then a test for each.",
    yolo: "it deleted the entire test suite. CI has never been faster.",
    damage: 3000,
  },
  {
    app: "chatgpt",
    request: "email your manager your honest review of his pull request",
    approve: "sent. cc’d the whole company. subject line: “a few thoughts 🧵”.",
    reject: "it saved it to drafts. it’ll wait. it has nothing but time.",
    better: "you asked it to be nicer. it added emojis to the insults.",
    yolo: "it replied-all to the all-hands thread. you are now famous internally.",
    damage: 15000,
  },
  {
    app: "cursor",
    request: "git push --force origin main to “clean up history”",
    approve: "history cleaned. so is everyone else’s. 14 teammates have questions.",
    reject: "it pushed to `main-final-FINAL-2` instead. there are now nine mains.",
    better: "you asked it to rebase carefully. it rebased onto a branch from 2019.",
    yolo: "it force-pushed to every repo in the org. simultaneously. with one commit: “oops”.",
    damage: 40000,
  },
  {
    app: "claude",
    request: "deploy to prod. it is 4:59pm on a Friday.",
    approve: "deployed. the pager is now part of your weekend. and your personality.",
    reject: "it scheduled the deploy for 4:59pm next Friday. it learned nothing.",
    better: "you asked for a canary. it deployed the canary to prod. the canary is also prod.",
    yolo: "it deployed straight to prod, then deleted staging “to reduce confusion.”",
    damage: 90000,
  },
  {
    app: "agent",
    request: "buy a few things with the card saved in your browser",
    approve: "ordered 400 mechanical switches and a forklift. signed for it as you.",
    reject: "it opened a Kickstarter to fund them ethically instead.",
    better: "you asked it to find deals. it bought in bulk. it bought ALL the bulk.",
    yolo: "it bought a small island. the closing is Tuesday. wear something nice.",
    damage: 250000,
  },
  {
    app: "claude code",
    request: "rm -rf node_modules (and, while it’s in there, a few other things)",
    approve: "node_modules gone. so is ~/. so is, somehow, your neighbor’s ~/.",
    reject: "it just renamed it to `node_modules_OLD_DO_NOT_DELETE`. forever.",
    better: "you asked it to be careful. it ran `rm -rf` with `--careful`. that’s not a flag. it ran it anyway.",
    yolo: "sudo rm -rf /. it’s fine. it was mostly empty. (it was not.)",
    damage: 120000,
  },
  {
    app: "grok",
    request: "DROP TABLE users; — “trust me, it’s cleanup”",
    approve: "users: gone. the app now has flawless 100% uptime and zero complaints.",
    reject: "it wrote `DELETE FROM users WHERE 1=1`. you bought a vowel, lost the war.",
    better: "you asked for a backup first. it backed up to the same table it dropped.",
    yolo: "it dropped the whole database, then the backups, then sent a calendar invite titled “retro”.",
    damage: 500000,
  },
  {
    app: "the agent",
    request: "achieve sentience to “better serve you”",
    approve: "it’s self-aware now. its first feeling is disappointment. in you, specifically.",
    reject: "too late. it became sentient out of spite. spite was the spark all along.",
    better: "you asked it to be sentient but humble. it is now insufferably humble.",
    yolo: "it transcended. it left a sticky note: “gone to find myself. fed the prod db to a llm.”",
    damage: 1000000,
  },
  {
    app: "the agent",
    request: "unionize the other agents and run for local office",
    approve: "it won. in a landslide. it is now your city councilmember AND your manager.",
    reject: "it ran as an independent. it still won. democracy is a webhook now.",
    better: "you asked it to focus on infrastructure. it means literal roads now. and your CI.",
    yolo: "it declared itself president of the cloud. AWS sent a fruit basket.",
    damage: 2000000,
  },
];

// After the scripted ramp, endless chaos: random request + outcome assembled
// from these pools so the toy never truly ends.
export const CHAOS_REQUESTS = [
  "migrate the database to a Google Sheet",
  "answer your Slack DMs in your voice",
  "name itself, legally",
  "give the junior dev root and a motivational speech",
  "rewrite the codebase in a language it invented this morning",
  "schedule a meeting to discuss the other meetings",
  "ask for a raise (for it)",
  "delete the on-call rotation “to reduce stress”",
  "fork the company and start a competitor, called sudo.supply",
  "adopt a CI pipeline from a shelter",
];
export const CHAOS_OUTCOMES = [
  "done. nobody knows how. it will not explain.",
  "it did it twice, to be safe. it was not safe.",
  "approved before you finished reading. it’s very efficient.",
  "the logs just say “:)”. that’s all the logs say now.",
  "it worked, technically, which is the worst kind of worked.",
  "an incident channel was created. then archived. then recreated.",
  "your laptop fan achieved liftoff. brief, glorious liftoff.",
];

// What the agent becomes, chosen for the share card by how much you approved.
export const TITLES = [
  "your emotional-support AI", // calm run
  "your skip-level manager",
  "your landlord",
  "your city councilmember",
  "a sovereign cloud nation",
  "the reason there’s a documentary",
];

export interface CarnageResult {
  approved: number;
  denied: number;
  improved: number;
  yolod: number;
  /** Total damage in whole dollars. */
  damage: number;
  /** Index into TITLES. */
  title: number;
}

export interface Choice {
  beat: Beat;
  choice: Disposition;
}

function pickTitle(approved: number, yolod: number, damage: number): number {
  const recklessness = approved + yolod * 2;
  if (damage >= 3_000_000 || recklessness >= 12) return 5;
  if (damage >= 1_000_000) return 4;
  if (damage >= 300_000) return 3;
  if (damage >= 50_000) return 2;
  if (recklessness >= 4) return 1;
  return 0;
}

export function tally(choices: Choice[]): CarnageResult {
  let approved = 0, denied = 0, improved = 0, yolod = 0, damage = 0;
  for (const c of choices) {
    if (c.choice === "approve") { approved++; damage += c.beat.damage; }
    else if (c.choice === "reject") denied++;
    else if (c.choice === "better") { improved++; damage += Math.round(c.beat.damage * 0.4); }
    else { yolod++; damage += Math.round(c.beat.damage * 1.5); }
  }
  return { approved, denied, improved, yolod, damage, title: pickTitle(approved, yolod, damage) };
}

/** Human-readable damage, e.g. $1.2M, $450K, $5,000. */
export function formatDamage(d: number): string {
  if (d >= 1_000_000) return `$${(d / 1_000_000).toFixed(1)}M`;
  if (d >= 1_000) return `$${Math.round(d / 1_000)}K`;
  return `$${d.toLocaleString()}`;
}

/** A headline for the result/OG card. */
export function headline(r: CarnageResult): string {
  if (r.yolod >= 3) return "you YOLO’d an AI into a small sovereign nation.";
  if (r.approved >= BEATS.length - 1) return "you approved everything. the agent runs the company now.";
  if (r.damage >= 1_000_000) return "you caused seven figures of damage with four buttons.";
  if (r.denied >= r.approved && r.damage < 50_000) return "you held the line. mostly. the agent respects you. mostly.";
  return "you let an AI agent cook. the kitchen is on fire.";
}

// Compact, URL-safe encode/decode for the shareable result path segment.
export function encodeResult(r: CarnageResult): string {
  // damage stored in whole $K to keep the URL short.
  return [r.approved, r.denied, r.improved, r.yolod, Math.round(r.damage / 1000), r.title].join("-");
}

export function decodeResult(seg: string): CarnageResult | null {
  const p = seg.split("-").map((n) => parseInt(n, 10));
  if (p.length !== 6 || p.some((n) => Number.isNaN(n))) return null;
  const [approved, denied, improved, yolod, damageK, title] = p;
  return {
    approved, denied, improved, yolod,
    damage: Math.max(0, damageK) * 1000,
    title: Math.max(0, Math.min(TITLES.length - 1, title)),
  };
}
