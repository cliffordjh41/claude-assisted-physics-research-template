import { describe, it, afterEach } from "vitest"
import { render, cleanup, screen } from "@testing-library/react"
import { expectNoA11yViolations } from "../../test/a11y"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./accordion"
import { RadioGroup, RadioGroupItem } from "./radio-group"

afterEach(cleanup)

// Interactive Radix-backed patterns, composed as a consumer would. axe checks
// the role/aria structure (tablist/tab/tabpanel relationships, radio names,
// etc.). Keyboard nav + focus order are browser-level and checked separately.
describe("interactive primitive a11y", () => {
  it("Tabs expose tablist / tab / tabpanel", async () => {
    const { container } = render(
      <Tabs defaultValue="a">
        <TabsList aria-label="Sections">
          <TabsTrigger value="a">First</TabsTrigger>
          <TabsTrigger value="b">Second</TabsTrigger>
        </TabsList>
        <TabsContent value="a">First panel</TabsContent>
        <TabsContent value="b">Second panel</TabsContent>
      </Tabs>,
    )
    screen.getByRole("tab", { name: "First" })
    await expectNoA11yViolations(container)
  })

  it("Accordion exposes a button-triggered region", async () => {
    const { container } = render(
      <Accordion type="single" collapsible>
        <AccordionItem value="1">
          <AccordionTrigger>Question</AccordionTrigger>
          <AccordionContent>Answer</AccordionContent>
        </AccordionItem>
      </Accordion>,
    )
    screen.getByRole("button", { name: "Question" })
    await expectNoA11yViolations(container)
  })

  it("RadioGroup items each have an accessible name", async () => {
    const { container } = render(
      <RadioGroup defaultValue="a" aria-label="Choose one">
        <RadioGroupItem value="a" aria-label="Option A" />
        <RadioGroupItem value="b" aria-label="Option B" />
      </RadioGroup>,
    )
    screen.getByRole("radio", { name: "Option A" })
    await expectNoA11yViolations(container)
  })
})
