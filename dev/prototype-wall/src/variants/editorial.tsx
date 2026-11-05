import { fmt, posts, trends } from "./data"

// Axis: personality. Posts read as headlines in a front page; the loudest post leads.
export default function Editorial() {
  const [lead, ...rest] = [...posts].sort((a, b) => b.likes - a.likes)
  return (
    <div className="min-h-svh bg-[#faf8f4] font-serif text-neutral-900">
      <header className="border-b-2 border-neutral-900 px-6 py-4 text-center md:px-12">
        <div className="text-xs tracking-[0.3em] text-neutral-500 uppercase">Wednesday · Your feed</div>
        <h1 className="mt-1 text-4xl font-bold tracking-tight md:text-6xl">The Daily Feed</h1>
      </header>
      <nav className="flex justify-center gap-6 overflow-x-auto border-b border-neutral-300 px-6 py-2 font-sans text-xs tracking-wide uppercase">
        {trends.map((t) => <span key={t.name} className="shrink-0">{t.name}</span>)}
      </nav>
      <main className="grid gap-8 px-6 py-8 md:grid-cols-3 md:px-12">
        <article className="md:col-span-2 md:border-r md:border-neutral-300 md:pr-8">
          <div className="aspect-[16/9] bg-neutral-300" />
          <h2 className="mt-4 text-3xl leading-tight font-bold break-words md:text-4xl">{lead.text}</h2>
          <p className="mt-3 font-sans text-sm text-neutral-600">By {lead.name} · {fmt(lead.likes)} likes · {lead.time} ago</p>
        </article>
        <div className="flex flex-col divide-y divide-neutral-300">
          {rest.slice(0, 5).map((p) => (
            <article key={p.handle} className="py-4 first:pt-0">
              <h3 className="text-lg leading-snug font-semibold break-words">{p.text}</h3>
              <p className="mt-1 truncate font-sans text-xs text-neutral-500">{p.name} · {fmt(p.likes)}</p>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}
