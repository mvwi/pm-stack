import { useState } from "react"
import { posts } from "./data"
import { Act } from "./act"
import { useLikes } from "./kit"

// Axis: every post is a labeled panel, like a channel on a track sheet. Accent marks only what's new.
const NEW = 3

export default function Sheet() {
  const [tab, setTab] = useState<"all" | "following">("all")
  const [draft, setDraft] = useState("")
  const [mine, setMine] = useState<string[]>([])
  const { liked, toggle, count } = useLikes()
  const shown = tab === "all" ? posts : posts.filter((p) => p.verified)

  return (
    <div className="mv min-h-svh bg-(--page)! px-4 py-6 md:py-10">
      <div className="mx-auto flex max-w-[640px] flex-col gap-4">
        <header className="flex items-baseline justify-between border-b border-(--ink) pb-3">
          <h1 className="cap font-semibold">Home feed</h1>
          <span className="cap text-(--mute)">
            [{shown.length + mine.length} posts · <span className="text-(--acc)">{NEW} new</span>]
          </span>
        </header>

        <div role="tablist" className="flex gap-6">
          {(["all", "following"] as const).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className="cap border-b-2 border-transparent pb-1 text-(--mute) aria-selected:border-(--ink) aria-selected:text-(--ink)"
            >
              {t === "all" ? "For you" : "Following"}
            </button>
          ))}
        </div>

        <form
          className="border border-(--rule) bg-(--paper)"
          onSubmit={(e) => {
            e.preventDefault()
            if (!draft.trim()) return
            setMine((m) => [draft.trim(), ...m])
            setDraft("")
          }}
        >
          <div className="cap flex justify-between border-b border-(--rule) px-4 py-2 font-semibold">
            <span>New post</span>
            <span className={draft.length > 280 ? "text-(--acc)" : "text-(--mute)"}>
              [{draft.length} / 280]
            </span>
          </div>
          <textarea
            aria-label="Write a post"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="What's happening?"
            rows={2}
            className="block w-full resize-none bg-transparent px-4 py-3 text-base outline-none placeholder:text-(--mute)"
          />
          <div className="flex justify-end border-t border-(--rule) px-4 py-2">
            <button
              disabled={!draft.trim() || draft.length > 280}
              className="cap h-8 rounded-full bg-(--ink) px-4 font-semibold text-(--paper) disabled:opacity-40"
            >
              Post
            </button>
          </div>
        </form>

        {mine.map((text, i) => (
          <section key={`mine-${mine.length - i}`} className="border border-(--ink) bg-(--paper)">
            <div className="cap flex justify-between border-b border-(--rule) px-4 py-2 font-semibold">
              <span>You</span>
              <span className="text-(--mute)">[now]</span>
            </div>
            <p className="px-4 py-3 text-[15px] leading-normal break-words">{text}</p>
          </section>
        ))}

        {shown.map((p, i) => {
          const fresh = tab === "all" && i < NEW
          return (
            <article key={p.handle} className="border border-(--rule) bg-(--paper)">
              <div className="cap flex items-baseline gap-3 border-b border-(--rule) px-4 py-2">
                <span className={fresh ? "text-(--acc)" : "text-(--mute)"}>
                  CH.{String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 truncate font-semibold" title={p.name}>
                  {p.name}
                </span>
                <span className="ml-auto shrink-0 text-(--mute)">
                  [{p.time}
                  {p.verified ? " · ✓" : ""}]
                </span>
              </div>
              <div className="px-4 py-3">
                <div className="mono mb-1 truncate text-xs text-(--mute)">@{p.handle}</div>
                <p className="text-[15px] leading-normal break-words">{p.text}</p>
                {p.image ? (
                  <div className="mt-3 aspect-video border border-(--rule)">
                    <div className="shade size-full" />
                  </div>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2 border-t border-(--rule) px-4 py-2">
                <Act label="Reply" n={p.replies} />
                <Act label="Repost" n={p.reposts} />
                <Act label="Like" n={count(p)} on={liked.has(p.handle)} onClick={() => toggle(p.handle)} />
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
