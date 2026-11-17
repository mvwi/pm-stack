import { useRef } from "react"
import { Controls, Handles, Ticket, pad2, steps, useSteps, useTargetRect } from "./kit"

// Axis: the lesson drawn as an mvwi walkthrough panel; one handles box steps down it and across the UI.
const TAG = ["LANDED", "SCROLL UP", "READ ASK", "PRIORITY", "TAGS", "REPLY"]
const Y0 = 62
const PITCH = 48
const total = steps.reduce((a, st) => a + st.ms, 0)

export default function Walk() {
  const s = useSteps()
  const root = useRef<HTMLDivElement>(null)
  const r = useTargetRect(root, s.step.target)

  return (
    <div className="mv flex h-svh">
      <Ticket step={s.step} rootRef={root}>
        <Handles r={r} />
      </Ticket>

      <aside className="flex w-[580px] shrink-0 flex-col border-l border-(--ink) px-8 py-6">
        <svg viewBox="0 0 400 400" className="w-full" role="img" aria-label={`Lesson steps, step ${s.i + 1} of ${steps.length}: ${s.step.title}`} fontFamily="Martian Mono, ui-monospace, monospace" fontSize={9} strokeWidth={1}>
          <text x={20} y={30} fontWeight={600} letterSpacing=".1em" fill="var(--ink)">FIRST MINUTE</text>
          <text x={380} y={30} textAnchor="end" letterSpacing=".06em" fill="var(--ink)">[{TAG[s.i]} · {pad2(s.i + 1)}]</text>
          <line x1={20} x2={380} y1={40} y2={40} stroke="var(--ink)" strokeWidth={0.7} />

          {steps.map((st, n) => {
            const y = Y0 + n * PITCH
            const on = n === s.i
            const w = (st.ms / 5500) * 80
            return (
              <g key={n} onClick={() => s.go(n)} className="cursor-pointer">
                {n < steps.length - 1 ? (
                  <>
                    <line x1={90} x2={90} y1={y + 28} y2={y + PITCH - 6.5} stroke="var(--ink)" />
                    <path d={`M90 ${y + PITCH} l-2.9 -6.5 h5.8 z`} fill="var(--ink)" />
                  </>
                ) : null}
                <rect x={40} y={y} width={100} height={28} rx={14} fill={on ? "var(--acc)" : "var(--paper)"} stroke={on ? "var(--acc)" : "var(--ink)"} />
                <text x={90} y={y + 17.5} textAnchor="middle" letterSpacing=".06em" fill={on ? "var(--on-acc)" : "var(--ink)"}>{TAG[n]}</text>
                <line x1={146} x2={240} y1={y + 14} y2={y + 14} stroke="var(--rule)" strokeWidth={0.6} strokeDasharray="2 3" />
                <rect x={250} y={y + 11} width={w} height={6} fill={on ? "var(--acc)" : "var(--rule)"} />
                <text x={380} y={y + 17} textAnchor="end" fontSize={8} fill="var(--mute)">{(st.ms / 1000).toFixed(1)} s</text>
              </g>
            )
          })}

          {/* Handles step down the list with the lesson */}
          <g className="transition-transform duration-300 ease-out motion-reduce:transition-none" style={{ transform: `translateY(${s.i * PITCH}px)` }} aria-hidden>
            <rect x={34} y={Y0 - 6} width={112} height={40} fill="none" stroke="var(--acc)" strokeWidth={0.7} />
            {[[34, 0], [90, 0], [146, 0], [34, 20], [146, 20], [34, 40], [90, 40], [146, 40]].map(([x, dy]) => (
              <rect key={`${x}-${dy}`} x={x - 3} y={Y0 - 6 + dy - 3} width={6} height={6} fill="var(--acc)" />
            ))}
          </g>

          <line x1={20} x2={380} y1={370} y2={370} stroke="var(--ink)" strokeWidth={0.7} />
          <text x={20} y={386} fontSize={8} letterSpacing=".06em" fill="var(--ink)">BAR = TIME ON SCREEN</text>
          <text x={380} y={386} fontSize={8} textAnchor="end" letterSpacing=".06em" fill="var(--ink)">{(total / 1000).toFixed(1)} S TOTAL</text>
        </svg>

        <div className="mt-2 flex-1 border-t border-(--rule) pt-6">
          <h2 className="text-2xl leading-snug font-semibold">{s.step.title}</h2>
          <p className="mt-3 max-w-[42ch] text-lg leading-normal text-(--mute)">{s.step.why}</p>
        </div>
        <Controls s={s} />
      </aside>
    </div>
  )
}
