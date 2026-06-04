// Per-app button profiles for the /try demo. The companion app detects which
// app is in front and auto-remaps the four physical keys. The keycaps stay the
// same colour (the traffic colorway); only what each key DOES changes per app.

export interface KeyAction {
  label: string;
  /** What it does, shown smaller under the label. */
  action: string;
  /** The key/shortcut it fires. */
  hotkey: string;
}

export interface AppProfile {
  id: string;
  /** App name as the "detected active window". */
  name: string;
  /** Short mono tag shown in the title bar. */
  tag: string;
  /** How the app surfaces its buttons (ties to the real detection stack). */
  detect: string;
  /** The four keys, board order: green, red, yellow, black. */
  keys: [KeyAction, KeyAction, KeyAction, KeyAction];
}

// Fixed keycap colours of the traffic colorway (green/red/yellow/black).
export const KEY_COLORS = ["#3FA66F", "#E03C2B", "#F2C71F", "#1f1f1f"] as const;
export const KEY_TEXT = ["text-black", "text-black", "text-black", "text-white"] as const;

export const PROFILES: AppProfile[] = [
  {
    id: "claude",
    name: "Claude",
    tag: "claude.ai · desktop",
    detect: "accessibility tree",
    keys: [
      { label: "Approve", action: "allow this action", hotkey: "⌃⇧F13" },
      { label: "Reject", action: "deny it", hotkey: "⌃⇧F14" },
      { label: "Make it better", action: "ask it to improve", hotkey: "⌃⇧F15" },
      { label: "YOLO", action: "allow all, this session", hotkey: "⌃⇧F16" },
    ],
  },
  {
    id: "cursor",
    name: "Cursor",
    tag: "cursor · editor",
    detect: "accessibility tree",
    keys: [
      { label: "Accept", action: "accept the diff", hotkey: "⌃⇧F13" },
      { label: "Reject", action: "discard the diff", hotkey: "⌃⇧F14" },
      { label: "Iterate", action: "follow-up edit", hotkey: "⌃⇧F15" },
      { label: "Run all", action: "accept + run", hotkey: "⌃⇧F16" },
    ],
  },
  {
    id: "claude-code",
    name: "Claude Code",
    tag: "terminal · agent",
    detect: "keyboard fallback",
    keys: [
      { label: "Yes", action: "y ⏎", hotkey: "⌃⇧F13" },
      { label: "No", action: "n ⏎", hotkey: "⌃⇧F14" },
      { label: "Plan", action: "switch to plan mode", hotkey: "⌃⇧F15" },
      { label: "Interrupt", action: "esc", hotkey: "⌃⇧F16" },
    ],
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    tag: "chatgpt · web",
    detect: "vision OCR",
    keys: [
      { label: "Continue", action: "keep going", hotkey: "⌃⇧F13" },
      { label: "Stop", action: "stop generating", hotkey: "⌃⇧F14" },
      { label: "Regenerate", action: "try again", hotkey: "⌃⇧F15" },
      { label: "Copy", action: "copy the reply", hotkey: "⌃⇧F16" },
    ],
  },
  {
    id: "vscode",
    name: "VS Code",
    tag: "code · editor",
    detect: "accessibility tree",
    keys: [
      { label: "Save", action: "⌘S", hotkey: "⌃⇧F13" },
      { label: "Format", action: "format document", hotkey: "⌃⇧F14" },
      { label: "Comment", action: "toggle ⌘/", hotkey: "⌃⇧F15" },
      { label: "Run", action: "run task", hotkey: "⌃⇧F16" },
    ],
  },
  {
    id: "discord",
    name: "Discord",
    tag: "discord · voice",
    detect: "window title",
    keys: [
      { label: "Unmute", action: "toggle mic", hotkey: "⌃⇧F13" },
      { label: "Deafen", action: "toggle deafen", hotkey: "⌃⇧F14" },
      { label: "Push to talk", action: "hold to speak", hotkey: "⌃⇧F15" },
      { label: "Soundboard", action: "trigger a clip", hotkey: "⌃⇧F16" },
    ],
  },
];
