import { describe, it, afterEach } from "vitest"
import { render, cleanup, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expectNoA11yViolations } from "../../test/a11y"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./dialog"

afterEach(cleanup)

// Overlay pattern: open the dialog, then assert it's a labelled `dialog` and
// the portaled content (rendered on document.body) is axe-clean. Proves the
// interaction-based path the rest of the overlays (Popover, Tooltip, Select,
// menus) will follow.
describe("Dialog a11y (open state)", () => {
  it("opens to a labelled dialog with no axe violations", async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <DialogTrigger>Open settings</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>Adjust your preferences.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    )
    await user.click(screen.getByRole("button", { name: "Open settings" }))
    screen.getByRole("dialog", { name: "Settings" })
    // DialogContent portals to document.body, so axe the whole document.
    await expectNoA11yViolations(document.body)
  })
})
