import { useRef } from "react"
import { cn } from "@/lib/utils"
import { Controls, Handles, Ticket, pad2, steps, useSteps, useTargetRect } from "./kit"

// Axis: the whole checklist stays on screen; the current step is lit and the UI wears handles.
export default function Script() {
  const s = useSteps()
  const root = useRef<HTMLDivElement>(null)
  const r = useTargetRect(root, s.step.target)

  return (
    <div className="mv flex h-svh">
      <Ticket step={s.step} rootRef={root}>
        <Handles r={r} />
      </Ticket>

      <aside className="flex w-[560px] shrink-0 flex-col border-l border-(--ink) px-10 py-8">
        <div className="cap flex items-baseline justify-between border-b border-(--ink) pb-3">
          <span className="font-semibold tracking-[.12em]">New tickets · the first minute</span>
          <span className="text-(--mute)">[{pad2(s.i + 1)} / {pad2(steps.length)}]</span>
        </div>

        <ol className="mt-4 flex-1">
          {steps.map((st, n) => (
            <li key={n}>
              <button
                type="button"
                onClick={() => s.go(n)}
                aria-current={n === s.i ? "step" : undefined}
                className={cn("grid w-full grid-cols-[3ch_1fr] gap-4 border-b border-(--rule) py-4 text-left", n > s.i && "text-(--mute)")}
              >
                <span className={cn("mono pt-0.5 text-sm font-semibold", n === s.i && "text-(--acc)")}>{pad2(n + 1)}</span>
                <span>
                  <span className={cn("block text-lg leading-snug", n === s.i && "font-semibold")}>{st.title}</span>
                  {n === s.i ? <span className="mt-2 block text-[15px] leading-normal text-(--mute)">{st.why}</span> : null}
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
