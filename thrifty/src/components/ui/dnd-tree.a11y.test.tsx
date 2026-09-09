import { describe, it, expect, vi, afterEach } from "vitest"
import { render, cleanup, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expectNoA11yViolations } from "../../test/a11y"
import { Tree, TreeItem } from "./tree"
import { Sortable, SortableItem } from "./sortable"
import { Drawer } from "./drawer"

afterEach(cleanup)

// Minimal icon stub for TreeItem's `icon` slot.
const Dot = ({ className }: { className?: string }) => <span className={className} aria-hidden />

describe("Tree a11y (APG treeview)", () => {
  it("exposes tree / treeitem / group roles and aria-expanded", async () => {
    const { container } = render(
      <Tree label="Files">
        <TreeItem icon={Dot} label="src" defaultOpen>
          <TreeItem icon={Dot} label="index.ts" onSelect={() => {}} />
        </TreeItem>
      </Tree>,
    )
    expect(screen.getByRole("tree", { name: "Files" })).toBeTruthy()
    const items = screen.getAllByRole("treeitem")
    expect(items.length).toBe(2)
    // Parent advertises expanded state; leaf does not.
    expect(items[0].getAttribute("aria-expanded")).toBe("true")
    expect(items[1].getAttribute("aria-expanded")).toBeNull()
    expect(screen.getByRole("group")).toBeTruthy()
    await expectNoA11yViolations(container)
  })

  it("moves focus with ArrowDown (roving tabindex)", async () => {
    const user = userEvent.setup()
    render(
      <Tree label="Files">
        <TreeItem icon={Dot} label="a" onSelect={() => {}} />
        <TreeItem icon={Dot} label="b" onSelect={() => {}} />
      </Tree>,
    )
    const items = screen.getAllByRole("treeitem")
    items[0].focus()
    await user.keyboard("{ArrowDown}")
    expect(document.activeElement).toBe(items[1])
  })
})

describe("Sortable a11y (keyboard reorder)", () => {
  it("exposes list semantics and reorders via keyboard", async () => {
    const user = userEvent.setup()
    const onReorder = vi.fn()
    const { container } = render(
      <Sortable label="Tasks" items={[{ id: "a" }, { id: "b" }]} onReorder={onReorder}>
        <SortableItem id="a">Task A</SortableItem>
        <SortableItem id="b">Task B</SortableItem>
      </Sortable>,
    )
    expect(screen.getByRole("list", { name: "Tasks" })).toBeTruthy()
    const items = screen.getAllByRole("listitem")
    expect(items.length).toBe(2)
    items[0].focus()
    await user.keyboard("{ }") // grab
    await user.keyboard("{ArrowDown}") // move down
    expect(onReorder).toHaveBeenCalledTimes(1)
    expect(onReorder.mock.calls[0][0].map((i: { id: string }) => i.id)).toEqual(["b", "a"])
    await expectNoA11yViolations(container)
  })
})

describe("Drawer a11y (inert when closed)", () => {
  it("hides content from focus + AT when closed, exposes it when open", () => {
    const { rerender, container } = render(
      <div className="relative">
        <Drawer open={false} label="Player">
          <button>Play</button>
        </Drawer>
      </div>,
    )
    const region = container.querySelector('[role="region"]')!
    expect(region.getAttribute("aria-hidden")).toBe("true")
    expect(region.hasAttribute("inert")).toBe(true)

    rerender(
      <div className="relative">
        <Drawer open label="Player">
          <button>Play</button>
        </Drawer>
      </div>,
    )
    const open = container.querySelector('[role="region"]')!
    expect(open.getAttribute("aria-hidden")).toBeNull()
    expect(open.hasAttribute("inert")).toBe(false)
  })
})
