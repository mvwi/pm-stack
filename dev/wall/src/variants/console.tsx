import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { fmt, posts } from "./data"
import { useLikes } from "./kit"

// Axis: a dark console you drive with the keyboard. List left, the selected post right.
// Accent does one job: the selection handles.
const ROW = 76

export default function Console() {
  const [i, setI] = useState(0)
  const [draft, setDraft] = useState("")
  const [replies, setReplies] = useState<Record<string, string[]>>({})
  const { liked, toggle, count } = useLikes()
  const reply = useRef<HTMLTextAreaElement>(null)
  const p = posts[i]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement) {
        if (e.key === "Escape") e.target.blur()
        return
      }
      if (e.key === "j" || e.key === "ArrowDown") setI((n) => Math.min(n + 1, posts.length - 1))
      else if (e.key === "k" || e.key === "ArrowUp") setI((n) => Math.max(n - 1, 0))
      else if (e.key === "l") toggle(posts[i].handle)
      else if (e.key === "r") reply.current?.focus()
      else return
      e.preventDefault()
    }
    addEventListener("keydown", onKey)
    return () => removeEventListener("keydown", onKey)
  }, [i, toggle])

  const bars = [
    { label: "Replies", n: p.replies + (replies[p.handle]?.length ?? 0) },
    { label: "Reposts", n: p.reposts },
    { label: "Likes", n: count(p) },
  ]

  return (
    <div className="mv mv-inv flex h-svh flex-col">
      <header className="cap flex items-baseline justify-between border-b border-(--rule) px-5 py-3">
        <span className="font-semibold">Feed console</span>
        <span className="text-(--mute)">
          [{String(i + 1).padStart(2, "0")} / {String(posts.length).padStart(2, "0")}]
        </span>
      </header>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <ul className="relative max-h-[40svh] shrink-0 overflow-y-auto border-(--rule) md:max-h-none md:w-[400px] md:border-r">
          {/* Handles: a selection frame that slides to the current row */}
          <li
            aria-hidden
            className="pointer-events-none absolute inset-x-2 top-0 z-10 border border-(--acc) transition-transform duration-150 ease-out motion-reduce:transition-none"
            style={{ height: ROW - 8, transform: `translateY(${i * ROW + 4}px)` }}
          >
            {["-left-[3px] -top-[3px]", "left-1/2 -top-[3px] -ml-[3px]", "-right-[3px] -top-[3px]", "-left-[3px] top-1/2 -mt-[3px]", "-right-[3px] top-1/2 -mt-[3px]", "-left-[3px] -bottom-[3px]", "left-1/2 -bottom-[3px] -ml-[3px]", "-right-[3px] -bottom-[3px]"].map((pos) => (
              <span key={pos} className={cn("absolute size-1.5 bg-(--acc)", pos)} />
            ))}
          </li>
          {posts.map((q, n) => (
            <li key={q.handle}>
              <button
                type="button"
                onClick={() => setI(n)}
                aria-current={n === i}
                className="flex w-full flex-col justify-center gap-1 border-b border-(--rule) px-5 text-left hover:bg-(--well)"
                style={{ height: ROW }}
              >
                <span className="cap flex w-full gap-3">
                  <span className="min-w-0 truncate font-semibold">{q.name}</span>
                  <span className="ml-auto shrink-0 text-(--mute)">{q.time}</span>
                </span>
                <span className="w-full truncate text-sm text-(--mute)">{q.text}</span>
              </button>
            </li>
          ))}
        </ul>

        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto p-5 md:p-8">
          <div className="cap flex items-baseline justify-between border-b border-(--rule) pb-2">
            <span className="min-w-0 font-semibold break-words">{p.name}</span>
            <span className="ml-4 shrink-0 text-(--mute)">[{p.time}{p.verified ? " · ✓" : ""}]</span>
          </div>
          <div className="mono mt-2 text-xs break-all text-(--mute)">@{p.handle}</div>
          <p className="mt-4 max-w-[60ch] text-lg leading-normal text-pretty break-words">{p.text}</p>
          {p.image ? (
            <div className="mt-4 aspect-video max-w-[60ch] border border-(--rule)">
              <div className="shade size-full" />
            </div>
          ) : null}

          <section aria-label="Engagement" className="mt-8 max-w-[60ch]">
            <div className="cap flex justify-between border-b border-(--rule) pb-2">
              <span className="font-semibold">Engagement</span>
              <span className="text-(--mute)">[log scale]</span>
            </div>
            {bars.map((b) => (
              <div key={b.label} className="cap grid grid-cols-[9ch_1fr_7ch] items-center gap-3 py-2">
                <span className="text-(--mute)">{b.label}</span>
                <span className="h-2 bg-(--well)">
                  <span
                    className="block h-full bg-(--rule)"
                    style={{ width: `${(Math.log10(b.n + 1) / 5) * 100}%` }}
                  />
                </span>
                <span className="text-right font-semibold">{fmt(b.n)}</span>
              </div>
            ))}
          </section>

          <div className="mt-6 flex max-w-[60ch] gap-2">
            <button
              type="button"
              onClick={() => toggle(p.handle)}
              aria-pressed={liked.has(p.handle)}
              className="cap h-8 rounded-full border border-(--rule) px-3 aria-pressed:border-(--ink) aria-pressed:bg-(--ink) aria-pressed:text-(--paper)"
            >
              {liked.has(p.handle) ? "Liked" : "Like"} · L
            </button>
          </div>

          <form
            className="mt-4 max-w-[60ch] border border-(--rule)"
            onSubmit={(e) => {
              e.preventDefault()
              if (!draft.trim()) return
              setReplies((r) => ({ ...r, [p.handle]: [...(r[p.handle] ?? []), draft.trim()] }))
              setDraft("")
            }}
          >
            <textarea
              ref={reply}
              aria-label={`Reply to ${p.name}`}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) e.currentTarget.form?.requestSubmit()
              }}
              placeholder="Reply… (r to focus, ⌘↵ to send)"
              rows={2}
              className="block w-full resize-none bg-transparent px-4 py-3 text-base outline-none placeholder:text-(--mute)"
            />
          </form>
          {(replies[p.handle] ?? []).map((r, n) => (
            <p key={n} className="mt-2 max-w-[60ch] border-l border-(--ink) pl-3 text-sm break-words">
              <span className="cap mr-2 text-(--mute)">You</span>
              {r}
            </p>
          ))}
        </main>
      </div>

      <footer className="cap flex gap-6 border-t border-(--rule) px-5 py-2 text-(--mute)">
        <span>J/K move</span>
        <span>L like</span>
        <span>R reply</span>
        <span className="hidden sm:inline">Esc leave reply</span>
      </footer>
    </div>
  )
}
