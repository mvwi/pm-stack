import { fmt } from "./data"
import "./mv.css"

// A word-and-number action, the instrument way: no icons.
export function Act({
  label,
  n,
  on,
  onClick,
}: {
  label: string
  n: number
  on?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      aria-label={`${label}, ${n}`}
      className="cap flex h-8 items-center gap-2 rounded-full border border-(--rule) px-3 text-(--mute) transition-[background-color,color] duration-150 hover:text-(--ink) aria-pressed:border-(--ink) aria-pressed:bg-(--ink) aria-pressed:text-(--paper)"
    >
      {label}
      <span className="font-semibold">{n ? fmt(n) : "0"}</span>
    </button>
  )
}
