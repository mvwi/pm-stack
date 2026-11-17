// Checks a running wall headlessly: one frame per variant per size, each
// rendered, fonts loaded, no console errors. Saves a screenshot to look at.
//
//   node <skill>/verify.mjs http://localhost:5173/wall/wall.html [shot.png]
//
// Run it from the project root: it uses the project's Playwright.
import { createRequire } from "node:module"

const [url, shot = "wall-verify.png"] = process.argv.slice(2)
if (!url) {
  console.error("Usage: node verify.mjs <wall url> [screenshot path]")
  process.exit(2)
}

let chromium
try {
  ;({ chromium } = createRequire(`${process.cwd()}/`)("playwright"))
} catch {
  console.error("Playwright isn't installed in this project. Check the wall with a browser tool instead.")
  process.exit(2)
}

const manifestUrl = new URL(new URL(url).searchParams.get("manifest") ?? "wall.json", url)
const manifest = await (await fetch(manifestUrl, { cache: "no-store" })).json()
const expected = manifest.variants.length * (manifest.sizes?.length || 1)

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })
const errors = new Set()
page.on("console", (m) => m.type() === "error" && errors.add(m.text().slice(0, 200)))
page.on("pageerror", (e) => errors.add(e.message.slice(0, 200)))

// Not "networkidle": the wall polls wall.json, so the network never goes quiet.
await page.goto(url, { waitUntil: "load" })

const frameState = () =>
  Promise.all(
    page.frames().filter((f) => f !== page.mainFrame()).map((f) =>
      f
        .evaluate(() => ({
          url: location.pathname + location.search,
          text: document.readyState === "complete" ? document.body?.innerText.trim().length ?? 0 : 0,
          badFonts: [...document.fonts].filter((x) => x.status === "error").map((x) => x.family),
        }))
        .catch(() => ({ url: f.url(), text: 0, badFonts: [] })),
    ),
  )

// Frames load a few at a time, so give a big wall time to fill.
let states = []
const deadline = Date.now() + 120_000
while (Date.now() < deadline) {
  states = await frameState()
  if (states.length >= expected && states.every((s) => s.text > 0)) break
  await page.waitForTimeout(1000)
}
await page.waitForTimeout(1000) // late console errors
await page.keyboard.press("f")
await page.waitForTimeout(800)
await page.screenshot({ path: shot })
await browser.close()

const problems = []
if (states.length !== expected) problems.push(`expected ${expected} frames, found ${states.length}`)
for (const s of states) {
  if (s.text === 0) problems.push(`blank or unfinished: ${s.url}`)
  if (s.badFonts.length) problems.push(`fonts failed in ${s.url}: ${[...new Set(s.badFonts)].join(", ")}`)
}
for (const e of errors) problems.push(`console: ${e}`)

if (problems.length) {
  console.log(`${states.length} frames, ${problems.length} problems:\n- ${problems.join("\n- ")}`)
} else {
  console.log(`${states.length} frames, all rendered, fonts loaded, console clean.`)
}
console.log(`Screenshot: ${shot}`)
process.exit(problems.length ? 1 : 0)
