import { useState } from "react"
import { posts } from "./data"
import { Act } from "./act"
import { minutes, useLikes } from "./kit"

// Axis: time and weight made visible. Posts hang off a time rail; dot area is likes, quiet gaps are labeled.
// Accent does one job: the tinted band of posts since your last visit.
const LAST_VISIT = 30 // minutes ago
const gap = (m: number) => (m >= 1440 ? `${Math.round(m / 1440)}d` : m >= 60 ? `${Math.round(m / 60)}h` : `${m}m`)

export default function Timeline() {
  const [byReach, setByReach] = useState(false)
  const { liked, toggle, count } = useLikes()
  const list = byReach ? [...posts].sort((a, b) => b.likes - a.likes) : posts
  const max = Math.max(...posts.map((p) => p.likes))

  return (
    <div className="mv min-h-svh px-4 py-8 md:px-10">
      <div className="mx-auto max-w-[760px]">
        <header className="flex items-baseline justify-between border-b border-(--ink) pb-3">
          <h1 className="cap font-semibold">Feed · last 24h</h1>
          <div role="radiogroup" aria-label="Sort by" className="cap flex gap-4">
            {[
              { v: false, label: "Time" },
              { v: true, label: "Likes" },
            ].map(({ v, label }) => (
              <button
                key={label}
                role="radio"
                aria-checked={byReach === v}
                onClick={() => setByReach(v)}
                className="cap border-b-2 border-transparent pb-1 text-(--mute) aria-checked:border-(--ink) aria-checked:text-(--ink)"
              >
                {label}
              </button>
            ))}
          </div>
        </header>

        <div className="cap flex items-center gap-3 py-4">
          <span className="size-2.5 rounded-full bg-(--acc)" />
          <span className="text-(--acc)">Now</span>
          <span className="text-(--mute)">· Thu 05 Nov, 22:04</span>
        </div>

        <ol className="relative">
          {/* the rail */}
          <span aria-hidden className="absolute top-0 bottom-0 left-[60px] w-px bg-(--rule) md:left-[84px]" />
          {list.map((p, n) => {
            const m = minutes(p.time)
            const prev = n ? minutes(list[n - 1].time) : 0
            const fresh = m <= LAST_VISIT
            const r = 4 + 12 * Math.sqrt(p.likes / max)
            return (
              <li key={p.handle} className={fresh ? "bg-(--acc)/10" : undefined}>
                {!byReach && m - prev >= 60 ? (
                  <div className="cap relative flex h-10 items-center pl-[76px] text-(--mute) md:pl-[100px]">
                    <span
                      aria-hidden
                      className="absolute top-0 bottom-0 left-[60px] w-px md:left-[84px]"
                      style={{ background: "repeating-linear-gradient(to bottom, var(--ink) 0 3px, var(--paper) 3px 7px)" }}
                    />
                    {gap(m - prev)} gap
                  </div>
                ) : null}
                {fresh && (n === 0 || minutes(list[n - 1].time) > LAST_VISIT) ? (
                  <div className="cap pt-3 pl-[76px] text-(--acc) md:pl-[100px]">Since your last visit</div>
                ) : null}
                <article className="relative grid grid-cols-[60px_1fr] py-4 [--rail:60px] md:grid-cols-[84px_1fr] md:[--rail:84px]">
                  <span className="mono pt-1 pr-4 text-right text-xs text-(--mute)">{p.time}</span>
                  <span
                    aria-hidden
                    className="absolute rounded-full border border-(--ink) bg-(--paper)"
                    style={{ width: r * 2, height: r * 2, top: 22 - r, left: `calc(var(--rail) - ${r}px)` }}
                  />
                  <div className="min-w-0 pl-6 md:pl-8">
                    <div className="cap flex flex-wrap items-baseline gap-x-3">
                      <span className="font-semibold break-words">{p.name}</span>
                      <span className="mono text-xs tracking-normal text-(--mute) normal-case">@{p.handle}</span>
                    </div>
                    <p className="mt-1 text-[15px] leading-normal break-words">{p.text}</p>
                    {p.image ? (
                      <div className="mt-3 aspect-[2/1] max-w-[480px] border border-(--rule)">
                        <div className="shade size-full" />
                      </div>
                    ) : null}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Act label="Reply" n={p.replies} />
                      <Act label="Repost" n={p.reposts} />
                      <Act label="Like" n={count(p)} on={liked.has(p.handle)} onClick={() => toggle(p.handle)} />
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ol>

        <footer className="cap mt-6 flex justify-between border-t border-(--rule) pt-3 text-(--mute)">
          <span>Dot area = likes</span>
          <span>Dashed rail = an hour or more of quiet</span>
        </footer>
      </div>
    </div>
  )
}
