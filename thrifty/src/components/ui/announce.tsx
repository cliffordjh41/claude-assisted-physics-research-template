import type { ComponentProps } from "react"
import * as AnnouncePrimitive from "@radix-ui/react-announce"

function Announce({ ...props }: ComponentProps<typeof AnnouncePrimitive.Root>) {
  return <AnnouncePrimitive.Root {...props} />
}

export { Announce }
