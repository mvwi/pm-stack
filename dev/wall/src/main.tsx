import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { variants } from "./variants"

// /?v=<id> renders one variant; the wall is public/wall/wall.html, driven by public/wall/wall.json.
const variant = variants.find((v) => v.id === new URLSearchParams(location.search).get("v"))

if (!variant) location.replace("/wall/wall.html")
else {
  document.title = `wall · ${variant.id}`
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <variant.Component />
    </StrictMode>,
  )
}
