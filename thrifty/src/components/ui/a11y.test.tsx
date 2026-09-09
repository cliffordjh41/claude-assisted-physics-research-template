import { describe, it, afterEach } from "vitest"
import { render, cleanup, screen } from "@testing-library/react"
import { expectNoA11yViolations } from "../../test/a11y"
import { Button } from "./button"
import { Badge } from "./badge"
import { Switch } from "./switch"
import { Checkbox } from "./checkbox"

afterEach(cleanup)

// Structural a11y sweep (roles / names / aria). Color contrast is checked in a
// real browser, not here. Each test renders a primitive in correct usage and
// asserts axe finds no violations.
describe("primitive a11y", () => {
  it("Button exposes its label as a button", async () => {
    const { container } = render(<Button>Save</Button>)
    screen.getByRole("button", { name: "Save" })
    await expectNoA11yViolations(container)
  })

  it("Badge renders without violations", async () => {
    const { container } = render(<Badge>New</Badge>)
    await expectNoA11yViolations(container)
  })

  it("Switch with a label is an accessible switch", async () => {
    const { container } = render(<Switch aria-label="Notifications" />)
    screen.getByRole("switch", { name: "Notifications" })
    await expectNoA11yViolations(container)
  })

  it("Checkbox with a label is an accessible checkbox", async () => {
    const { container } = render(<Checkbox aria-label="Accept terms" />)
    screen.getByRole("checkbox", { name: "Accept terms" })
    await expectNoA11yViolations(container)
  })
})
