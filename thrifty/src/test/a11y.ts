import axe from "axe-core"
import { expect } from "vitest"

// Run axe-core against a rendered container and fail on any violation.
// `color-contrast` is disabled: jsdom has no layout or computed styles, so
// contrast can't be evaluated here — verify that in a real browser.
export async function expectNoA11yViolations(container: Element): Promise<void> {
  const results = await axe.run(container, {
    rules: {
      // jsdom has no layout/computed styles — contrast can't be evaluated here.
      "color-contrast": { enabled: false },
      // Page-level rule (all content must sit inside landmarks). Not applicable
      // when testing a component in isolation — landmarks are the consuming
      // app's responsibility, not the library's.
      region: { enabled: false },
    },
  })

  if (results.violations.length > 0) {
    const summary = results.violations
      .map((v) => `  - ${v.id}: ${v.help} [${v.nodes.length} node(s)]`)
      .join("\n")
    expect.fail(
      `axe found ${results.violations.length} a11y violation(s):\n${summary}`,
    )
  }
}
