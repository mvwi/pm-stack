import { Heart, MessageCircle, Repeat2, Search } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { fmt, initials, nav, posts } from "./data"

// Axis: strip the chrome. One reading column, nav shrinks to a quiet top bar.
export default function Focus() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-xl items-center gap-1 px-4">
          <span className="mr-auto font-semibold">w</span>
          {nav.slice(0, 4).map(({ icon: Icon, label }) => (
            <Button key={label} variant="ghost" size="icon" aria-label={label}>
              <Icon />
            </Button>
          ))}
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search />
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-xl px-4">
        {posts.map((p) => (
          <article key={p.handle} className="border-b py-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Avatar size="sm">
                <AvatarFallback>{initials(p.name)}</AvatarFallback>
              </Avatar>
              <span className="min-w-0 truncate text-foreground">{p.name}</span>
              <span className="shrink-0">· {p.time}</span>
            </div>
            <p className="mt-3 text-xl leading-relaxed break-words">{p.text}</p>
            {p.image ? <div className="mt-4 aspect-[4/3] rounded-xl bg-muted" /> : null}
            <div className="mt-4 flex gap-6 text-sm text-muted-foreground tabular-nums">
              <span className="flex items-center gap-1.5"><MessageCircle className="size-4" />{fmt(p.replies)}</span>
              <span className="flex items-center gap-1.5"><Repeat2 className="size-4" />{fmt(p.reposts)}</span>
              <span className="flex items-center gap-1.5"><Heart className="size-4" />{fmt(p.likes)}</span>
            </div>
          </article>
        ))}
      </main>
    </div>
  )
}
