import type { ComponentProps } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

const TRIGGER_BASE =
  "flex w-fit items-center justify-between gap-2 rounded-lg border border-line bg-transparent px-3 py-2 text-sm whitespace-nowrap outline-none focus-visible:border-foreground disabled:pointer-events-none disabled:opacity-50 data-[placeholder]:text-mute-fg";

const CONTENT_BASE =
  "bg-overlay text-overlay-fg relative z-50 max-h-[--radix-select-content-available-height] min-w-[8rem] overflow-hidden border border-line";

const CONTENT_POPPER_EXTRA = "translate-y-1";

const VIEWPORT_BASE = "p-1";
const VIEWPORT_POPPER_EXTRA =
  "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]";

const LABEL_BASE = "text-mute-fg px-2 py-1.5 text-xs";

const ITEM_BASE =
  "relative flex w-full cursor-default items-center gap-2 py-1.5 pr-8 pl-2 text-sm outline-none select-none focus:bg-mute data-[disabled]:pointer-events-none data-[disabled]:opacity-50";

const SEPARATOR_BASE = "bg-line pointer-events-none -mx-1 my-1 h-px";

const SCROLL_BUTTON_BASE =
  "flex cursor-default items-center justify-center py-1";

function Select({
  ...props
}: ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root {...props} />;
}

function SelectGroup({
  ...props
}: ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group {...props} />;
}

function SelectValue({
  ...props
}: ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value {...props} />;
}

function SelectTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      className={
        className ? `${TRIGGER_BASE} ${className}` : TRIGGER_BASE
      }
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50 shrink-0" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  align = "center",
  ...props
}: ComponentProps<typeof SelectPrimitive.Content>) {
  const content =
    position === "popper"
      ? `${CONTENT_BASE} ${CONTENT_POPPER_EXTRA}`
      : CONTENT_BASE;
  const viewport =
    position === "popper"
      ? `${VIEWPORT_BASE} ${VIEWPORT_POPPER_EXTRA}`
      : VIEWPORT_BASE;
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className={className ? `${content} ${className}` : content}
        position={position}
        align={align}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport className={viewport}>
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      className={className ? `${LABEL_BASE} ${className}` : LABEL_BASE}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={className ? `${ITEM_BASE} ${className}` : ITEM_BASE}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      className={
        className ? `${SEPARATOR_BASE} ${className}` : SEPARATOR_BASE
      }
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      className={
        className ? `${SCROLL_BUTTON_BASE} ${className}` : SCROLL_BUTTON_BASE
      }
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      className={
        className ? `${SCROLL_BUTTON_BASE} ${className}` : SCROLL_BUTTON_BASE
      }
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
