import type { ComponentProps } from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { VisuallyHidden } from "./visually-hidden";

const OVERLAY_BASE =
  "data-[state=open]:animate-overlay-show data-[state=closed]:animate-overlay-hide fixed inset-0 z-50 bg-scrim/50 backdrop-blur-sm";

// No baked-in `gap-*` — consumers add their own gap where needed.
// The previous gap-4 added invisible 16px spacers between
// SheetHeader / body / footer siblings in every consumer.
const CONTENT_BASE =
  "bg-background fixed z-50 flex flex-col shadow-lg";

type Side = "top" | "right" | "bottom" | "left";

const SIDES: Record<Side, string> = {
  right:
    "data-[state=open]:animate-slide-in-right data-[state=closed]:animate-slide-out-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
  left: "data-[state=open]:animate-slide-in-left data-[state=closed]:animate-slide-out-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
  top: "data-[state=open]:animate-slide-in-top data-[state=closed]:animate-slide-out-top inset-x-0 top-0 border-b",
  bottom:
    "data-[state=open]:animate-slide-in-bottom data-[state=closed]:animate-slide-out-bottom inset-x-0 bottom-0 border-t",
};

const CLOSE_BUTTON =
  "data-[state=open]:bg-subdued absolute top-4 right-4 rounded-lg opacity-70 transition-opacity hover:opacity-100 focus:outline-hidden disabled:pointer-events-none";

const HEADER_BASE = "flex flex-col gap-1.5 p-4";
const FOOTER_BASE = "mt-auto flex flex-col gap-2 p-4";
const TITLE_BASE = "text-foreground text-balance font-(--theme-font-weight)";
const DESCRIPTION_BASE = "text-mute-fg text-sm";

function Sheet({ ...props }: ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root {...props} />;
}

function SheetTrigger({
  ...props
}: ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger {...props} />;
}

function SheetClose({
  ...props
}: ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close {...props} />;
}

function SheetPortal({
  ...props
}: ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal {...props} />;
}

function SheetOverlay({
  className,
  ...props
}: ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay

      className={className ? `${OVERLAY_BASE} ${className}` : OVERLAY_BASE}
      {...props}
    />
  );
}

type SheetContentProps = ComponentProps<typeof SheetPrimitive.Content> & {
  side?: Side;
  showCloseButton?: boolean;
  // Render the dimming overlay layer. Modal-style sheets keep this
  // true (default) to focus attention. Casual / non-blocking sheets
  // (a non-modal mobile sheet with `modal={false}`) pass false so
  // the page behind stays fully visible.
  showOverlay?: boolean;
};

function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  showOverlay = true,
  ...props
}: SheetContentProps) {
  const base = `${CONTENT_BASE} ${SIDES[side]}`;
  return (
    <SheetPortal>
      {showOverlay && <SheetOverlay />}
      <SheetPrimitive.Content

        className={className ? `${base} ${className}` : base}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close className={CLOSE_BUTTON}>
            <XIcon className="size-4" />
            <VisuallyHidden>Close</VisuallyHidden>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div

      className={className ? `${HEADER_BASE} ${className}` : HEADER_BASE}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div

      className={className ? `${FOOTER_BASE} ${className}` : FOOTER_BASE}
      {...props}
    />
  );
}

function SheetTitle({
  className,
  ...props
}: ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title

      className={className ? `${TITLE_BASE} ${className}` : TITLE_BASE}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description

      className={
        className ? `${DESCRIPTION_BASE} ${className}` : DESCRIPTION_BASE
      }
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
