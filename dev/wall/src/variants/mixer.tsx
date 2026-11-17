import { useState } from "react"
import { cn } from "@/lib/utils"
import { fmt, posts, type Post } from "./data"
import { useLikes } from "./kit"

// Axis: many columns at once, like channel strips on a mixer. Each column is a saved filter you can mute.
// Accent does one job: the column you're working in.
const channels: { id: string; name: string; test: (p: Post) => boolean }[] = [
  { id: "all", name: "All", test: () => true },
  { id: "top", name: "Top", test: (p) => p.likes >= 5000 },
  { id: "media", name: "Media", test: (p) => !!p.image },
  { id: "quiet", name: "Quiet voices", test: (p) => p.likes < 100 },
]

export default function Mixer() {
  const [muted, setMuted] = useState<Set<string>>(new Set())
  const [active, setActive] = useState("all")
  const { liked, toggle, count } = useLikes()
  const on = channels.filter((c) => !muted.has(c.id))

  return (
    <div className="mv flex h-svh flex-col">
      <header className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-(--ink) px-4 py-3">
        <h1 className="cap font-semibold">Mixer</h1>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Channels">
          {channels.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={!muted.has(c.id)}
              onClick={() =>
                setMuted((m) => {
                  const n = new Set(m)
                  if (n.has(c.id)) n.delete(c.id)
                  else if (on.length > 1) n.add(c.id) // keep one channel open
                  return n
                })
              }
              className="cap h-8 rounded-full border border-(--rule) px-3 text-(--mute) aria-pressed:border-(--ink) aria-pressed:text-(--ink)"
            >
              <span aria-hidden className="mr-2 inline-block size-1.5 rounded-full border border-current align-middle [[aria-pressed=true]_&]:bg-current" />
              {c.name}
            </button>
          ))}
        </div>
        <span className="cap ml-auto text-(--mute)">[{on.length} of {channels.length} channels]</span>
      </header>

      <div className="flex min-h-0 flex-1 overflow-x-auto">
        {on.map((c) => {
          const list = posts.filter(c.test)
          const isActive = active === c.id
          return (
            <section
              key={c.id}
              aria-label={c.name}
              onFocusCapture={() => setActive(c.id)}
              onPointerDown={() => setActive(c.id)}
              className="flex w-[340px] min-w-[300px] shrink-0 flex-col border-r border-(--rule) md:w-auto md:flex-1"
            >
              <div
                className={cn(
                  "cap flex items-baseline justify-between border-b-2 px-4 py-2 font-semibold",
                  isActive ? "border-(--acc) text-(--acc)" : "border-transparent",
                )}
              >
                <span>{c.name}</span>
                <span className="font-normal text-(--mute)">[{list.length}]</span>
              </div>
              <ul className="min-h-0 flex-1 overflow-y-auto">
                {list.length ? (
                  list.map((p) => (
                    <li key={p.handle} className="border-b border-(--rule) px-4 py-3">
                      <div className="cap flex gap-2">
                        <span className="min-w-0 truncate font-semibold" title={p.name}>
                          {p.name}
                        </span>
                        <span className="ml-auto shrink-0 text-(--mute)">{p.time}</span>
                      </div>
                      <p className="mt-1 text-sm leading-normal break-words">{p.text}</p>
                      {p.image ? (
                        <div className="mt-2 aspect-[2/1] border border-(--rule)">
                          <div className="shade size-full" />
                        </div>
                      ) : null}
                      <div className="cap mt-2 flex gap-4 text-(--mute)">
                        <span>Re {fmt(p.replies)}</span>
                        <button
                          type="button"
                          onClick={() => toggle(p.handle)}
                          aria-pressed={liked.has(p.handle)}
                          aria-label={`Like, ${count(p)}`}
                          className="hover:text-(--ink) aria-pressed:font-semibold aria-pressed:text-(--ink)"
                        >
                          {liked.has(p.handle) ? "Liked" : "Like"} {fmt(count(p))}
                        </button>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="cap px-4 py-8 text-(--mute)">Nothing here yet</li>
                )}
              </ul>
            </section>
          )
        })}
      </div>
    </div>
  )
}
