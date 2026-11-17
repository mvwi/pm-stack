import { useLayoutEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Controls, Ticket, pad2, steps, useSteps, useTargetRect } from "./kit"

// Axis: one instruction at a time, set big like a slide, with a leader line drawn to the spot.
export default function Card() {
  const s = useSteps()
  const root = useRef<HTMLDivElement>(null)
  const anchor = useRef<HTMLSpanElement>(null)
  const r = useTargetRect(root, s.step.target)
  const [a, setA] = useState<{ x: number; y: number } | null>(null)

  useLayoutEffect(() => {
    const el = anchor.current
    const base = root.current?.parentElement
    if (!el || !base) return
    const m = () => {
      const b = el.getBoundingClientRect()
      const o = base.getBoundingClientRect()
      setA({ x: b.x - o.x, y: b.y - o.y + b.height / 2 })
    }
    m()
    addEventListener("resize", m)
    return () => removeEventListener("resize", m)
  }, [s.i])

  // Leader ends on the target's right edge, vertically centered on its visible part.
  const end = r && { x: r.right + 8, y: Math.min(Math.max(r.y + r.height / 2, 40), innerHeight - 40) }

  return (
    <div className="mv relative flex h-svh">
      <Ticket step={s.step} rootRef={root}>
        {r ? <div aria-hidden className="pointer-events-none absolute top-0 left-0 border-[1.5px] border-(--acc) transition-[translate,width,height] duration-300 ease-out motion-reduce:transition-none" style={{ translate: `${r.x - 6}px ${r.y - 6}px`, width: r.width + 12, height: r.height + 12 }} /> : null}
      </Ticket>

      {a && end ? (
        <svg aria-hidden className="pointer-events-none absolute inset-0 z-30 size-full overflow-visible">
          <path d={`M${a.x} ${a.y} H${a.x - 40} L${end.x} ${end.y}`} fill="none" stroke="var(--ink)" strokeWidth={1} />
          <circle cx={end.x} cy={end.y} r={5} fill="var(--acc)" />
        </svg>
      ) : null}

      <aside className="flex w-[600px] shrink-0 flex-col border-l border-(--ink) px-12 py-10">
        <div className="cap flex justify-between text-(--mute)">
          <span className="font-semibold text-(--ink)">Step {pad2(s.i + 1)}</span>
          <span>of {pad2(steps.length)}</span>
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <h2 key={s.i} className="mono animate-in fade-in slide-in-from-bottom-2 text-[44px] leading-[1.15] font-extralight tracking-[-.03em] text-balance duration-300 motion-reduce:animate-none" style={{ fontStretch: "112.5%" }}>
            <span ref={anchor} className="mb-6 block h-px w-10 bg-(--ink)" />
            {s.step.title}
          </h2>
          <p className="mt-6 max-w-[38ch] text-lg leading-normal text-(--mute)">{s.step.why}</p>
        </div>

        <div className="mb-6 flex gap-2" aria-label="Progress">
          {steps.map((_, n) => (
            <button key={n} type="button" onClick={() => s.go(n)} aria-label={`Step ${n + 1}`} className={cn("size-3 border border-(--ink)", n === s.i && "border-(--acc) bg-(--acc)", n < s.i && "bg-(--ink)")} />
          ))}
        </div>
        <Controls s={s} />
      </aside>
    </div>
  )
}
