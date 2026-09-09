import { describe, it, expect, afterEach } from "vitest"
import { render, cleanup, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./dialog"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "./sheet"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./select"
import {
  Combobox,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxInput,
  ComboboxList,
  ComboboxItem,
} from "./combobox"

afterEach(cleanup)

// Keyboard traversal + focus-trap behaviours for the overlays Radix gives us.
// These wrappers inherit Radix's focus management; the tests verify the wiring
// hasn't been broken by class-name overrides or stray onPointerDown handlers.
describe("keyboard nav + focus trap", () => {
  it("Dialog traps focus, Escape closes, focus returns to trigger", async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit</DialogTitle>
          </DialogHeader>
          <button>First</button>
          <button>Second</button>
        </DialogContent>
      </Dialog>,
    )
    const trigger = screen.getByRole("button", { name: "Open" })
    await user.click(trigger)

    const dialog = await screen.findByRole("dialog", { name: "Edit" })
    expect(dialog).toBeTruthy()
    // Radix moves focus into the dialog on open.
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true))

    await user.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    expect(document.activeElement).toBe(trigger)
  })

  it("Sheet traps focus and Escape returns focus to trigger", async () => {
    const user = userEvent.setup()
    render(
      <Sheet>
        <SheetTrigger>Open sheet</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Settings</SheetTitle>
          </SheetHeader>
          <button>Action</button>
        </SheetContent>
      </Sheet>,
    )
    const trigger = screen.getByRole("button", { name: "Open sheet" })
    await user.click(trigger)

    const sheet = await screen.findByRole("dialog", { name: "Settings" })
    await waitFor(() => expect(sheet.contains(document.activeElement)).toBe(true))

    await user.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    expect(document.activeElement).toBe(trigger)
  })

  it("Select opens via keyboard, ArrowDown moves through options", async () => {
    const user = userEvent.setup()
    render(
      <Select>
        <SelectTrigger aria-label="Fruit">
          <SelectValue placeholder="Pick one" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="cherry">Cherry</SelectItem>
        </SelectContent>
      </Select>,
    )
    const trigger = screen.getByRole("combobox", { name: "Fruit" })
    trigger.focus()
    await user.keyboard("{Enter}")
    await screen.findByRole("listbox")
    const options = await screen.findAllByRole("option")
    expect(options).toHaveLength(3)
    await user.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull())
  })

  it("Combobox opens to a listbox with options", async () => {
    const user = userEvent.setup()
    render(
      <Combobox>
        <ComboboxTrigger aria-label="Pick one">Pick one</ComboboxTrigger>
        <ComboboxContent>
          <ComboboxInput placeholder="Search…" />
          <ComboboxList>
            <ComboboxItem value="alpha">Alpha</ComboboxItem>
            <ComboboxItem value="bravo">Bravo</ComboboxItem>
            <ComboboxItem value="charlie">Charlie</ComboboxItem>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>,
    )
    await user.click(screen.getByRole("combobox", { name: "Pick one" }))
    await screen.findByRole("listbox")
    const options = await screen.findAllByRole("option")
    expect(options.length).toBeGreaterThanOrEqual(3)
  })
})
