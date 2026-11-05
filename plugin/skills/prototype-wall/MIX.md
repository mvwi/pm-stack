# Mixing variants

Run this when the user wants one variant with parts of others: "Dense, but with the sticky save bar from Split." Don't ask them to describe the merge in prose. A sentence drops the details that mattered, and the rebuild drifts. Turn it into a short list of choices instead.

## When

- `mix <id>`.
- A pasted review or reply that names parts of more than one variant.
- **Not** when the user wants a new direction (that's a new round) or a different value for one number (just ask or change it).

## Build the list

1. **The base stays whole.** The named variant keeps its axis, layout and every behavior no row replaces.
2. **List what the others do differently.** Each row is one thing the user can see or do: an element, a behavior, a state. Code differences are not rows.
3. **Drop rows that change the base's axis.** Test: say "the base, plus this" in one sentence. If the sentence describes a different direction ("Dense, but with Editorial's layout"), the row isn't portable. Drop it; if the user asked for it, say the base may be the wrong pick and offer to mix the other way.
4. **Merge rows that only work together**, and mark rows that need another one ("needs the trim handles").
5. **Eight rows at most.** Past that the user ticks everything. Take the eight that change the base most; mix again after.

Say in one line which rows you dropped in step 3, so the user knows you considered them.

## Ask

Each row shows:

- **Feature:** a short name, then one line on what the user sees.
- **From:** the variant (or variants) that have it.
- **Base today:** what the base does instead. This turns every tick into a trade; without it the user ticks everything and the base loses its character.

Use the host's multi-select question tool if it has one, splitting rows across questions if it caps the options. Otherwise post a numbered table and ask for a reply like `1, 3, 4`. End with one open question: "Anything else about how the base should work?"

## Build the result

- **One merged variant:** the base, plus the ticked rows, plus the answer to the open question. Nothing else sneaks in because it was easy.
- **Add it as a new round** in `wall.json`, named after the base with a plus (`Dense+`) and a new id. The originals stay on the board: a mix that sounded right can lose on the page, and only against the variants it came from.
- **Re-test with the base's worst content.** A feature that lived on short data in its old variant has never met the base's forty rows.

Report one line per adopted feature: where it landed and what it cost the base. Then stop.

## In the decision

The Phase 8 decision gets a base line, one line per adopted feature with its source, and one line per feature left behind, with the reason, in the user's words if they gave one.
