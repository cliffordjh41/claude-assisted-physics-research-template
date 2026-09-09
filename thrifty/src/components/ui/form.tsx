import type { ComponentProps } from "react"
import * as FormPrimitive from "@radix-ui/react-form"
import { cx } from "../../lib/utils"

const FIELD_BASE = "grid gap-2"
const LABEL_BASE = "text-sm font-(--theme-font-weight) text-foreground"
const MESSAGE_BASE = "text-xs text-alert"

function Form({ ...props }: ComponentProps<typeof FormPrimitive.Root>) {
  return <FormPrimitive.Root {...props} />
}

function FormField({
  className,
  ...props
}: ComponentProps<typeof FormPrimitive.Field>) {
  return (
    <FormPrimitive.Field className={cx(FIELD_BASE, className)} {...props} />
  )
}

function FormLabel({
  className,
  ...props
}: ComponentProps<typeof FormPrimitive.Label>) {
  return (
    <FormPrimitive.Label className={cx(LABEL_BASE, className)} {...props} />
  )
}

function FormControl({
  ...props
}: ComponentProps<typeof FormPrimitive.Control>) {
  return <FormPrimitive.Control {...props} />
}

function FormMessage({
  className,
  ...props
}: ComponentProps<typeof FormPrimitive.Message>) {
  return (
    <FormPrimitive.Message
      className={cx(MESSAGE_BASE, className)}
      {...props}
    />
  )
}

function FormValidityState({
  ...props
}: ComponentProps<typeof FormPrimitive.ValidityState>) {
  return <FormPrimitive.ValidityState {...props} />
}

function FormSubmit({
  ...props
}: ComponentProps<typeof FormPrimitive.Submit>) {
  return <FormPrimitive.Submit {...props} />
}

export {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  FormValidityState,
  FormSubmit,
}
