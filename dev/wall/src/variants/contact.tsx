import { useState } from "react"
import { cn } from "@/lib/utils"
import { fmt, posts } from "./data"
import { Act } from "./act"
import { useLikes } from "./kit"

// Axis: a contact sheet. Every post at once as a tile; open one and it takes the accent ground in place,
// so the grid never reflows or leaves holes.
// Count cells show reach by order of magnitude, so loud posts read at a glance.
const cells = (n: number) => Math.min(5, Math.floor(Math.log10(n + 1)))

export default function Contact() {
  const [open, setOpen] = useState<string | null>(null)
  const { liked, toggle, count } = useLikes()

  return (
    <div className="mv min-h-svh p-4 md:p-8">
      <header className="cap mb-4 flex items-baseline justify-between border-b border-(--ink) pb-3">
        <h1 className="font-semibold">Contact sheet</h1>
        <span className="text-(--mute)">[{posts.length} frames · 24h]</span>
      </header>

      <ul className="grid grid-cols-2 border-t border-l border-(--rule) md:grid-cols-4">
        {posts.map((p, i) => {
          const isOpen = open === p.handle
          const filled = cells(count(p))
          return (
            <li
              key={p.handle}
              className={cn("min-w-0 border-r border-b border-(--rule) bg-(--paper)", isOpen && "mv-acc")}
            >
              <article className="flex h-full min-h-[260px] flex-col">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : p.handle)}
                  className="flex flex-1 flex-col gap-3 p-4 text-left hover:bg-(--well)"
                >
                  <span className="cap flex w-full items-baseline gap-2 border-b border-(--rule) pb-2">
                    <span className="text-(--mute)">{String(i + 1).padStart(2, "0")}</span>
                    <span className="min-w-0 truncate font-semibold" title={p.name}>
                      {p.name}
                    </span>
                    <span className="ml-auto shrink-0 text-(--mute)">{p.time}</span>
                  </span>
                  {p.image ? (
                    <span className={cn("block border border-(--rule)", "aspect-[2/1]")}>
                      <span className="shade block size-full" />
                    </span>
                  ) : null}
                  <span
                    className={cn(
                      "break-words",
                      isOpen ? "text-lg leading-snug text-pretty" : "line-clamp-4 text-sm leading-normal",
                    )}
                  >
                    {p.text}
                  </span>
                </button>
                <div className="flex flex-wrap items-center gap-3 border-t border-(--rule) px-4 py-3">
                  <span className="flex gap-[3px]" aria-label={`${fmt(count(p))} likes`} role="img">
                    {Array.from({ length: 5 }, (_, n) => (
                      <span
                        key={n}
                        className={cn("size-1.5 border border-(--ink)", n < filled && "bg-(--ink)")}
                      />
                    ))}
                  </span>
                  <span className="cap font-semibold">{fmt(count(p))}</span>
                  {isOpen ? (
                    <span className="flex w-full flex-wrap gap-2">
                      <Act label="Reply" n={p.replies} />
                      <Act label="Repost" n={p.reposts} />
                      <Act label="Like" n={count(p)} on={liked.has(p.handle)} onClick={() => toggle(p.handle)} />
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => toggle(p.handle)}
                      aria-pressed={liked.has(p.handle)}
                      className="cap ml-auto text-(--mute) hover:text-(--ink) aria-pressed:text-(--ink) aria-pressed:underline"
                    >
                      {liked.has(p.handle) ? "Liked" : "Like"}
                    </button>
                  )}
                </div>
              </article>
            </li>
          )
        })}
      </ul>

      <footer className="cap mt-3 flex justify-between text-(--mute)">
        <span>Each cell = ×10 likes</span>
        <span>Open a frame to read it whole</span>
      </footer>
    </div>
  )
}
