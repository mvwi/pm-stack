import { Heart, MessageCircle, Repeat2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { fmt, nav, posts } from "./data"

// Axis: density. Every post is one scannable row; numbers line up in columns.
export default function Dense() {
  return (
    <div className="flex min-h-svh bg-background text-sm text-foreground">
      <aside className="hidden w-48 shrink-0 border-r p-2 md:block">
        {nav.map(({ icon: Icon, label, count }) => (
          <div key={label} className="flex h-8 items-center gap-2 rounded-md px-2 hover:bg-muted">
            <Icon className="size-4 text-muted-foreground" />
            <span>{label}</span>
            {count ? <Badge variant="secondary" className="ml-auto h-4 px-1 text-[10px]">{count}</Badge> : null}
          </div>
        ))}
      </aside>
      <main className="min-w-0 flex-1">
        <div className="flex h-10 items-center gap-2 border-b px-3">
          <span className="font-medium">Home</span>
          <span className="text-muted-foreground">{posts.length} new</span>
          <Input placeholder="Filter…" aria-label="Filter" className="ml-auto h-7 w-40 max-md:hidden" />
        </div>
        {[...posts, ...posts].map((p, i) => (
          <div key={i} className="flex h-9 items-center gap-3 border-b px-3 hover:bg-muted/50">
            <span className="w-28 shrink-0 truncate font-medium md:w-44">{p.name}</span>
            <span className="min-w-0 flex-1 truncate text-muted-foreground">{p.text}</span>
            <span className="hidden w-14 shrink-0 items-center justify-end gap-1 text-xs text-muted-foreground tabular-nums md:flex"><MessageCircle className="size-3" />{fmt(p.replies)}</span>
            <span className="hidden w-14 shrink-0 items-center justify-end gap-1 text-xs text-muted-foreground tabular-nums md:flex"><Repeat2 className="size-3" />{fmt(p.reposts)}</span>
            <span className="flex w-14 shrink-0 items-center justify-end gap-1 text-xs text-muted-foreground tabular-nums"><Heart className="size-3" />{fmt(p.likes)}</span>
            <span className="w-8 shrink-0 text-right text-xs text-muted-foreground">{p.time}</span>
          </div>
        ))}
      </main>
    </div>
  )
}
