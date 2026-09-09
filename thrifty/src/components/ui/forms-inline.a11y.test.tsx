import { describe, it, afterEach } from "vitest"
import { render, cleanup, screen } from "@testing-library/react"
import { expectNoA11yViolations } from "../../test/a11y"
import { Input } from "./input"
import { Textarea } from "./textarea"
import { Label } from "./label"
import { Toggle } from "./toggle"
import { ToggleGroup, ToggleGroupItem } from "./toggle-group"
import { Slider } from "./slider"
import { Progress } from "./progress"
import { Meter } from "./meter"
import { Avatar, AvatarImage, AvatarFallback } from "./avatar"
import { Separator } from "./separator"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./collapsible"

afterEach(cleanup)

describe("form + inline primitive a11y", () => {
  it("Input is labelled via Label htmlFor", async () => {
    const { container } = render(
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" />
      </div>,
    )
    screen.getByLabelText("Email")
    await expectNoA11yViolations(container)
  })

  it("Textarea is labelled via Label htmlFor", async () => {
    const { container } = render(
      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" />
      </div>,
    )
    screen.getByLabelText("Bio")
    await expectNoA11yViolations(container)
  })

  it("Toggle exposes an accessible name", async () => {
    const { container } = render(<Toggle aria-label="Bold">B</Toggle>)
    screen.getByRole("button", { name: "Bold" })
    await expectNoA11yViolations(container)
  })

  it("ToggleGroup items are named", async () => {
    const { container } = render(
      <ToggleGroup type="single" aria-label="Alignment">
        <ToggleGroupItem value="left" aria-label="Align left">L</ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Align center">C</ToggleGroupItem>
      </ToggleGroup>,
    )
    await expectNoA11yViolations(container)
  })

  it("Slider has an accessible name", async () => {
    const { container } = render(<Slider defaultValue={[50]} aria-label="Volume" />)
    await expectNoA11yViolations(container)
  })

  it("Progress is a named progressbar", async () => {
    const { container } = render(<Progress value={60} aria-label="Loading" />)
    await expectNoA11yViolations(container)
  })

  it("Meter is a named meter", async () => {
    const { container } = render(<Meter value={60} min={0} max={100} label="Battery" />)
    await expectNoA11yViolations(container)
  })

  it("Avatar image has alt text (with fallback)", async () => {
    const { container } = render(
      <Avatar>
        <AvatarImage src="/x.png" alt="Jane Doe" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>,
    )
    await expectNoA11yViolations(container)
  })

  it("Separator renders without violations", async () => {
    const { container } = render(<Separator />)
    await expectNoA11yViolations(container)
  })

  it("Collapsible exposes a button trigger", async () => {
    const { container } = render(
      <Collapsible>
        <CollapsibleTrigger>Details</CollapsibleTrigger>
        <CollapsibleContent>Body</CollapsibleContent>
      </Collapsible>,
    )
    screen.getByRole("button", { name: "Details" })
    await expectNoA11yViolations(container)
  })
})
