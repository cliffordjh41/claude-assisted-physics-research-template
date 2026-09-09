import { describe, it, afterEach } from "vitest"
import { render, cleanup, screen } from "@testing-library/react"
import { expectNoA11yViolations } from "../../test/a11y"
import { Form, FormField, FormLabel, FormControl } from "./form"
import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription } from "./toast"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./select"
import {
  OneTimePasswordField,
  OneTimePasswordFieldInput,
  OneTimePasswordFieldHiddenInput,
} from "./otp-field"

afterEach(cleanup)

describe("forms + remaining overlays a11y", () => {
  it("Form field associates label and control", async () => {
    const { container } = render(
      <Form>
        <FormField name="email">
          <FormLabel>Email</FormLabel>
          <FormControl type="email" />
        </FormField>
      </Form>,
    )
    screen.getByLabelText("Email")
    await expectNoA11yViolations(container)
  })

  it("Toast announces with title + description", async () => {
    render(
      <ToastProvider>
        <Toast open>
          <ToastTitle>Saved</ToastTitle>
          <ToastDescription>Your changes were saved.</ToastDescription>
        </Toast>
        <ToastViewport />
      </ToastProvider>,
    )
    await expectNoA11yViolations(document.body)
  })

  it("Select trigger is a named combobox (closed)", async () => {
    const { container } = render(
      <Select>
        <SelectTrigger aria-label="Fruit">
          <SelectValue placeholder="Pick one" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectContent>
      </Select>,
    )
    screen.getByRole("combobox", { name: "Fruit" })
    await expectNoA11yViolations(container)
  })

  it("OneTimePasswordField inputs are labelled", async () => {
    const { container } = render(
      <OneTimePasswordField aria-label="One-time code" autoComplete="one-time-code">
        <OneTimePasswordFieldInput aria-label="Digit 1" />
        <OneTimePasswordFieldInput aria-label="Digit 2" />
        <OneTimePasswordFieldInput aria-label="Digit 3" />
        <OneTimePasswordFieldHiddenInput />
      </OneTimePasswordField>,
    )
    await expectNoA11yViolations(container)
  })
})
