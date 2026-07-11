# jlamb.sh

A personal dev homepage built around one conceit: **the URL is a shell script, and
visiting the page executes it.** On load, a zsh/powerlevel10k-style prompt types
`./jlamb.sh`, "runs" it, and the page content fades in section-by-section as the
script's output. Press `/` (or click the footer chip) for a working command line —
try `help`, `whoami`, `ls`, `cat`, `neofetch`, `sudo`.

Static site, no framework — plain TypeScript + Vite, so it boots as fast as the
terminal it imitates.

## Develop

```sh
npm install
npm run dev        # vite dev server
npm run lint       # eslint (tabs, typescript-eslint)
npm test           # vitest — command dispatcher + boot/CLI DOM smoke tests
npm run build      # tsc typecheck + vite production build → dist/
npm run preview    # serve the production build locally
```

## Config flags

Passed as query params (handy for previewing states):

| Param        | Default | Effect                                             |
| ------------ | ------- | -------------------------------------------------- |
| `boot`       | `true`  | `false` skips the typing animation, jumps to run   |
| `typeSpeed`  | `85`    | ms per character while typing `./jlamb.sh`         |
| `sudoHint`   | `true`  | `false` removes the `sudo ls ~/private` teaser     |

`prefers-reduced-motion: reduce` is honored automatically (equivalent to `boot=false`,
and boot/blink animations are disabled).

## Structure

- `index.html` — the full markup for both phases (boot + run) and the CLI drawer.
- `src/main.ts` — boot/typing sequence, phase switching, replay, wiring.
- `src/cli.ts` — command-line drawer: open/close, history recall, output rendering.
- `src/commands.ts` — pure `exec()` command table (unit-tested in isolation).
- `src/config.ts` — query-param + reduced-motion config.
- `src/style.css` — all visuals; design tokens from the handoff.
- `public/fonts/` — self-hosted MesloLGS NF TTFs (the p10k nerd font).

## Fonts

MesloLGS NF (Regular/Bold/Italic) is **self-hosted** from `public/fonts/`, sourced from
[romkatv/powerlevel10k-media](https://github.com/romkatv/powerlevel10k-media). It
supplies the powerline glyphs (tux `U+F17C`, git branch `U+E0A0`, thin separator
`U+E0B1`). Fallbacks: Fira Code / JetBrains Mono (Google Fonts).

## Deploy

Netlify, configured in `netlify.toml` (mirrors the adjacent caelia/decompress sites):
the deploy runs `npm run lint && npm test && npm run build` and publishes `dist/`.

## Design reference

The approved high-fidelity prototype and its detailed spec live in
[`docs/design-handoff.md`](docs/design-handoff.md) and `design_handoff/`. Treat the
prototype's values as the source of truth for anything not captured here.
