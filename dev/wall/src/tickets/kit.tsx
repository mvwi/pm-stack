import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react"
import { cn } from "@/lib/utils"
import "../variants/mv.css"

// Shared by every ticket-training variant: one script, one mock ticket, one step engine.
// Variants differ only in how the trainer panel talks and how it points at the UI.

export type Target = "thread" | "first" | "props" | "tags" | "composer"
export type Step = { title: string; why: string; target: Target; scroll: "top" | "bottom"; ms: number }

export const steps: Step[] = [
  { title: "A new ticket opens at the latest reply", why: "You land at the bottom. That message is rarely the whole story.", target: "thread", scroll: "bottom", ms: 4000 },
  { title: "Scroll to the top first", why: "The first message holds the original ask. Start there, every time.", target: "first", scroll: "top", ms: 4000 },
  { title: "Read the request in full", why: "Note what they asked for, not what the last reply argued about.", target: "first", scroll: "top", ms: 4000 },
  { title: "Check requester and priority", why: "Who is asking and how urgent it is decide your next move.", target: "props", scroll: "top", ms: 4000 },
  { title: "Add the right tags", why: "Tags route the ticket and feed the weekly report.", target: "tags", scroll: "top", ms: 4000 },
  { title: "Now write your reply", why: "Answer the first ask. Quote it if the thread drifted.", target: "composer", scroll: "top", ms: 5500 },
]

// shortcut: one timer loop with fixed per-step ms; swap for a real timeline when this feeds HyperFrames.
export function useSteps() {
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(true)
  const go = useCallback((n: number) => setI((n + steps.length) % steps.length), [])
  const next = useCallback(() => setI((n) => (n + 1) % steps.length), [])
  const prev = useCallback(() => setI((n) => Math.max(n - 1, 0)), [])
  const toggle = useCallback(() => setPlaying((p) => !p), [])

  useEffect(() => {
    if (!playing) return
    const t = setTimeout(next, steps[i].ms)
    return () => clearTimeout(t)
  }, [i, playing, next])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return
      if (e.key === "ArrowRight") next()
      else if (e.key === "ArrowLeft") prev()
      else if (e.key === " ") toggle()
      else return
      e.preventDefault()
    }
    addEventListener("keydown", onKey)
    return () => removeEventListener("keydown", onKey)
  }, [next, prev, toggle])

  return { i, step: steps[i], go, next, prev, playing, toggle }
}

// Rect of the current target, relative to `root`, kept fresh through scrolls and resizes.
export function useTargetRect(root: RefObject<HTMLElement | null>, target: Target) {
  const [r, setR] = useState<DOMRect | null>(null)
  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const measure = () => {
      const t = el.querySelector(`[data-t="${target}"]`)
      if (!t) return setR(null)
      const a = el.getBoundingClientRect()
      const b = t.getBoundingClientRect()
      setR(new DOMRect(b.x - a.x, b.y - a.y, b.width, b.height))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    el.addEventListener("scroll", measure, true)
    return () => {
      ro.disconnect()
      el.removeEventListener("scroll", measure, true)
    }
  }, [root, target])
  return r
}

const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches

const HANDLES = ["left-0 top-0", "left-1/2 top-0", "left-full top-0", "left-0 top-1/2", "left-full top-1/2", "left-0 top-full", "left-1/2 top-full", "left-full top-full"]

// The "look here" mark: a thin accent box with eight square handles. Slides between targets.
export function Handles({ r, pad = 6 }: { r: DOMRect | null; pad?: number }) {
  if (!r) return null
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-0 left-0 z-20 border border-(--acc) transition-[translate,width,height] duration-300 ease-out motion-reduce:transition-none"
      style={{ translate: `${r.x - pad}px ${r.y - pad}px`, width: r.width + pad * 2, height: r.height + pad * 2 }}
    >
      {HANDLES.map((p) => (
        <span key={p} className={cn("absolute -mt-[3px] -ml-[3px] size-1.5 bg-(--acc)", p)} />
      ))}
    </div>
  )
}

// ---------- the mock ticket ----------

type Msg = { who: string; role: "customer" | "agent" | "note"; time: string; lines: number; text: string }
const thread: Msg[] = [
  { who: "Dana Requester", role: "customer", time: "Mon 09:12", lines: 4, text: "I can't sign in after resetting my password. The link says it expired." },
  { who: "Auto-reply", role: "agent", time: "Mon 09:12", lines: 1, text: "Thanks, we got your request." },
  { who: "Sam Agent", role: "agent", time: "Mon 11:40", lines: 2, text: "Can you try the link again in a private window?" },
  { who: "Dana Requester", role: "customer", time: "Mon 12:05", lines: 2, text: "Tried that. Same thing." },
  { who: "Sam Agent", role: "note", time: "Mon 12:20", lines: 2, text: "Internal: possibly the token bug from last week." },
  { who: "Dana Requester", role: "customer", time: "Tue 08:47", lines: 3, text: "Also, can I change the email on the account while you're in there?" },
  { who: "Sam Agent", role: "agent", time: "Tue 10:02", lines: 2, text: "Sure, which address should we use?" },
  { who: "Dana Requester", role: "customer", time: "Tue 10:30", lines: 1, text: "The work one. Thanks!" },
]

const ROLE = { customer: "Customer", agent: "Agent", note: "Internal note" }

function Bars({ n }: { n: number }) {
  return (
    <div className="mt-3 space-y-2" aria-hidden>
      {Array.from({ length: n }, (_, k) => (
        <div key={k} className="h-1.5 bg-(--well)" style={{ width: `${k === n - 1 ? 55 : 92 - k * 6}%` }} />
      ))}
    </div>
  )
}

function Field({ label, value, mark }: { label: string; value: string; mark?: boolean }) {
  return (
    <div className="border-b border-(--rule) py-3">
      <div className="cap text-(--mute)">{label}</div>
      <div className={cn("mt-1 text-[15px]", mark && "font-semibold")}>{value}</div>
    </div>
  )
}

// `dim` fades everything but the target (Spotlight). `children` overlays the ticket (marks, pointers).
export function Ticket({ step, dim, children, rootRef }: { step: Step; dim?: boolean; children?: ReactNode; rootRef?: RefObject<HTMLDivElement | null> }) {
  const list = useRef<HTMLDivElement>(null)
  const first = useRef(true)

  useEffect(() => {
    const el = list.current
    if (!el) return
    const top = step.scroll === "top" ? 0 : el.scrollHeight
    el.scrollTo({ top, behavior: first.current || reduced() ? "auto" : "smooth" })
    first.current = false
  }, [step.scroll])

  const fade = (t: Target | Target[]) =>
    dim && !([] as Target[]).concat(t).includes(step.target) ? "opacity-25 transition-opacity duration-300" : "transition-opacity duration-300"

  return (
    <div ref={rootRef} className="relative flex h-full min-w-0 flex-1 bg-(--paper)">
      {/* App rail: letter tiles stand in for icons */}
      <nav aria-label="App" className={cn("flex w-16 shrink-0 flex-col items-center gap-3 border-r border-(--rule) py-4", fade([]))}>
        <span className="mono grid size-9 place-items-center bg-(--ink) text-sm font-bold text-(--paper)">D</span>
        {["V", "T", "C", "R"].map((l, k) => (
          <span key={l} className={cn("mono grid size-9 place-items-center border text-xs", k === 1 ? "border-(--ink)" : "border-(--rule) text-(--mute)")}>
            {l}
          </span>
        ))}
      </nav>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className={cn("flex items-center gap-4 border-b border-(--rule) px-6 py-4", fade([]))}>
          <span className="cap text-(--mute)">Tickets ›</span>
          <span className="mono text-sm font-semibold">#4821</span>
          <h1 className="min-w-0 truncate text-lg font-semibold">Can't sign in after password reset</h1>
          <span className="cap ml-auto shrink-0 border border-(--ink) px-2 py-1">Open</span>
        </header>

        <div className="flex min-h-0 flex-1">
          <aside className="w-64 shrink-0 overflow-hidden border-r border-(--rule) px-5">
            <div data-t="props" className={cn("mt-2", fade("props"))}>
              <Field label="Requester" value="Dana Requester" mark />
              <Field label="Priority" value="High" mark />
            </div>
            <div className={fade([])}>
              <Field label="Assignee" value="Sam Agent" />
              <Field label="Type" value="Problem" />
            </div>
            <div data-t="tags" className={cn("py-3", fade("tags"))}>
              <div className="cap text-(--mute)">Tags</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {["login", "password", "account"].map((t) => (
                  <span key={t} className="mono rounded-full border border-(--rule) px-2.5 py-0.5 text-xs">
                    {t}
                  </span>
                ))}
                <span className="mono rounded-full border border-dashed border-(--rule) px-2.5 py-0.5 text-xs text-(--mute)">+ add</span>
              </div>
            </div>
          </aside>

          <main className="flex min-w-0 flex-1 flex-col">
            <div ref={list} data-t="thread" className={cn("min-h-0 flex-1 overflow-y-auto px-8 py-6", fade(["thread", "first"]))}>
              <ol className="mx-auto max-w-3xl space-y-4">
                {thread.map((m, k) => (
                  <li
                    key={k}
                    data-t={k === 0 ? "first" : undefined}
                    className={cn(
                      "border p-5",
                      m.role === "note" ? "border-dashed border-(--rule) bg-(--well)" : "border-(--rule) bg-(--paper)",
                      dim && step.target === "first" && k > 0 && "opacity-25",
                    )}
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="mono grid size-7 shrink-0 place-items-center border border-(--ink) text-[11px] font-semibold">
                        {m.who[0]}
                      </span>
                      <span className="font-semibold">{m.who}</span>
                      <span className="cap text-(--mute)">{ROLE[m.role]}</span>
                      <span className="mono ml-auto text-xs text-(--mute)">{m.time}</span>
                    </div>
                    <p className="mt-3 text-[15px]">{m.text}</p>
                    <Bars n={m.lines} />
                  </li>
                ))}
              </ol>
            </div>

            <div data-t="composer" className={cn("border-t border-(--rule) px-8 py-4", fade("composer"))}>
              <div className="mx-auto max-w-3xl">
                <div className="cap flex gap-5">
                  <span className="border-b border-(--ink) pb-1 font-semibold">Public reply</span>
                  <span className="text-(--mute)">Internal note</span>
                </div>
                <textarea
                  aria-label="Reply"
                  rows={3}
                  placeholder="Write a reply…"
                  className="mt-3 block w-full resize-none border border-(--rule) bg-transparent p-3 text-base outline-none placeholder:text-(--mute) focus:border-(--ink)"
                />
                <div className="mt-3 flex justify-end">
                  <button type="button" className="cap bg-(--ink) px-4 py-2 font-semibold text-(--paper)">
                    Submit as open
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      {children}
    </div>
  )
}

// Prev / play / next, shared so every variant drives the same way.
export function Controls({ s, className }: { s: ReturnType<typeof useSteps>; className?: string }) {
  const btn = "cap h-9 border border-(--rule) px-3 hover:border-(--ink)"
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button type="button" className={btn} onClick={s.prev} aria-label="Previous step">←</button>
      <button type="button" className={cn(btn, "min-w-20")} onClick={s.toggle}>{s.playing ? "Pause" : "Play"}</button>
      <button type="button" className={btn} onClick={s.next} aria-label="Next step">→</button>
      <span className="cap ml-auto text-(--mute)">← → Space</span>
    </div>
  )
}

export const pad2 = (n: number) => String(n).padStart(2, "0")
