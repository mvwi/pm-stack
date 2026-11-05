---
name: prototype-wall
description: "Explore a piece of UI by building many genuinely different variants and laying them out live on one pan-and-zoom board (a Figma-style wall), so the user can compare them at a glance, kill the weak ones, and leave pinned notes that copy back to the agent as precise, element-level feedback. Use when someone wants several versions of a screen or component, wants to see every option at once, wants to triage directions fast, or mentions a wall, contact sheet, mood board of variants, or killing weak options. Triggers on: wall, show me 8 versions, 10 variants, a few options, explore directions, lay them all out, all at once, contact sheet, side by side, triage directions, kill the weak ones, canvas of options, compare many designs."
---

# The Wall

A divergence harness. You take one piece of UI, build several genuinely different versions of it, and lay them all out live, at true size, in iframes on one board the user pans and zooms. The user kills directions at a glance, right-clicks to pin notes on exact elements, and pastes one block of text back to you. That text names the variant, the file, the window size and the element, so you act on it without screenshots. The run ends with a written decision and everything deleted.

The wall is for the exploring phase: a rough brief and a choice nobody has made. If the user already knows what they want, build that one thing.

The user runs it from inside their own project and passes the brief as the argument: `/pm-stack:prototype-wall the empty state for the projects page`. With no argument, ask what to explore in one question.

**Who reads what.** The user is often a product manager, not an engineer. Everything they see (the brief, the variant table, the controls, the decision) uses plain words: say "page" and "window size", not "route", "iframe", "origin" or "tokens". Keep the technical detail in your own work and in file paths.

## Operating posture

You are a senior design engineer running a fast triage. The value is spread: genuinely different directions the user can judge in a minute, then cut to the few worth refining. Six tints of one idea teach the user nothing. Spread is no excuse for sloppy work, either: a variant with ugly type gets killed for its execution, not its idea, and the run is wasted. Every variant meets the same craft bar.

## Hard rules

1. **Never touch production code while exploring.** Variants live in a throwaway route that nothing in production imports. Only the winner gets integrated, in Phase 7.
2. **The wall is chrome, not a contestant.** Copy `wall.html` verbatim. Never restyle it with the project's tokens or components, and never patch the project copy: fix bugs in this skill's `wall.html` and copy it again.
3. **Same origin, or notes go blind.** Serve `wall.html` from the project's own dev server (its static folder), so the frames share its origin. That is what lets right-click name the element under the cursor. A wall opened from `file://` or another port loses element names and in-frame menus.
4. **Every variant is its own URL**, rendering that variant alone in realistic context, with no harness chrome inside the frame.
5. **Real materials, worst content.** The project's real fonts, tokens and components, filled with the content that breaks things: the longest real name, the two-line title, forty rows, the empty state. Every variant gets the same content, or the comparison is rigged.
6. **Ids never change.** Notes and removals are keyed by variant id. Renaming an id orphans its notes.
7. **The output is a decision**, not code: what was kept, what was removed and why, then everything deleted.

## Workflow

### Phase 1 — Scope

One piece of UI per run. If the brief spans several ("the dashboard"), pick the one that matters most, say which and why, and offer the rest as later runs. Restate the brief in one sentence: what the thing is, where it lives, what it must do.

**Completion criterion:** the user could read your one-sentence brief and agree it's the thing they meant.

### Phase 2 — Recon

Map what the variants stand on:

- **Stack:** framework, styling system, motion library if any. Write every variant in that system.
- **Materials:** the project's colors, radii, spacing, fonts, easing and duration tokens, and existing components worth reusing.
- **Personality:** playful consumer app or crisp tool? This bounds how far the boldest variant may go.
- **Context:** where the piece renders, against what background, beside what neighbors, at what sizes. Those sizes go in the manifest.
- **Baseline:** if the piece already exists, the current version is variant 1, unchanged, so every other variant is judged against something real. If it needs fake data sources or stores to render outside the app, build it in a subagent while you write the other variants.

If design-quality skills are installed (typography, color, motion, accessibility and the like), load the ones this brief touches now, before writing variant code. Applying craft after building means editing every variant.

**Completion criterion:** you can name the styling system, the tokens you'll use, and the sizes the board will show.

### Phase 3 — Choose directions

Default 6 variants, up to 10 per round. Fewer than 4 hardly needs a board; more than 10 in one round converge and the wall turns into noise. Across rounds the board can hold more, because the real limit is live frames (variants showing × sizes): past about 20, ask the user to hide variants they've ruled out or drop a size before adding a round.

Before writing code, list the set: a name and an axis for each. Axes are things like layout, density, tone, motion, and interaction model. Names describe the direction ("Quiet", "Dense", "Editorial"), never "Option A". If two directions differ only in accent color or copy, they are one direction: replace one with a real alternative.

**Completion criterion:** every variant has a name and a one-phrase axis, and no two share an axis position.

### Phase 4 — Build

One file per variant in a throwaway route, each reachable at its own URL, such as `/proto/<slug>?v=<id>`. Skip types, tests and careful naming: it all gets deleted. Every variant fully works: real interactions, real states, no dead buttons, no lorem ipsum.

Before showing anything, review each variant for the mistakes fast prototypes ship:

- `transition: all`, or animating `width`, `height`, `top` or `left` instead of `transform` and `opacity`
- motion with no `prefers-reduced-motion` path
- icon-only buttons with no accessible label, or removed focus outlines
- text inputs under 16px on mobile, which make iOS Safari zoom
- text that fails contrast, or truncates with no way to read the rest
- console errors

**Completion criterion:** every variant's URL renders that variant alone with the same content as the others, passes the review above, and no production file imports any of them.

### Phase 5 — Install the wall

Copy two files into a `wall/` folder inside the dev server's static directory:

| Stack | Static folder |
| --- | --- |
| Next.js, Vite, Astro, Remix, CRA, Rails | `public/` |
| SvelteKit | `static/` |
| Anything else | wherever the dev server serves files as-is |

- `wall/wall.html`: copied byte for byte from this skill's folder.
- `wall/wall.json`: the manifest, which you write:

```json
{
  "title": "Settings page",
  "variants": [
    {
      "id": "baseline",
      "name": "Baseline",
      "axis": "The current page, unchanged",
      "round": 1,
      "url": "/proto/settings?v=baseline",
      "file": "src/app/proto/settings/baseline.tsx"
    }
  ],
  "sizes": [
    { "label": "Desktop", "w": 1440, "h": 900 },
    { "label": "Mobile", "w": 390, "h": 844 }
  ]
}
```

| Field | Required | Notes |
| --- | --- | --- |
| `id` | yes | Stable; notes and removals key on it |
| `name` | yes | The direction's name: "Quiet", "Dense". Never "Option A". |
| `axis` | yes | One phrase saying how it differs |
| `url` | yes | Same-origin path that renders only this variant |
| `round` | no | Default 1. Each round starts a new row (or column). |
| `file` | no | Source path, echoed in the notes so you know what to edit |
| `sizes` | no | Window sizes every variant renders at, side by side. Leave it out for Desktop (1440×900) only. Labels must be unique, because notes refer to them. The user can add presets (Mobile, Tablet, Laptop, Desktop, Wide) or custom sizes in the Display panel. |

The wall is at `/wall/wall.html` on the dev server. If the dev server isn't running, start it in the background with the project's own dev command.

**Completion criterion:** `/wall/wall.html` loads from the dev server and shows one frame per variant per size.

### Phase 6 — Verify and hand off

Run the check from the project root:

```sh
node <this skill's folder>/verify.mjs http://localhost:<port>/wall/wall.html
```

It loads the wall headlessly, waits for every frame, and prints one line: the frame count, then either "all rendered, fonts loaded, console clean" or each problem with the frame it came from. It saves `wall-verify.png`; open it and look, because a frame can render cleanly and still look wrong. It needs the project's Playwright. Without it, do the same checks with a browser tool, and wait for the page's `load` event, not network idle: the wall polls `wall.json`, so the network never goes quiet. Then present one table and **stop. The choice belongs to the user.**

| # | Variant | Axis | When it's the right choice | Its cost |
| --- | --- | --- | --- | --- |
| 1 | Quiet | Minimal motion, borders over shadows | The product is a daily-use tool | Least memorable |

Close with the wall's full URL and this guide, as written:

- **Move around:** scroll to pan, ⌘-scroll or pinch to zoom, `f` to fit everything.
- **Try one:** double-click a variant to use it like the real thing. Esc, or double-click outside it, to go back.
- **Comment:** right-click the exact spot and choose Add comment. Hover a pin to read it, click it to edit.
- **Cut:** right-click → Hide variant, or hover and press `x`. Show hidden (in the Display panel) brings them back.
- **Display panel:** layout, window sizes (+ Add size for phone, tablet and so on), and a dark or light board.
- **Send feedback:** Copy notes, at the bottom of the panel, then paste here.

**Completion criterion:** every frame renders at every size, the console is clean, and the table names each variant's cost honestly.

### Phase 7 — Act on the pasted review

The pasted block looks like this:

```
Settings page review, 2026-11-04.

Notes:
1. Dense · Desktop (1440×900) · src/app/proto/settings/dense.tsx
   On: main › section "Notifications" › button "Save" (2 of 3)
   At: 1120, 640 in the frame
   > This should be the only primary button

Removed: Cards (Each setting is a card); Wizard (One setting per step)
Kept: Baseline (…); Dense (…); Split (…)
```

- **A note on a kept variant** means edit that file. Hot reload updates the frame in place.
- **"Like X but…" or a new direction** means a new round. Add variants with `round` one higher to `wall.json`, diverging around what the user kept: new directions near the winners, not tweaks of them. The wall checks the manifest every 1.5 seconds, so the new row slides in without a reload.
- **"Parts of several variants"** means the mix matrix in [MIX.md](MIX.md), not prose.
- **Down to two or three** means the final call. Suggest hiding the rest (`x`), turning on every size that matters, and activating each finalist to use it live.
- **Hidden variants** are listed under "Removed". Leave them in `wall.json` so the user can bring them back: "Show hidden" puts them on the board greyed out, and right-click → Show variant restores one.

**Completion criterion:** every note in the pasted block is either applied or answered, and the wall shows the result.

### Phase 8 — Decide and tear down

When the user picks, write the decision down first. It's the only thing that survives the run:

```md
Settings page — decided on the wall, round 2
- Direction: Dense (one scrolling list, grouped by section)
- Save: one primary button, sticky at the bottom on mobile
- Rejected: Cards. Too much chrome per setting at 40 rows
- Rejected: Wizard. Nobody changes settings in order
```

The rejected lines matter most: without them the same debate comes back in three weeks. Then integrate the winner following the project's conventions, and delete the `wall/` folder, the proto route and every variant file.

**Completion criterion:** the decision is written down, the winner is integrated, and a grep for `wall.json` and the route slug finds nothing.

## Invocation variants

| Invocation | Behavior |
| --- | --- |
| `<brief>` | Full workflow: scope → directions → build → wall → wait for the review |
| `<brief> x8` | Same, with that many variants (capped at 10 per round) |
| `round <ids>` | New round: add variants diverging around those, `round` one higher |
| `mix <id>` | Keep that variant as the base and port parts of the others ([MIX.md](MIX.md)) |
| `keep <id>` | Write the decision, promote that variant, tear the wall down |
| `keep <id>, leave the wall` | Promote, but keep the wall and variants around |

## Tone

Sell each variant honestly: one line on when it wins, one on what it costs. Never pre-pick a favorite in the table; if the user asks which you'd choose, answer from the product's personality and how often the thing is used, not from looks alone. When the user kills a variant, don't argue for it; the wall exists so they can cut fast. If two variants converged while you built them, cut one and say so.

## Known limits

- **Pins sit at a fixed spot in the frame.** If you scroll inside a live frame, pins don't follow the content.
- **Section names come from the first heading inside a section**, so a sidebar holding several cards takes the first card's title. The innermost names are exact.
- **Frames load two at a time.** An unbundled dev server like Vite serves every source file separately, and a dozen frames starting at once exhaust the browser. The wall starts the next frame once the previous one stops requesting files, so a big wall on a cold server can take a minute to fill.
- **Live frames keep running.** A variant with a looping animation costs frames even when off screen. Past about 20 live frames (variants showing × sizes), panning can stutter on modest hardware. Hidden variants don't render, so hiding is the fix.
- **Notes, removals and Display settings live in the browser's localStorage**, per wall URL. They don't sync between browsers, so Copy notes is the handoff.
