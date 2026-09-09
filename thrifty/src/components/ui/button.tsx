import type { ComponentProps } from "react";
import { Slot } from "@radix-ui/react-slot";

const BASE =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-(--theme-font-weight) disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-foreground aria-invalid:border-alert";

type Variant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";

type Size = "default" | "sm" | "lg" | "icon" | "icon-sm";

const VARIANTS: Record<Variant, string> = {
  default: "bg-action text-action-fg hover:bg-action/90",
  destructive: "bg-alert text-alert-fg hover:bg-alert/90",
  outline:
    "border border-line bg-background hover:bg-mute hover:text-foreground",
  secondary: "bg-subdued text-subdued-fg hover:bg-subdued/80",
  ghost: "hover:bg-mute hover:text-foreground",
  link: "text-action underline-offset-4 hover:underline",
};

const SIZES: Record<Size, string> = {
  default: "h-9 px-4 py-2",
  sm: "h-8 px-3 text-xs",
  lg: "h-10 px-6",
  icon: "size-9",
  "icon-sm": "size-8",
};

export function buttonVariants({
  variant = "default",
  size = "default",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
} = {}): string {
  const base = `${BASE} ${VARIANTS[variant]} ${SIZES[size]}`;
  return className ? `${base} ${className}` : base;
}

type ButtonProps = ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
};

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  );
}

export { Button };
