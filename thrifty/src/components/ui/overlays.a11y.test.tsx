import { describe, it, afterEach } from "vitest"
import { render, cleanup, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expectNoA11yViolations } from "../../test/a11y"
import { Popover, PopoverTrigger, PopoverContent } from "./popover"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "./alert-dialog"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./dropdown-menu"

afterEach(cleanup)

// Click-triggered overlays: open, then axe the portaled content on document.body.
describe("overlay a11y (open state)", () => {
  it("Popover opens with no violations", async () => {
    const user = userEvent.setup()
    render(
      <Popover>
        <PopoverTrigger>Open popover</PopoverTrigger>
        <PopoverContent aria-label="Account details">
          <p>Popover content</p>
        </PopoverContent>
      </Popover>,
    )
    await user.click(screen.getByRole("button", { name: "Open popover" }))
    await expectNoA11yViolations(document.body)
  })

  it("AlertDialog opens to a labelled alertdialog", async () => {
    const user = userEvent.setup()
    render(
      <AlertDialog>
        <AlertDialogTrigger>Delete</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>,
    )
    await user.click(screen.getByRole("button", { name: "Delete" }))
    screen.getByRole("alertdialog", { name: "Are you sure?" })
    await expectNoA11yViolations(document.body)
  })

  it("DropdownMenu opens to a menu of menuitems", async () => {
    const user = userEvent.setup()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    await user.click(screen.getByRole("button", { name: "Menu" }))
    screen.getByRole("menu")
    await expectNoA11yViolations(document.body)
  })
})
