import { cn } from "@/lib/utils"
import { Controls, Ticket, pad2, steps, useSteps } from "./kit"

// Axis: the UI does the pointing. Everything but the spot fades; the panel stays quiet.
export default function Spot() {
  const s = useSteps()

  return (
    <div className="mv flex h-svh">
      <Ticket step={s.step} dim />

      <aside className="flex w-[440px] shrink-0 flex-col border-l border-(--rule) px-10 py-10">
        <div className="cap font-semibold tracking-[.12em]">Watch the bright part</div>

        <div className="mt-10 flex flex-1 gap-6">
          {/* EQ-style track: one dot per step, the knob sits on the current one */}
          <div className="relative w-3.5 shrink-0 rounded-full border border-(--rule)" aria-hidden>
            <span
              className="absolute left-1/2 size-3 -translate-x-1/2 rounded-full bg-(--acc) transition-[top] duration-300 ease-out motion-reduce:transition-none"
              style={{ top: `calc(${(s.i / (steps.length - 1)) * 100}% - ${(s.i / (steps.length - 1)) * 12}px)` }}
            />
          </div>
          <ol className="flex flex-1 flex-col justify-between">
            {steps.map((st, n) => (
              <li key={n}>
                <button type="button" onClick={() => s.go(n)} className={cn("text-left", n !== s.i && "text-(--mute)")}>
                  <span className="cap block">{pad2(n + 1)}</span>
                  <span className={cn("mt-1 block leading-snug", n === s.i ? "text-xl font-semibold" : "text-[15px]")}>{st.title}</span>
                  {n === s.i ? <span className="mt-2 block text-[15px] text-(--mute)">{st.why}</span> : null}
                </button>
              </li>
            ))}
          </ol>
        </div>

        <Controls s={s} className="mt-8" />
      </aside>
    </div>
  )
}
