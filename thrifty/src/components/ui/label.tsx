import type { ComponentProps } from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

const BASE =
  "flex items-center gap-2 text-sm leading-none font-(--theme-font-weight) select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50";

function Label({
  className,
  ...props
}: ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root

      className={className ? `${BASE} ${className}` : BASE}
      {...props}
    />
  );
}

export { Label };
