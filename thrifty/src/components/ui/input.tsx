import type { ComponentProps } from "react";

const BASE =
  "h-9 w-full min-w-0 rounded-lg border border-line bg-transparent px-3 py-1 text-sm placeholder:text-mute-fg outline-none focus-visible:border-foreground disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-alert";

function Input({ className, type, ...props }: ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={className ? `${BASE} ${className}` : BASE}
      {...props}
    />
  );
}

export { Input };
