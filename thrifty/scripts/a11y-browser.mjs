// Real-browser a11y audit: loads a running URL in Chromium (Playwright),
// injects axe-core, and runs the full ruleset INCLUDING color-contrast and
// other checks jsdom can't do (real layout + computed styles). Point it at the
// Studio dev server, which renders the library components styled + themed.
//
//   URL=http://localhost:5173 node scripts/a11y-browser.mjs
import { chromium } from "playwright"
import { createRequire } from "module"

const require = createRequire(import.meta.url)
const axePath = require.resolve("axe-core/axe.min.js")
const url = process.env.URL || "http://localhost:5173"

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

// Wait for the dev server to be up.
let up = false
for (let i = 0; i < 40 && !up; i++) {
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 2000 })
    up = true
  } catch {
    await new Promise((r) => setTimeout(r, 1000))
  }
}
if (!up) {
  console.error(`Could not reach ${url}`)
  await browser.close()
  process.exit(1)
}

await page.waitForTimeout(1500) // let the app settle
await page.addScriptTag({ path: axePath })

const results = await page.evaluate(async () => {
  // axe-core attaches to window
  return await window.axe.run(document, { resultTypes: ["violations"] })
})

const v = results.violations
console.log(`\n=== axe (real Chromium) on ${url} — ${v.length} violation type(s) ===`)
for (const it of v) {
  console.log(`\n[${it.impact}] ${it.id} — ${it.help} (${it.nodes.length} node(s))`)
  for (const n of it.nodes.slice(0, 4)) {
    console.log(`   ${n.target.join(" ")}`)
  }
}
await browser.close()
process.exit(0)
