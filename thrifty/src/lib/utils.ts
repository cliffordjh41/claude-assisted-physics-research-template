// Class-string join. Replaces the prior shadcn-pattern
// `cn = twMerge(clsx(...))` helper at both name and dependency
// levels. No external deps; no Tailwind-conflict deduplication.
// Accepts strings and falsy values (false / null / undefined);
// concatenates the truthy strings with single spaces between.
//
// Tailwind conflict resolution (e.g., when a base class string
// and a caller's className both specify a height) is the
// consumer's responsibility — pass classes in last-wins order.

export type ClassValue = string | false | null | undefined;

export function cx(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(" ");
}
