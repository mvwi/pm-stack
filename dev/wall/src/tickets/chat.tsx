import { useEffect, useRef } from "react"
import { Controls, Ticket, steps, useSteps, useTargetRect } from "./kit"

// Axis: the trainer talks in a running chat log; a pointer glides to the spot, like a screen recording.
const stamp = (n: number) => {
  const t = steps.slice(0, n).reduce((a, st) => a + st.ms, 0) / 1000
  return `0:${String(Math.round(t)).padStart(2, "0")}`
}

export default function Chat() {
  const s = useSteps()
  const root = useRef<HTMLDivElement>(null)
  const log = useRef<HTMLOListElement>(null)
  const r = useTargetRect(root, s.step.target)

  useEffect(() => {
    log.current?.lastElementChild?.scrollIntoView({ block: "end", behavior: "smooth" })
  }, [s.i])

  // Pointer rests a little inside the target's top-left, where a person would actually click or read.
  const p = r && { x: r.x + Math.min(r.width * 0.3, 160), y: r.y + Math.min(r.height * 0.3, 60) }

  return (
    <div className="mv flex h-svh">
      <Ticket step={s.step} rootRef={root}>
        {r ? <div aria-hidden className="pointer-events-none absolute top-0 left-0 rounded-sm outline-2 outline-(--acc) transition-[translate,width,height] duration-500 ease-out motion-reduce:transition-none" style={{ translate: `${r.x - 4}px ${r.y - 4}px`, width: r.width + 8, height: r.height + 8 }} /> : null}
        {p ? (
          <svg aria-hidden width="22" height="28" viewBox="0 0 22 28" className="pointer-events-none absolute top-0 left-0 z-30 transition-[translate] duration-700 ease-in-out motion-reduce:transition-none" style={{ translate: `${p.x}px ${p.y}px` }}>
            <path d="M1 1 L1 22 L7 16.5 L11 26 L15 24.5 L11 15 L19 15 Z" fill="var(--ink)" stroke="var(--paper)" strokeWidth={1.4} strokeLinejoin="round" />
          </svg>
        ) : null}
      </Ticket>

      <aside className="flex w-[520px] shrink-0 flex-col border-l border-(--rule) bg-(--well)">
        <header className="flex items-center gap-3 border-b border-(--rule) bg-(--paper) px-6 py-4">
          <span className="mono grid size-9 place-items-center rounded-full bg-(--ink) text-xs font-bold text-(--paper)">TR</span>
          <span>
            <span className="block font-semibold">Your trainer</span>
            <span className="cap text-(--mute)">Ticket basics · lesson 1</span>
          </span>
        </header>

        <ol ref={log} className="flex-1 space-y-4 overflow-y-auto px-6 py-6" aria-live="polite">
          {steps.slice(0, s.i + 1).map((st, n) => (
            <li key={n} className="animate-in fade-in slide-in-from-bottom-2 duration-300 motion-reduce:animate-none">
              <div className="cap mb-1 text-(--mute)">{stamp(n)}</div>
              <div className={n === s.i ? "max-w-[40ch] rounded-2xl rounded-tl-sm border border-(--ink) bg-(--paper) px-4 py-3" : "max-w-[40ch] rounded-2xl rounded-tl-sm border border-(--rule) bg-(--paper) px-4 py-3 text-(--mute)"}>
                <p className="font-semibold">{st.title}</p>
                <p className="mt-1 text-[15px] leading-normal">{st.why}</p>
              </div>
            </li>
          ))}
        </ol>

        <Controls s={s} className="border-t border-(--rule) bg-(--paper) px-6 py-4" />
      </aside>
    </div>
  )
}
