import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { fmt, posts } from "./data"
import { useLikes } from "./kit"

// Axis: one post per screen, paced like a deck. Reading speed beats scanning speed.
// Accent does one job: where you are in the track.
export default function Single() {
  const [i, setI] = useState(0)
  const { liked, toggle, count } = useLikes()
  const p = posts[i]
  const go = (d: number) => setI((n) => Math.max(0, Math.min(posts.length - 1, n + d)))

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "j") go(1)
      else if (e.key === "ArrowLeft" || e.key === "k") go(-1)
      else if (e.key === "l") toggle(posts[i].handle)
      else return
      e.preventDefault()
    }
    addEventListener("keydown", onKey)
    return () => removeEventListener("keydown", onKey)
  })

  const stats = [
    { label: "Replies", n: p.replies },
    { label: "Reposts", n: p.reposts },
    { label: "Likes", n: count(p) },
  ]

  return (
    <div className="mv flex min-h-svh flex-col px-4 py-6 md:px-16 md:py-10">
      <nav aria-label="Posts" className="flex gap-1.5">
        {posts.map((q, n) => (
          <button
            key={q.handle}
            type="button"
            onClick={() => setI(n)}
            aria-label={`Post ${n + 1}: ${q.name}`}
            aria-current={n === i}
            className="group flex h-6 flex-1 items-center"
          >
            <span
              className={cn(
                "h-2 w-full rounded-full border border-(--ink)",
                n < i && "bg-(--ink)",
                n === i && "border-(--acc) bg-(--acc)",
              )}
            />
          </button>
        ))}
      </nav>
      <div className="cap mt-2 flex justify-between text-(--mute)">
        <span>
          {String(i + 1).padStart(2, "0")} / {String(posts.length).padStart(2, "0")}
        </span>
        <span>← → or J/K · L like</span>
      </div>

      <article
        key={p.handle}
        className="mx-auto flex w-full max-w-[880px] flex-1 flex-col justify-center py-10 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-200"
      >
        <div className="cap font-semibold break-words">{p.name}</div>
        <div className="mono mt-1 text-xs break-all text-(--mute)">
          @{p.handle} · {p.time} ago{p.verified ? " · ✓" : ""}
        </div>
        <p className="mt-6 text-[28px] leading-[1.2] tracking-[-0.01em] text-pretty break-words md:text-[44px]">
          {p.text}
        </p>
        {p.image ? (
          <div className="mt-6 aspect-[3/1] border border-(--rule)">
            <div className="shade size-full" />
          </div>
        ) : null}

        <dl className="mt-10 grid grid-cols-3 border-t border-(--ink)">
          {stats.map((s) => (
            <div key={s.label} className="border-r border-(--rule) pt-3 pr-3 last:border-r-0 [&:not(:first-child)]:pl-3">
              <dt className="cap text-(--mute)">{s.label}</dt>
              <dd
                className="mono text-4xl leading-none tracking-[-0.04em] md:text-6xl"
                style={{ fontStretch: "75%", fontWeight: 700 }}
              >
                {fmt(s.n)}
              </dd>
            </div>
          ))}
        </dl>
      </article>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={i === 0}
          className="cap h-10 rounded-full border border-(--rule) px-5 disabled:opacity-40"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={() => toggle(p.handle)}
          aria-pressed={liked.has(p.handle)}
          className="cap h-10 rounded-full border border-(--rule) px-5 aria-pressed:border-(--ink) aria-pressed:bg-(--ink) aria-pressed:text-(--paper)"
        >
          {liked.has(p.handle) ? "Liked" : "Like"}
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={i === posts.length - 1}
          className="cap ml-auto h-10 rounded-full bg-(--ink) px-5 font-semibold text-(--paper) disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  )
}
