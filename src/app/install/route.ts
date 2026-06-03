// The homepage hero prints `$ curl -fsSL sudo.supply/install | sh`. This makes
// that one-liner real: it serves a short, readable shell script that installs
// nothing and changes nothing on the user's machine. It just prints an ASCII
// [sudo] banner, the xkcd #149 "sudo make me a sandwich" gag, and the actual
// links to the app + hardware, then exits 0. Curling it without a pipe shows
// the harmless source; piping to sh prints the banner.
//
// Kept intentionally trustworthy: no network calls, no sudo, no file writes,
// no eval — the reassurance is in the first comment lines so a security-minded
// reader sees it's safe before reading further.

// String.raw keeps backslash escapes literal so `\033` reaches sh intact.
// Avoids backticks (would close the template) and `${` (would interpolate);
// shell vars use `$VAR` / `$(...)` which are safe inside a template literal.
const SCRIPT = String.raw`#!/bin/sh
# ----------------------------------------------------------------------
#  [sudo] - sudo.supply
#  you ran:  curl -fsSL sudo.supply/install | sh
#  relax: this script installs NOTHING and changes NOTHING on your machine.
#  it just prints where to actually get [sudo]. read it - it is short.
# ----------------------------------------------------------------------

# colour only when writing to a real terminal (skip when piped onward)
if [ -t 1 ]; then G=$(printf '\033[32m'); B=$(printf '\033[1m'); D=$(printf '\033[2m'); R=$(printf '\033[0m'); else G=; B=; D=; R=; fi

printf '%s%s' "$G" "$B"
cat <<'ART'
   +----------------------+
   |     [ s u d o ]      |
   |  approve. or do not. |
   +----------------------+
ART
printf '%s\n' "$R"

printf '%s$ sudo make me a sandwich%s\n' "$D" "$R"
sleep 1 2>/dev/null || true
printf 'Okay.\n\n'

printf 'a four-key macro pad that approves your AI agents with a real button press.\n\n'

printf '  %smac app%s       https://github.com/ibrue/sudo-app/releases/latest\n' "$B" "$R"
printf '  %sfrom source%s   git clone https://github.com/ibrue/sudo-app\n' "$B" "$R"
printf '  %sthe hardware%s  https://sudo.supply/shop\n\n' "$B" "$R"

printf '%s(this script did nothing. that was the joke. now go press a real button.)%s\n' "$D" "$R"
`;

export const runtime = "nodejs";
export const dynamic = "force-static";

export function GET() {
  return new Response(SCRIPT, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
}
