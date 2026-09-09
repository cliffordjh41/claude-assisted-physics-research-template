import type { ComponentProps } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { VisuallyHidden } from "./visually-hidden";

const OVERLAY_BASE =
  "data-[state=open]:animate-overlay-show data-[state=closed]:animate-overlay-hide fixed inset-0 z-50 bg-scrim/50 backdrop-blur-sm";

const CONTENT_BASE =
  "bg-background data-[state=open]:animate-content-show data-[state=closed]:animate-content-hide fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] max-h-[calc(100dvh-2rem)] overflow-auto translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg sm:max-w-lg";

const CLOSE_BUTTON =
  "data-[state=open]:bg-highlight data-[state=open]:text-mute-fg absolute top-4 right-4 rounded-lg opacity-70 transition-opacity hover:opacity-100 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";

const HEADER_BASE = "flex flex-col gap-2 text-center sm:text-left";
const FOOTER_BASE = "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end";
const TITLE_BASE = "text-lg leading-none text-balance font-(--theme-font-weight)";
const DESCRIPTION_BASE = "text-mute-fg text-sm";

function Dialog({
  ...props
}: ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root {...props} />;
}

function DialogTrigger({
  ...props
}: ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger {...props} />;
}

function DialogPortal({
  ...props
}: ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal {...props} />;
}

function DialogClose({
  ...props
}: ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay

      className={className ? `${OVERLAY_BASE} ${className}` : OVERLAY_BASE}
      {...props}
    />
  );
}

type DialogContentProps = ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
};

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content

        className={className ? `${CONTENT_BASE} ${className}` : CONTENT_BASE}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close

            className={CLOSE_BUTTON}
          >
            <XIcon />
            <VisuallyHidden>Close</VisuallyHidden>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div

      className={className ? `${HEADER_BASE} ${className}` : HEADER_BASE}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div

      className={className ? `${FOOTER_BASE} ${className}` : FOOTER_BASE}
      {...props}
    />
  );
}

function DialogTitle({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title

      className={className ? `${TITLE_BASE} ${className}` : TITLE_BASE}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description

      className={
        className ? `${DESCRIPTION_BASE} ${className}` : DESCRIPTION_BASE
      }
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
