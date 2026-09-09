import type { ComponentProps } from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

const BASE =
  "peer border-field data-[state=checked]:bg-action data-[state=checked]:text-action-fg data-[state=checked]:border-action focus-visible:border-foreground aria-invalid:border-alert size-4 shrink-0 rounded-lg border shadow-xs transition-shadow outline-none disabled:cursor-not-allowed disabled:opacity-50";

function Checkbox({
  className,
  ...props
}: ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root

      className={className ? `${BASE} ${className}` : BASE}
      {...props}
    >
      <CheckboxPrimitive.Indicator

        className="grid place-content-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
