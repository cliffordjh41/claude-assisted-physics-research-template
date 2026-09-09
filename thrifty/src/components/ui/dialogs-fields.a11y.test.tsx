import { describe, it, afterEach } from "vitest"
import { render, cleanup, screen } from "@testing-library/react"
import { expectNoA11yViolations } from "../../test/a11y"
import { Popup } from "./popup"
import { PanelDialog } from "./panel-dialog"
import {
  PasswordToggleField,
  PasswordToggleFieldInput,
  PasswordToggleFieldToggle,
} from "./password-toggle-field"

afterEach(cleanup)

describe("custom dialogs + password field a11y", () => {
  it("Popup is a labelled dialog when open", async () => {
    render(
      <Popup open name="Settings" description="Manage your settings">
        <div>Settings body</div>
      </Popup>,
    )
    screen.getByRole("dialog", { name: "Settings" })
    await expectNoA11yViolations(document.body)
  })

  it("PanelDialog is a labelled dialog when open", async () => {
    render(
      <PanelDialog
        open
        name="Setup"
        description="Project setup"
        panels={[<div key="1">Step one</div>, <div key="2">Step two</div>]}
      />,
    )
    screen.getByRole("dialog", { name: "Setup" })
    await expectNoA11yViolations(document.body)
  })

  it("PasswordToggleField input + toggle are labelled", async () => {
    const { container } = render(
      <PasswordToggleField>
        <PasswordToggleFieldInput aria-label="Password" />
        <PasswordToggleFieldToggle aria-label="Show password" />
      </PasswordToggleField>,
    )
    screen.getByLabelText("Password")
    await expectNoA11yViolations(container)
  })
})
