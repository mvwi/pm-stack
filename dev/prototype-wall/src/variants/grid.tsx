import { Heart } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fmt, initials, posts } from "./data"

// Axis: layout. Media-first masonry; text posts become colored tiles so the grid never has holes.
const tints = ["bg-amber-100", "bg-sky-100", "bg-rose-100", "bg-emerald-100", "bg-violet-100"]

export default function Grid() {
  return (
    <div className="min-h-svh bg-muted/40 p-4 text-foreground md:p-8">
      <div className="mb-6 flex items-center gap-4">
        <h1 className="text-2xl font-semibold">Discover</h1>
        <Tabs defaultValue="all" className="ml-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="columns-2 gap-4 md:columns-4 [&>*]:mb-4">
        {[...posts, ...posts].map((p, i) => (
          <Card key={i} className="break-inside-avoid gap-0 overflow-hidden p-0">
            {p.image ? (
              <div className="aspect-[3/4] bg-gradient-to-br from-neutral-200 to-neutral-400" />
            ) : (
              <p className={`p-4 text-lg leading-snug font-medium break-words ${tints[i % tints.length]}`}>{p.text}</p>
            )}
            <div className="flex items-center gap-2 p-3 text-xs">
              <Avatar size="sm"><AvatarFallback>{initials(p.name)}</AvatarFallback></Avatar>
              <span className="min-w-0 truncate">{p.name}</span>
              <span className="ml-auto flex shrink-0 items-center gap-1 text-muted-foreground tabular-nums"><Heart className="size-3" />{fmt(p.likes)}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
