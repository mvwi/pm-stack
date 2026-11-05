import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { fmt, posts } from "./data"

// Axis: keyboard-first. j/k moves, l likes; the feed is a log you drive without a mouse.
export default function Terminal() {
  const [i, setI] = useState(0)
  const [liked, setLiked] = useState<Set<number>>(new Set())
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "j") setI((n) => Math.min(n + 1, posts.length - 1))
      if (e.key === "k") setI((n) => Math.max(n - 1, 0))
      if (e.key === "l") setLiked((s) => new Set(s).add(i))
    }
    addEventListener("keydown", onKey)
    return () => removeEventListener("keydown", onKey)
  }, [i])
  return (
    <div className="min-h-svh bg-neutral-950 p-4 font-mono text-[13px] text-neutral-300 md:p-8">
      <div className="mb-4 text-neutral-500">~/feed $ tail -f home <span className="animate-pulse">▍</span></div>
      {posts.map((p, n) => (
        <div
          key={p.handle}
          onClick={() => setI(n)}
          className={cn("grid grid-cols-[3ch_1fr] gap-x-2 border-l-2 border-transparent py-2 pl-2 md:grid-cols-[3ch_20ch_1fr_10ch]", n === i && "border-emerald-400 bg-neutral-900")}
        >
          <span className="text-neutral-600">{p.time}</span>
          <span className="truncate text-emerald-400">@{p.handle}</span>
          <span className="col-start-2 break-words text-neutral-100 md:col-start-auto">{p.text}</span>
          <span className="col-start-2 text-neutral-500 tabular-nums md:col-start-auto md:text-right">
            {liked.has(n) ? <span className="text-rose-400">♥ </span> : "♡ "}
            {fmt(p.likes + (liked.has(n) ? 1 : 0))}
          </span>
        </div>
      ))}
      <div className="fixed inset-x-0 bottom-0 border-t border-neutral-800 bg-neutral-950 px-4 py-2 text-neutral-500 md:px-8">
        j/k move · l like · {i + 1}/{posts.length}
      </div>
    </div>
  )
}
