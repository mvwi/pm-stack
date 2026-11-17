import { useState } from "react"
import { fmt, posts } from "./data"
import { Act } from "./act"
import { useLikes } from "./kit"

// Axis: batching. The day arrives as one short read: three headlines, the rest as one-liners, then done.
// Accent does one job: how far through today's read you are.
const ranked = [...posts].sort((a, b) => b.likes - a.likes)
const top = ranked.slice(0, 3)
const rest = ranked.slice(3)

export default function Digest() {
  const [read, setRead] = useState<Set<string>>(new Set())
  const { liked, toggle, count } = useLikes()
  const mark = (h: string) => setRead((s) => new Set(s).add(h))
  const done = read.size === posts.length
  const pct = Math.round((read.size / posts.length) * 100)

  return (
    <div className="mv min-h-svh px-4 py-8 md:px-10 md:py-12">
      <div className="mx-auto max-w-[720px]">
        <header className="border-b border-(--ink) pb-4">
          <div className="cap flex justify-between text-(--mute)">
            <span>Thu 05 Nov · daily digest</span>
            <span>[{posts.length} posts · 4 min]</span>
          </div>
          <h1
            className="mono mt-4 text-[40px] leading-none tracking-[-0.03em] md:text-[56px]"
            style={{ fontWeight: 200, fontStretch: "112.5%" }}
          >
            Your day
          </h1>
          <div className="mt-5 flex items-center gap-3">
            <div
              role="progressbar"
              aria-label="Read"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              className="h-2 flex-1 rounded-full border border-(--ink)"
            >
              <div
                className="h-full rounded-full bg-(--acc) transition-[width] duration-300 ease-out motion-reduce:transition-none"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="cap whitespace-nowrap">{read.size} / {posts.length} read</span>
          </div>
        </header>

        {done ? (
          <section className="py-16 text-center">
            <p className="cap text-(--mute)">[caught up]</p>
            <p className="mt-3 text-2xl text-balance">That's everything since yesterday. See you tomorrow.</p>
            <button
              type="button"
              onClick={() => setRead(new Set())}
              className="cap mt-6 h-9 rounded-full border border-(--rule) px-4 hover:border-(--ink)"
            >
              Read it again
            </button>
          </section>
        ) : (
          <>
            <section aria-label="Headlines" className="divide-y divide-(--rule)">
              {top.map((p, i) => (
                <article key={p.handle} className={read.has(p.handle) ? "py-6 opacity-50" : "py-6"}>
                  <div className="cap flex gap-3 text-(--mute)">
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <span className="min-w-0 truncate font-semibold text-(--ink)" title={p.name}>
                      {p.name}
                    </span>
                    <span className="ml-auto shrink-0">{fmt(count(p))} likes</span>
                  </div>
                  <p className="mt-2 text-xl leading-snug text-pretty break-words md:text-2xl">{p.text}</p>
                  {p.image ? (
                    <div className="mt-3 aspect-[3/1] border border-(--rule)">
                      <div className="shade size-full" />
                    </div>
                  ) : null}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Act label="Like" n={count(p)} on={liked.has(p.handle)} onClick={() => toggle(p.handle)} />
                    <button
                      type="button"
                      onClick={() => mark(p.handle)}
                      disabled={read.has(p.handle)}
                      className="cap h-8 rounded-full border border-(--rule) px-3 text-(--mute) hover:text-(--ink) disabled:opacity-60"
                    >
                      {read.has(p.handle) ? "Read" : "Mark read"}
                    </button>
                  </div>
                </article>
              ))}
            </section>

            <section aria-label="Also today" className="mt-4 border-t border-(--ink) pt-3">
              <h2 className="cap font-semibold">Also today</h2>
              <ul className="mt-2">
                {rest.map((p) => (
                  <li key={p.handle} className="border-b border-(--rule)">
                    <button
                      type="button"
                      onClick={() => mark(p.handle)}
                      className="grid w-full grid-cols-[14ch_1fr] gap-4 py-3 text-left hover:bg-(--well) aria-pressed:opacity-50"
                      aria-pressed={read.has(p.handle)}
                    >
                      <span className="cap truncate font-semibold" title={p.name}>
                        {p.name}
                      </span>
                      <span className="text-sm break-words">{p.text}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setRead(new Set(posts.map((p) => p.handle)))}
                className="cap mt-6 h-9 rounded-full bg-(--ink) px-4 font-semibold text-(--paper)"
              >
                Mark all read
              </button>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
