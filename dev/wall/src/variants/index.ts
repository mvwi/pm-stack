import type { ComponentType } from "react"
import Console from "./console"
import Contact from "./contact"
import Digest from "./digest"
import Feed from "./feed"
import Ledger from "./ledger"
import Mixer from "./mixer"
import Sheet from "./sheet"
import Single from "./single"
import Timeline from "./timeline"
import TCard from "../tickets/card"
import TChat from "../tickets/chat"
import TCues from "../tickets/cues"
import TScript from "../tickets/script"
import TSpot from "../tickets/spot"
import TWalk from "../tickets/walk"

// Names, axes and rounds live in public/wall/wall.json; this only maps ids to components.
// Nine in reading order for a 3×3 wall, with the baseline in the center cell.
export const variants: { id: string; Component: ComponentType }[] = [
  { id: "sheet", Component: Sheet },
  { id: "ledger", Component: Ledger },
  { id: "console", Component: Console },
  { id: "timeline", Component: Timeline },
  { id: "feed", Component: Feed },
  { id: "contact", Component: Contact },
  { id: "single", Component: Single },
  { id: "mixer", Component: Mixer },
  { id: "digest", Component: Digest },
  // Ticket training wall: /wall/wall.html?manifest=tickets.json
  { id: "t-script", Component: TScript },
  { id: "t-card", Component: TCard },
  { id: "t-spot", Component: TSpot },
  { id: "t-chat", Component: TChat },
  { id: "t-walk", Component: TWalk },
  { id: "t-cues", Component: TCues },
]
