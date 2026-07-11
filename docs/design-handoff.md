# Handoff: jlamb.sh — Personal Dev Homepage

## Overview
A personal homepage for `jlamb.sh` built around one conceit: **the URL is a shell script, and visiting the page executes it**. On load, a zsh/powerlevel10k-style prompt types `./jlamb.sh`, "runs" it (transient-prompt style — the command collapses into a small history line), and the page content fades in section-by-section as the script's output. A working command line (`/` key) lets visitors run `help`, `whoami`, `ls`, `cat`, `sudo`, etc.

## About the Design Files
The file in this bundle (`jlamb.sh Homepage.dc.html`) is a **design reference created in HTML** — a prototype showing intended look and behavior, not production code to ship directly. The task is to **recreate this design in the target codebase**. No environment exists yet, so choose whatever fits: this is a great candidate for a static site (plain HTML/CSS/JS, Astro, or a small Vite + React/Preact app). It has no backend requirements for v1. Keep it fast and dependency-light — the whole point is a page that boots like a terminal.

## Fidelity
**High-fidelity.** Colors, typography, spacing, copy, and interactions are final and approved. Recreate pixel-perfectly.

## Fonts
- Primary: **MesloLGS NF** (the powerlevel10k-recommended Nerd Font). **Self-host the TTFs** — source them from the `romkatv/powerlevel10k-media` GitHub repo (Regular, Bold, Italic). The prototype hot-links them via jsDelivr; do not do that in production.
- Fallbacks: `'Fira Code', 'JetBrains Mono', monospace` (Google Fonts).
- Nerd-font glyphs used (private-use-area codepoints — they require MesloLGS NF):
  - `U+F17C` — Linux/Tux icon (first prompt segment)
  - `U+E0A0` — git branch icon (`main` segment)
  - `U+E0B1` — thin powerline separator between segments

## Design Tokens
Colors:
- Page background: `#101116`
- Panel/drawer background: `#16171f`; hover row background: `#1a1b23`; kbd chip: `#1f2029`
- Prompt segment background (p10k "Classic" style): `#383838`; thin separator glyph: `#6e6e6e`
- Text primary: `#e8ecf5`; body: `#c8cede`; secondary: `#aab2c5`; muted: `#8d94a8`; faint: `#6f7486`; disabled/placeholder: `#5b6172`
- Accent blue (dir segment text, links, `.sh` in title): `#37a6d4`; link default: `#6ca1e0`, link hover: `#9ec3f0`
- Accent green (prompt `❯`, git segment text): `#5fd75f`; success/status green (`✓ · 0.3s`, `$ cmd` captions, `● live`): `#4e9a06`
- Accent yellow (list bullets `▸`): `#d8a03c`
- Error red (`sudo` nav item, permission-denied output): `#cc4b4b`
- Borders: `rgba(255,255,255,.12)` cards, `.14` dashed placeholder & drawer top, `.15` pill buttons, `.08` footer rule

Typography scale (all MesloLGS NF stack):
- Hero title: `clamp(30px, 5vw, 46px)` / 700 / letter-spacing -1px / line-height 1.15 (typing phase: `clamp(26px,5vw,42px)`)
- Prompt segments: 16px (icons 17px); hero description: 15px / line-height 1.65
- Body/lists: 13.5px; cards: 14.5px titles, 12.5px descriptions; nav: 12.5px; history line: 13px; `$ cmd` captions: 12px; status chips: 11–11.5px

Layout: single column, `max-width: 960px`, centered, `padding: 0 24px`, bottom padding 120px. Cards: radius 8px; pills/buttons: radius 4–5px; rows: radius 5px.

## Screens / Views

### 1. Boot phase (`isTyping`)
- Top of page (26px from top): the p10k prompt, two lines.
- Line 1 — powerline segments, all `#383838` bg ("Classic" style), height 34px, 13px horizontal padding, separated by `U+E0B1` in `#6e6e6e` (no padding on separator spans), ending in a solid `#383838` CSS triangle end-cap (border-left 15px, border-top/bottom 17px transparent):
  1. Tux icon (`U+F17C`, `#f0f0f0`) + `jlamb` (`#f0f0f0`), 8px gap
  2. `~/www` in `#37a6d4`
  3. Branch icon (`U+E0A0`) + `main` in `#5fd75f`, 7px gap
- Line 2 (20px below) — `❯ ` in green + `./jlamb.sh` typed character-by-character (85ms/char, 500ms initial delay), followed by a blinking block cursor (14×32px, `#c8cede`, 1.1s step blink).
- After typing completes, hold 400ms, then switch to run phase **instantly** (no transition — like a terminal redraw).

### 2. Run phase — page as script output
Sections top to bottom (each animates in with `bootline`: fade + 5px rise, .45s ease, staggered delays shown below; the history line and hero prompt segments appear **instantly**, no animation):

1. **History line** (instant): `❯ ./jlamb.sh` small (13px, command in `#8d94a8`), right-aligned `✓ · 0.3s` in green 11.5px, `white-space: nowrap`.
2. **Nav** (delay .15s): left `jlamb.sh` in `#6f7486`; right links (20px gap): projects, now, shelf, contact (anchor links, `#8d94a8` → white on hover, no underline) + `sudo` in red (clicking it opens the CLI drawer and prints the sudo denial).
3. **Hero** (padding 56px 0 40px): the same p10k segment row as boot phase, redrawn instantly at this position (this is the "fresh prompt" of transient-prompt zsh). Then title `jlamb.sh` (`.sh` in blue) at delay .35s, then description at .55s:
   > hi! i like making computers do cool things, and helping others do the same. this page is alive. check out some cool stuff.
   (15px, `#8d94a8`, max-width 560px)
4. **Projects** (delay .75s): caption `$ ls ~/projects --live` (12px green). Grid `repeat(auto-fit, minmax(240px, 1fr))`, 14px gap:
   - Card `pt.jlamb.sh` → links to https://pt.jlamb.sh, `● live` chip in green; description "a little tool, running in your browser"
   - Card `caelia.jlamb.sh` → https://caelia.jlamb.sh, `● live`; "roleplaying, made interactive"
   - Placeholder card `next-thing/` (dashed border, muted text), `○ soon`; "reserved for the next experiment"
   - Card: 1px solid border, radius 8, padding 18px; hover: border-color `#37a6d4`; whole card is the link.
5. **Now** (delay .95s): caption `$ cat now.md`. Output block with 2px left border `#383838`, 18px left padding, line-height 2, `▸` bullets in yellow:
   - building cool stuff for ttrpg's
   - tinkering and hacking things
   - other stuff, for sure
6. **Shelf** (delay 1.15s): two columns (`auto-fit minmax(260px,1fr)`, 24px gap):
   - `$ ls ~/cheatsheets`: rows tmux.md, git.md, vim.md, dotfiles/ — filename in link-blue, right-aligned "soon" in `#6f7486`; row hover bg `#1a1b23`, padding 7px 10px, radius 5px.
   - `$ ls ~/links`: tools.md, reading.md, me.md — same treatment.
7. **Contact** (delay 1.35s): caption `$ cat contact.md`. Two pill links (1px border, radius 5, padding 8px 14px, hover border blue):
   - `github → solarswordsman` → https://github.com/solarswordsman
   - ` → mail@jlamb.sh` → mailto:mail@jlamb.sh
8. **Sudo hint** (delay 1.55s, toggleable): `❯ sudo ls ~/private` then red output: "visitor is not in the sudoers file. this incident will be reported."
9. **Footer prompt** (delay 1.75s): top rule `rgba(255,255,255,.08)`, 44px above. Green `❯` + blinking cursor (8×15px) + "press `/` for the command line" (the `/` is a clickable kbd chip: `#1f2029` bg, 3px radius). Right side: `↻ replay` pill button that reruns the whole boot.

### 3. Command-line drawer
- Fixed to viewport bottom, full width; inner content max-width 960px centered; bg `#16171f`, 1px top border `rgba(1, 1, 1, 0.14)`, shadow `0 -8px 30px rgba(0,0,0,.55)`.
- Output history above input, max-height 38vh, scrollable, auto-scrolls to bottom on new output. Each entry: `❯ command` (white) then output (`#aab2c5`, `white-space: pre-wrap`, line-height 1.7).
- Input row: green `❯`, borderless transparent input (14px, inherits font, placeholder ``try `help```), and an `esc` chip button that closes the drawer.

## Interactions & Behavior
- **Open CLI**: `/` key anywhere (unless focus is in an input/textarea/contenteditable — and preventDefault to beat Firefox quick-find), or clicking the footer `/` chip, or the nav `sudo` item. Focus the input on open.
- **Close CLI**: Escape key, `esc` chip, or `exit` command.
- **Command history**: ArrowUp/ArrowDown recall previous commands.
- **Commands** (trim input; unknown → `zsh: command not found: <cmd>`):
  - `help` / `man jlamb` — lists: whoami, ls [dir], cat <file>, neofetch, sudo <cmd>, clear, exit (with one-line descriptions)
  - `whoami` — "jlamb — software engineer. builds interactive tools for / tabletop roleplaying: sheets, dice, foundry modules."
  - `ls` — `projects/    cheatsheets/    links/    now.md    contact.md`; `ls projects` → `pt.jlamb.sh    caelia.jlamb.sh`; `ls cheatsheets` → `tmux.md    git.md    vim.md    dotfiles/`; `ls links` → `tools.md    reading.md    me.md`; `ls private` → Permission denied; anything else → No such file or directory. (Accept `~/`-prefixed and trailing-slash forms.)
  - `cat now.md` — the now list as markdown; `cat contact.md` — "github: solarswordsman / mail: mail@jlamb.sh"; other files → No such file or directory
  - `sudo <anything>` — "visitor is not in the sudoers file. this incident will be reported."
  - `neofetch` — ASCII-art tux-ish block with: os: linux (obviously) · shell: zsh + p10k · editor: vim (btw) · host: jlamb.sh · uptime: since forever
  - Easter eggs: `rm -rf /` → "nice try."; `vim`/`vi`/`nvim` → "you're in vim now. good luck. (:q to quit)"; `:q`/`:q!`/`:wq` → "phew."; `./jlamb.sh` → "already running."
  - `clear` — empties drawer history; `exit` — closes drawer
- **Replay** button restarts the boot sequence from the typing phase.
- **Animations**: `blink` = opacity 1→0 at 50%, 1.1s, step-end, infinite. `bootline` = from opacity 0 / translateY(5px) to visible, .45s ease, per-section delays as listed, `both` fill.
- **Responsive**: single column layout; grids collapse via auto-fit minmax; hero title scales via clamp; nav links wrap. Works down to ~360px.
- Consider honoring `prefers-reduced-motion` by skipping the boot animation (equivalent to the `boot=false` flag below).

## State Management
- `phase`: `"typing" | "run"`; `typed`: substring of `./jlamb.sh` typed so far
- `cliOpen`: boolean; `cliInput`: string; `cliHistory`: `{cmd, out}[]`; command log + cursor for arrow-key recall
- Config flags in the prototype (nice as query params or build flags): `boot` (default true — false skips straight to run phase), `typeSpeed` (ms/char, default 85), `sudoHint` (default true — toggles section 8)
- No data fetching in v1. Future: an authenticated `~/private` area (the sudo joke is the teaser) and real content for cheatsheets/links/dotfiles.

## Assets
- No images. All visuals are type, CSS, and nerd-font glyphs.
- MesloLGS NF Regular/Bold/Italic TTFs — self-host (from romkatv/powerlevel10k-media).
- CSS-triangle powerline end-cap (border trick) — or render `U+E0B0` in `#383838` with the nerd font instead.

## Files
- `jlamb.sh Homepage.dc.html` — the approved high-fidelity prototype (open in a browser; markup is in the `<x-dc>` template, behavior in the `Component` class). Treat its inline styles as the source of truth for any value not listed above.
