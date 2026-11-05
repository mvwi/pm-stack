import { Send } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fmt, initials, posts } from "./data"

// Axis: interaction model. The feed is one group chat; posting is just sending a message.
export default function Chat() {
  return (
    <div className="flex h-svh flex-col bg-background text-foreground">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
        <div className="font-semibold">Home</div>
        <div className="text-sm text-muted-foreground">{posts.length} people talking</div>
      </header>
      <main className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 md:px-[20%]">
        {[...posts].reverse().map((p) => (
          <div key={p.handle} className="flex items-end gap-2">
            <Avatar><AvatarFallback>{initials(p.name)}</AvatarFallback></Avatar>
            <div className="min-w-0 max-w-[80%]">
              <div className="mb-1 truncate pl-3 text-xs text-muted-foreground">{p.name} · {p.time}</div>
              <div className="rounded-2xl rounded-bl-sm bg-muted px-4 py-2.5 break-words">
                {p.text}
                {p.image ? <div className="mt-2 aspect-video w-64 max-w-full rounded-lg bg-muted-foreground/20" /> : null}
              </div>
              <div className="mt-1 pl-3 text-xs text-muted-foreground tabular-nums">♥ {fmt(p.likes)}</div>
            </div>
          </div>
        ))}
        <div className="flex justify-end">
          <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-primary-foreground">
            Killing nine of these is the fun part.
          </div>
        </div>
      </main>
      <footer className="flex gap-2 border-t p-3 md:px-[20%]">
        <Input placeholder="Say something to everyone…" aria-label="Message" />
        <Button size="icon" aria-label="Send"><Send /></Button>
      </footer>
    </div>
  )
}
