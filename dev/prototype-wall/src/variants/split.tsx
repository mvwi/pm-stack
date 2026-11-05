import { useState } from "react"
import { Heart, MessageCircle, Repeat2 } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { fmt, initials, posts } from "./data"

// Axis: interaction model. Feed as an inbox: pick a post on the left, read and reply on the right.
export default function Split() {
  const [sel, setSel] = useState(0)
  const p = posts[sel]
  return (
    <div className="flex h-svh bg-background text-foreground">
      <ul className="w-full shrink-0 overflow-y-auto border-r md:w-96">
        {posts.map((q, i) => (
          <li key={q.handle}>
            <button
              onClick={() => setSel(i)}
              className={cn("flex w-full gap-3 border-b p-3 text-left hover:bg-muted/60", i === sel && "bg-muted")}
            >
              <Avatar><AvatarFallback>{initials(q.name)}</AvatarFallback></Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex gap-2 text-sm">
                  <span className="min-w-0 truncate font-medium">{q.name}</span>
                  <span className="ml-auto shrink-0 text-muted-foreground">{q.time}</span>
                </div>
                <p className="line-clamp-2 text-sm break-words text-muted-foreground">{q.text}</p>
              </div>
            </button>
          </li>
        ))}
      </ul>
      <section className="hidden min-w-0 flex-1 flex-col md:flex">
        <div className="flex-1 overflow-y-auto p-8">
          <div className="flex items-center gap-3">
            <Avatar size="lg"><AvatarFallback>{initials(p.name)}</AvatarFallback></Avatar>
            <div className="min-w-0">
              <div className="truncate font-semibold">{p.name}</div>
              <div className="truncate text-sm text-muted-foreground">@{p.handle} · {p.time}</div>
            </div>
          </div>
          <p className="mt-6 max-w-2xl text-2xl leading-snug break-words">{p.text}</p>
          {p.image ? <div className="mt-6 aspect-video max-w-2xl rounded-xl bg-muted" /> : null}
          <div className="mt-6 flex gap-6 text-sm text-muted-foreground tabular-nums">
            <span className="flex items-center gap-1.5"><MessageCircle className="size-4" />{fmt(p.replies)} replies</span>
            <span className="flex items-center gap-1.5"><Repeat2 className="size-4" />{fmt(p.reposts)} reposts</span>
            <span className="flex items-center gap-1.5"><Heart className="size-4" />{fmt(p.likes)} likes</span>
          </div>
        </div>
        <div className="flex gap-2 border-t p-4">
          <Input placeholder={`Reply to ${p.name}…`} aria-label="Reply" />
          <Button>Reply</Button>
        </div>
      </section>
    </div>
  )
}
