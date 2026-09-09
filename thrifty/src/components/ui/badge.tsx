import type { ComponentProps } from "react";
import { Slot } from "@radix-ui/react-slot";

const BASE =
  "inline-flex items-center justify-center rounded-lg border px-2 py-0.5 text-xs font-(--theme-font-weight) w-fit whitespace-nowrap shrink-0";

type Variant = "default" | "secondary" | "destructive" | "outline";

const VARIANTS: Record<Variant, string> = {
  default: "border-transparent bg-action text-action-fg",
  secondary: "border-transparent bg-subdued text-subdued-fg",
  destructive: "border-transparent bg-alert text-alert-fg",
  outline: "border-line text-foreground",
};

export function badgeVariants({
  variant = "default",
}: { variant?: Variant } = {}): string {
  return `${BASE} ${VARIANTS[variant]}`;
}

type BadgeProps = ComponentProps<"span"> & {
  variant?: Variant;
  asChild?: boolean;
};

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span";
  const classes = badgeVariants({ variant });
  return (
    <Comp
      className={className ? `${classes} ${className}` : classes}
      {...props}
    />
  );
}

export { Badge };
