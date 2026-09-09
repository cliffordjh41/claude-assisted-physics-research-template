import { chromium } from "playwright"
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto("http://localhost:5174/philosophy", { waitUntil: "domcontentloaded" }).catch(() => {})
await page.waitForTimeout(1800)
await page.screenshot({ path: "/tmp/philosophy.png" })
await browser.close()
