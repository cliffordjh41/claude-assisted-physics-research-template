// Real-browser a11y sweep of the published kit's live surface (Studio), running
// the full axe-core ruleset incl. color-contrast in Chromium. Studio mounts the
// theming panels (ColorPanel + Style/Typography/Effects) and MusicPlayer inside
// the slidable-column shell + ColumnToolBar, so a page audit covers the kit's
// real surfaces at once. Drawers (Typography, Effects) and the B color variant
// are opened and audited separately since they aren't in the default view.
//
//   1. Studio dev server:  (in the studio app)  pnpm dev   # http://localhost:5173
//   2. This sweep:         (in the kit)  URL=http://localhost:5173 node scripts/a11y-sweep.mjs
//
// Rewritten 2026-06-25 for the minimal kit (the old 17-panel carousel was
// removed in the cull; this targets the current Studio composition).
import { chromium } from "playwright"
import { createRequire } from "module"

const require = createRequire(import.meta.url)
const axePath = require.resolve("axe-core/axe.min.js")
const url = process.env.URL || "http://localhost:5173"

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

// Wait for the dev server (Vite cold start + dep optimization).
let up = false
for (let i = 0; i < 60 && !up; i++) {
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 2000 })
    up = true
  } catch {
    await new Promise((r) => setTimeout(r, 1000))
  }
}
if (!up) {
  console.error(`Could not reach ${url} — is the Studio dev server running?`)
  await browser.close()
  process.exit(1)
}

// Confirm the picker has mounted (a ColorPanel neutral swatch), then settle.
try {
  await page.locator('[aria-label="Neutral step 1"]').first().waitFor({ timeout: 15000 })
} catch {
  console.warn("! ColorPanel swatch not found; auditing whatever rendered.")
}
await page.waitForTimeout(1500)
await page.addScriptTag({ path: axePath })

let totalViolations = 0
const offenders = []

// Audit the currently-mounted DOM, full ruleset incl. color-contrast.
const audit = async (label) => {
  const results = await page.evaluate(async () =>
    window.axe.run(document, { resultTypes: ["violations"] })
  )
  const v = results.violations
  const count = v.reduce((acc, it) => acc + it.nodes.length, 0)
  totalViolations += count
  if (v.length) offenders.push(label)
  console.log(`\n=== ${label} — ${v.length} violation type(s), ${count} node(s) ===`)
  for (const it of v) {
    console.log(`  [${it.impact}] ${it.id} — ${it.help} (${it.nodes.length} node(s))`)
    for (const n of it.nodes.slice(0, 6)) console.log(`     ${n.target.join(" ")}`)
  }
}

// A click-by-name step that audits a state, guarded so one missing selector
// doesn't abort the whole sweep.
const step = async (label, fn) => {
  try {
    await fn()
    await page.waitForTimeout(400)
    await audit(label)
  } catch (e) {
    console.log(`  ! ${label} skipped: ${e.message}`)
  }
}

// 1. Default view — ColorPanel + StylePanel + MusicPlayer + shell + toolbar.
await audit("Studio default (picker + shell + MusicPlayer)")

// 2. Typography drawer (left column footer toggle).
await step("Typography drawer", () => page.getByRole("button", { name: "Typography" }).click())
await page.getByRole("button", { name: "Typography" }).click().catch(() => {}) // close

// 3. Effects drawer (right column footer toggle).
await step("Effects drawer", () => page.getByRole("button", { name: "Effects" }).click())
await page.getByRole("button", { name: "Effects" }).click().catch(() => {}) // close

// 4. Color variant B — re-audit for contrast on the dark/alternate palette.
await step("Color variant B (contrast)", async () => {
  await page.getByRole("button", { name: /^B$/ }).first().click()
})

console.log(`\n========================================`)
console.log(`SWEEP DONE — ${totalViolations} violating node(s)`)
console.log(offenders.length ? `States with violations: ${offenders.join(", ")}` : "All states clean.")
await browser.close()
process.exit(totalViolations > 0 ? 1 : 0)
