import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { Controls, Handles, Ticket, steps, useSteps, useTargetRect } from "./kit"

// Axis: a dark cue sheet like a video editor's markers; a playhead runs the lesson's real timing.
const total = steps.reduce((a, st) => a + st.ms, 0)
const starts = steps.map((_, n) => steps.slice(0, n).reduce((a, st) => a + st.ms, 0))
const tc = (ms: number) => `00:${String(Math.floor(ms / 1000)).padStart(2, "0")}.${String(Math.floor((ms % 1000) / 100))}`

export default function Cues() {
  const s = useSteps()
  const root = useRef<HTMLDivElement>(null)
  const head = useRef<HTMLDivElement>(null)
  const anim = useRef<Animation | null>(null)
  const r = useTargetRect(root, s.step.target)
  const playing = useRef(s.playing)

  useEffect(() => {
    const a = (starts[s.i] / total) * 100
    const b = ((starts[s.i] + s.step.ms) / total) * 100
    anim.current = head.current?.animate([{ translate: `${a}% 0` }, { translate: `${b}% 0` }], { duration: s.step.ms, easing: "linear", fill: "forwards" }) ?? null
    if (!playing.current || matchMedia("(prefers-reduced-motion: reduce)").matches) anim.current?.pause()
    return () => anim.current?.cancel()
  }, [s.i, s.step.ms])

  useEffect(() => {
    playing.current = s.playing
    if (s.playing) anim.current?.play()
    else anim.current?.pause()
  }, [s.playing])

  return (
    <div className="mv flex h-svh">
      <Ticket step={s.step} rootRef={root}>
        <Handles r={r} />
      </Ticket>

      <aside className="mv mv-inv flex w-[560px] shrink-0 flex-col px-8 py-6">
        <div className="cap flex items-baseline justify-between border-b border-(--rule) pb-3">
          <span className="font-semibold">Cue sheet · ticket basics</span>
          <span className="text-(--mute)">[{tc(starts[s.i])} / {tc(total)}]</span>
        </div>

        {/* Timeline: step blocks sized by time, playhead sweeps across */}
        <div className="relative mt-6 h-12" aria-hidden>
          <div className="absolute inset-x-0 top-3 flex h-6 gap-px">
            {steps.map((st, n) => (
              <button key={n} type="button" tabIndex={-1} onClick={() => s.go(n)} className={cn("h-full border border-(--rule)", n === s.i ? "border-(--acc) bg-(--acc)" : n < s.i ? "bg-(--well)" : "")} style={{ flex: st.ms }} />
            ))}
          </div>
          <div ref={head} className="pointer-events-none absolute inset-0">
            <span className="absolute top-0 left-0 h-full w-px bg-(--ink)" />
            <span className="absolute -top-1 -left-1 size-2 rotate-45 bg-(--ink)" />
          </div>
        </div>

        <ol className="mt-4 flex-1 overflow-y-auto">
          {steps.map((st, n) => (
            <li key={n}>
              <button type="button" onClick={() => s.go(n)} aria-current={n === s.i ? "step" : undefined} className={cn("grid w-full grid-cols-[8ch_1fr] gap-4 border-b border-(--rule) py-4 text-left", n !== s.i && "text-(--mute)")}>
                <span className={cn("mono pt-0.5 text-xs", n === s.i && "text-(--acc)")}>{tc(starts[n])}</span>
                <span>
                  <span className={cn("block text-[17px] leading-snug", n === s.i && "font-semibold")}>{st.title}</span>
                  <span className="mt-1 block text-sm leading-normal text-(--mute)">{st.why}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>

        <Controls s={s} className="border-t border-(--rule) pt-4" />
      </aside>
    </div>
  )
}
