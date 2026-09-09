import type { ComponentProps } from "react";

const BASE =
  "field-sizing-content min-h-16 w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm placeholder:text-mute-fg outline-none focus-visible:border-foreground disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-alert";

function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={className ? `${BASE} ${className}` : BASE}
      {...props}
    />
  );
}

export { Textarea };
