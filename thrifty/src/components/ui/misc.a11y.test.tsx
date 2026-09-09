import { describe, it, afterEach } from "vitest"
import { render, cleanup, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expectNoA11yViolations } from "../../test/a11y"
import { ScrollArea } from "./scroll-area"
import { AspectRatio } from "./aspect-ratio"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "./tooltip"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "./hover-card"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "./navigation-menu"

afterEach(cleanup)

describe("misc primitive a11y", () => {
  it("ScrollArea renders without violations", async () => {
    const { container } = render(
      <ScrollArea className="h-20 w-40">
        <div>Scrollable content goes here.</div>
      </ScrollArea>,
    )
    await expectNoA11yViolations(container)
  })

  it("AspectRatio image has alt text", async () => {
    const { container } = render(
      <div className="w-40">
        <AspectRatio ratio={16 / 9}>
          <img src="/demo.png" alt="Demo image" />
        </AspectRatio>
      </div>,
    )
    await expectNoA11yViolations(container)
  })

  it("NavigationMenu structure is accessible", async () => {
    const { container } = render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="/">Home</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="/a">Item A</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    )
    await expectNoA11yViolations(container)
  })

  it("Tooltip opens to a named tooltip", async () => {
    const user = userEvent.setup()
    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild><button>Help</button></TooltipTrigger>
          <TooltipContent>Helpful info</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )
    await user.hover(screen.getByRole("button", { name: "Help" }))
    await screen.findByRole("tooltip")
    await expectNoA11yViolations(document.body)
  })

  it("HoverCard opens with no violations", async () => {
    const user = userEvent.setup()
    render(
      <HoverCard openDelay={0} closeDelay={0}>
        <HoverCardTrigger asChild><a href="#">@jane</a></HoverCardTrigger>
        <HoverCardContent>Jane's profile</HoverCardContent>
      </HoverCard>,
    )
    await user.hover(screen.getByRole("link", { name: "@jane" }))
    await screen.findByText("Jane's profile")
    await expectNoA11yViolations(document.body)
  })
})
