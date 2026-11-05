import type { ComponentType } from "react"
import Chat from "./chat"
import Dense from "./dense"
import Editorial from "./editorial"
import Feed from "./feed"
import Focus from "./focus"
import Grid from "./grid"
import Split from "./split"
import Terminal from "./terminal"

// Names, axes and rounds live in public/wall/wall.json; this only maps ids to components.
export const variants: { id: string; Component: ComponentType }[] = [
  { id: "feed", Component: Feed },
  { id: "focus", Component: Focus },
  { id: "dense", Component: Dense },
  { id: "editorial", Component: Editorial },
  { id: "split", Component: Split },
  { id: "grid", Component: Grid },
  { id: "terminal", Component: Terminal },
  { id: "chat", Component: Chat },
]
