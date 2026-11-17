import { useState } from "react"
import type { Post } from "./data"
import "./mv.css"

// Shared by the round 2 variants only.
export function useLikes() {
  const [liked, setLiked] = useState<Set<string>>(new Set())
  const toggle = (handle: string) =>
    setLiked((s) => {
      const n = new Set(s)
      if (n.has(handle)) n.delete(handle)
      else n.add(handle)
      return n
    })
  const count = (p: Post) => p.likes + (liked.has(p.handle) ? 1 : 0)
  return { liked, toggle, count }
}

export const minutes = (t: string) => parseInt(t) * ({ m: 1, h: 60, d: 1440 }[t.slice(-1)] ?? 1)
