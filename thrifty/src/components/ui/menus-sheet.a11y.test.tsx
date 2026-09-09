import { describe, it, afterEach } from "vitest"
import { render, cleanup, screen, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expectNoA11yViolations } from "../../test/a11y"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./sheet"
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "./menubar"
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "./context-menu"

afterEach(cleanup)

describe("sheet + menu a11y (open state)", () => {
  it("Sheet opens to a labelled dialog", async () => {
    const user = userEvent.setup()
    render(
      <Sheet>
        <SheetTrigger>Open filters</SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>Refine the results.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>,
    )
    await user.click(screen.getByRole("button", { name: "Open filters" }))
    screen.getByRole("dialog", { name: "Filters" })
    await expectNoA11yViolations(document.body)
  })

  it("Menubar opens a menu of menuitems", async () => {
    const user = userEvent.setup()
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New</MenubarItem>
            <MenubarItem>Open</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    )
    await user.click(screen.getByRole("menuitem", { name: "File" }))
    await screen.findByRole("menu")
    await expectNoA11yViolations(document.body)
  })

  it("ContextMenu opens on right-click", async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>Right-click here</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Copy</ContextMenuItem>
          <ContextMenuItem>Paste</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    )
    fireEvent.contextMenu(screen.getByText("Right-click here"))
    await screen.findByRole("menu")
    await expectNoA11yViolations(document.body)
  })
})
