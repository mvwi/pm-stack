# prototype-wall dev harness

A Vite app with eight variants of one feed, for working on the prototype-wall skill.

- `pnpm install && pnpm dev`, then open `/`. It redirects to the wall.
- `public/wall/wall.html` is a symlink to `plugin/skills/prototype-wall/wall.html`, so edits here land in the skill. Real projects get a copy, never a link.
- `public/wall/wall.json` is the manifest: names, axes and rounds.
- `/?v=<id>` renders one variant. Ids map to components in `src/variants/index.ts`.
- Shared components are shadcn on Base UI, in `src/components/ui`.
