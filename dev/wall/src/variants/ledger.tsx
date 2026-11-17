import { useState } from "react"
import { cn } from "@/lib/utils"
import { fmt, posts } from "./data"
import { Act } from "./act"
import { useLikes } from "./kit"

// Axis: the feed as a printed index on a Swiss grid. Numbers lead, type does the work. Accent: the top post.
const top = posts.reduce((a, b) => (b.likes > a.likes ? b : a))

export default function Ledger() {
  const [open, setOpen] = useState<string | null>(null)
  const { liked, toggle, count } = useLikes()

  return (
    <div className="mv min-h-svh px-4 py-8 md:px-12 md:py-12">
      <header className="grid grid-cols-12 items-end gap-x-6 border-b border-(--ink) pb-4">
        <h1
          className="mono col-span-12 text-[56px] leading-none tracking-[-0.03em] md:col-span-8 md:text-[96px]"
          style={{ fontWeight: 200, fontStretch: "112.5%" }}
        >
          Feed
        </h1>
        <div className="cap col-span-12 mt-4 flex justify-between text-(--mute) md:col-span-4 md:mt-0 md:flex-col md:items-end md:gap-1">
          <span>Thu 05 Nov 2026</span>
          <span>[{posts.length} entries · last 24h]</span>
        </div>
      </header>

      <div className="cap hidden grid-cols-12 gap-x-6 border-b border-(--rule) py-2 text-(--mute) md:grid">
        <span className="col-span-1">No.</span>
        <span className="col-span-3">From</span>
        <span className="col-span-6">Post</span>
        <span className="col-span-2 text-right">Likes</span>
      </div>

      <ol>
        {posts.map((p, i) => {
          const isTop = p === top
          const isOpen = open === p.handle
          return (
            <li key={p.handle} className="border-b border-(--rule)">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : p.handle)}
                className="grid w-full grid-cols-12 gap-x-6 gap-y-2 py-5 text-left hover:bg-(--well)"
              >
                <span
                  className={cn("mono col-span-2 text-4xl leading-none md:col-span-1", isTop && "text-(--acc)")}
                  style={{ fontWeight: 200 }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="col-span-10 min-w-0 md:col-span-3">
                  <span className="cap block font-semibold break-words">{p.name}</span>
                  <span className="mono block truncate text-xs text-(--mute)">
                    @{p.handle} · {p.time}
                  </span>
                </span>
                <span className="col-span-12 text-lg leading-snug text-pretty break-words md:col-span-6 md:text-xl">
                  {p.text}
                  {p.image ? <span className="cap ml-2 align-middle text-(--mute)">[+ image]</span> : null}
                </span>
                <span className="mono col-span-12 text-sm text-(--mute) md:col-span-2 md:text-right md:text-base">
                  <span className={cn("font-semibold text-(--ink)", isTop && "text-(--acc)")}>
                    {fmt(count(p))}
                  </span>
                  {isTop ? <span className="cap block text-(--acc)">Top today</span> : null}
                </span>
              </button>
              {isOpen ? (
                <div className="grid grid-cols-12 gap-x-6 pb-5">
                  <div className="col-span-12 flex flex-col gap-4 md:col-span-6 md:col-start-5">
                    {p.image ? (
                      <div className="aspect-video border border-(--rule)">
                        <div className="shade size-full" />
                      </div>
                    ) : null}
                    <div className="flex flex-wrap gap-2">
                      <Act label="Reply" n={p.replies} />
                      <Act label="Repost" n={p.reposts} />
                      <Act label="Like" n={count(p)} on={liked.has(p.handle)} onClick={() => toggle(p.handle)} />
                    </div>
                  </div>
                </div>
              ) : null}
            </li>
          )
        })}
      </ol>

      <footer className="cap mt-4 flex justify-between text-(--mute)">
        <span>Sorted by time</span>
        <span>Select an entry to act on it</span>
      </footer>
    </div>
  )
}
