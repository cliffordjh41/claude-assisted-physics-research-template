import type { ComponentProps } from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";

const GROUP_BASE = "flex items-center";

const ITEM_BASE =
  "flex-1 px-3 py-1.5 text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) transition-colors " +
  "text-mute-fg hover:text-foreground " +
  "border border-line " +
  "first:rounded-lg last:rounded-lg " +
  "-ml-px first:ml-0 " +
  "data-[state=on]:bg-foreground data-[state=on]:text-background data-[state=on]:border-foreground " +
  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus";

function ToggleGroup({
  className,
  ...props
}: ComponentProps<typeof ToggleGroupPrimitive.Root>) {
  return (
    <ToggleGroupPrimitive.Root
      className={className ? `${GROUP_BASE} ${className}` : GROUP_BASE}
      {...props}
    />
  );
}

function ToggleGroupItem({
  className,
  children,
  ...props
}: ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  return (
    <ToggleGroupPrimitive.Item
      className={className ? `${ITEM_BASE} ${className}` : ITEM_BASE}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
}

export { ToggleGroup, ToggleGroupItem };
