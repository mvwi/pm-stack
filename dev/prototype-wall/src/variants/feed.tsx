import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Repeat2,
  Search,
  Share,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { follows, fmt, initials, nav, posts, trends } from "./data"

export default function Feed() {
  return (
    <div className="flex min-h-svh justify-center bg-background text-foreground">
      {/* Left nav: icons only on tablet, labels on desktop */}
      <aside className="sticky top-0 hidden h-svh w-20 shrink-0 flex-col items-center gap-1 border-r px-2 py-4 md:flex xl:w-64 xl:items-stretch">
        <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-foreground text-lg font-bold text-background xl:ml-2">
          w
        </div>
        {nav.map(({ icon: Icon, label, count }) => (
          <Button
            key={label}
            variant="ghost"
            className="h-12 justify-start gap-4 rounded-full px-3 text-lg font-normal [&_svg]:size-6"
            aria-label={label}
          >
            <span className="relative">
              <Icon />
              {count ? (
                <Badge className="absolute -top-2 -right-2 h-4 min-w-4 px-1 text-[10px]">
                  {count}
                </Badge>
              ) : null}
            </span>
            <span className="hidden xl:inline">{label}</span>
          </Button>
        ))}
        <Button className="mt-4 h-12 rounded-full text-base" aria-label="Post">
          <span className="hidden xl:inline">Post</span>
          <span className="xl:hidden">+</span>
        </Button>
      </aside>

      {/* Feed */}
      <main className="w-full max-w-[600px] min-w-0 border-r pb-16 md:pb-0">
        <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
          <Tabs defaultValue="for-you">
            <TabsList variant="line" className="h-12 w-full">
              <TabsTrigger value="for-you" className="flex-1">
                For you
              </TabsTrigger>
              <TabsTrigger value="following" className="flex-1">
                Following
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </header>

        <div className="flex gap-3 border-b p-4">
          <Avatar size="lg">
            <AvatarFallback>MW</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <textarea
              aria-label="Compose post"
              placeholder="What's happening?"
              rows={2}
              className="w-full resize-none bg-transparent text-xl outline-none placeholder:text-muted-foreground"
            />
            <div className="flex justify-end">
              <Button className="rounded-full px-4">Post</Button>
            </div>
          </div>
        </div>

        {posts.map((p) => (
          <article key={p.handle} className="flex gap-3 border-b p-4 hover:bg-muted/40">
            <Avatar size="lg">
              <AvatarFallback>{initials(p.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1 text-sm">
                <span className="min-w-0 truncate font-semibold">{p.name}</span>
                {p.verified ? (
                  <Badge variant="secondary" className="h-4 px-1 text-[10px]">
                    ✓
                  </Badge>
                ) : null}
                <span className="min-w-0 shrink-[3] truncate text-muted-foreground">
                  @{p.handle} · {p.time}
                </span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="ml-auto shrink-0 rounded-full"
                  aria-label="More"
                >
                  <MoreHorizontal />
                </Button>
              </div>
              <p className="mt-0.5 text-[15px] leading-snug break-words">{p.text}</p>
              {p.image ? (
                <div className="mt-3 aspect-video rounded-2xl border bg-gradient-to-br from-muted to-muted-foreground/20" />
              ) : null}
              <div className="mt-2 flex max-w-md justify-between text-muted-foreground">
                {[
                  { icon: MessageCircle, n: p.replies, label: "Reply" },
                  { icon: Repeat2, n: p.reposts, label: "Repost" },
                  { icon: Heart, n: p.likes, label: "Like" },
                ].map(({ icon: Icon, n, label }) => (
                  <Button
                    key={label}
                    variant="ghost"
                    size="sm"
                    className="-ml-2 gap-1.5 rounded-full font-normal text-muted-foreground tabular-nums"
                    aria-label={`${label} (${n})`}
                  >
                    <Icon />
                    {n ? fmt(n) : ""}
                  </Button>
                ))}
                <Button variant="ghost" size="icon-sm" className="rounded-full" aria-label="Share">
                  <Share />
                </Button>
              </div>
            </div>
          </article>
        ))}
      </main>

      {/* Right rail: desktop only */}
      <aside className="sticky top-0 hidden h-svh w-[350px] shrink-0 flex-col gap-4 overflow-y-auto px-6 py-3 lg:flex">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search" aria-label="Search" className="h-10 rounded-full pl-9" />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">What's happening</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {trends.map((t) => (
              <div key={t.name}>
                <div className="text-xs text-muted-foreground">{t.topic} · Trending</div>
                <div className="font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.posts} posts</div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Who to follow</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {follows.map((f, i) => (
              <div key={f.handle}>
                {i > 0 ? <Separator className="mb-3" /> : null}
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{initials(f.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">{f.name}</div>
                    <div className="truncate text-xs text-muted-foreground">@{f.handle}</div>
                  </div>
                  <Button size="sm" className="rounded-full">
                    Follow
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </aside>

      {/* Bottom nav: mobile only */}
      <nav className="fixed inset-x-0 bottom-0 flex justify-around border-t bg-background py-2 md:hidden">
        {nav.slice(0, 4).map(({ icon: Icon, label }) => (
          <Button key={label} variant="ghost" size="icon-lg" aria-label={label}>
            <Icon className="size-6" />
          </Button>
        ))}
      </nav>
    </div>
  )
}
