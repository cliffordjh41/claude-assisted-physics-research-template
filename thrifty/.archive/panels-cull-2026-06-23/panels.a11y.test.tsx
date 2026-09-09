import type { ReactNode } from "react"
import { describe, it, afterEach } from "vitest"
import { render, cleanup } from "@testing-library/react"
import { expectNoA11yViolations } from "../../test/a11y"
import { AnnouncePanel } from "./AnnouncePanel"
import { AttributionsPanel } from "./AttributionsPanel"
import { BusinessCardPanel } from "./BusinessCardPanel"
import { DepthPanel } from "./DepthPanel"
import { FeedPanel } from "./FeedPanel"
import { GatePanel } from "./GatePanel"
import { MarqueePanel } from "./MarqueePanel"
import { MessagesPanel } from "./MessagesPanel"
import { ProductPortalPanel } from "./ProductPortalPanel"
import { WalletPanel } from "./WalletPanel"
import { AIChatPanel } from "./AIChatPanel"
import { CalendarPanel } from "./CalendarPanel"
import { JournalPanel } from "./JournalPanel"
import { LibraryPanel } from "./LibraryPanel"
import { CircleOfFifthsPanel } from "./CircleOfFifthsPanel"

afterEach(cleanup)

// Presentational panels rendered with their default config (panelData omitted).
// MusicPlayer (AudioContext) and PdfReader (`?url` worker) are excluded — they
// need a real browser. Color contrast is browser-only too.
const cases: Array<[string, ReactNode]> = [
  ["AnnouncePanel", <AnnouncePanel />],
  ["AttributionsPanel", <AttributionsPanel />],
  ["BusinessCardPanel", <BusinessCardPanel />],
  ["DepthPanel", <DepthPanel />],
  ["FeedPanel", <FeedPanel />],
  ["GatePanel", <GatePanel />],
  ["MarqueePanel", <MarqueePanel />],
  ["MessagesPanel", <MessagesPanel />],
  ["ProductPortalPanel", <ProductPortalPanel />],
  ["WalletPanel", <WalletPanel />],
  ["AIChatPanel", <AIChatPanel />],
  ["CalendarPanel", <CalendarPanel />],
  ["JournalPanel", <JournalPanel />],
  ["LibraryPanel", <LibraryPanel />],
  ["CircleOfFifthsPanel", <CircleOfFifthsPanel />],
]

describe("panel a11y", () => {
  for (const [name, element] of cases) {
    it(`${name} has no axe violations`, async () => {
      const { container } = render(element)
      await expectNoA11yViolations(container)
    })
  }
})
