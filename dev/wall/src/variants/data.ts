import { Bell, Bookmark, Compass, Home, Mail, User } from "lucide-react"

export const nav = [
  { icon: Home, label: "Home" },
  { icon: Compass, label: "Explore" },
  { icon: Bell, label: "Notifications", count: 12 },
  { icon: Mail, label: "Messages" },
  { icon: Bookmark, label: "Bookmarks" },
  { icon: User, label: "Profile" },
]

// Worst-case content on purpose: long names, long posts, big numbers.
export type Post = {
  name: string
  handle: string
  time: string
  text: string
  replies: number
  reposts: number
  likes: number
  verified?: boolean
  image?: boolean
}

export const posts: Post[] = [
  {
    name: "Alexandria Okonkwo-Fitzgerald-Montgomery III",
    handle: "alexandria_okonkwo_fitzgerald",
    time: "2m",
    text: "Shipping the new onboarding today. Took three rewrites, one week of arguing about a single button label, and a design review where we killed nine of ten directions in eleven minutes.",
    replies: 48,
    reposts: 212,
    likes: 1893,
    verified: true,
  },
  {
    name: "Sam",
    handle: "s",
    time: "14m",
    text: "ok",
    replies: 0,
    reposts: 0,
    likes: 3,
  },
  {
    name: "Design Systems Weekly",
    handle: "dsweekly",
    time: "1h",
    text: "The best component library is the one your team actually uses. Thread on how we cut ours from 140 components to 31 👇",
    replies: 302,
    reposts: 4120,
    likes: 28411,
    image: true,
  },
  {
    name: "Priya Raman",
    handle: "priyaraman",
    time: "3h",
    text: "Hot take: most dashboards should be a sentence. \"Revenue is up 4% and nothing is on fire.\" Done. Close the tab.",
    replies: 91,
    reposts: 640,
    likes: 7102,
    verified: true,
  },
  {
    name: "Jordan Lee",
    handle: "jlee",
    time: "5h",
    text: "https://example.com/a/really/long/url/that/never/ends/and/should/wrap/instead/of/blowing/out/the/layout/of/the/whole/column",
    replies: 2,
    reposts: 1,
    likes: 19,
  },
  {
    name: "Mia Chen",
    handle: "miachen",
    time: "6h",
    text: "Moodboard for the spring launch. We're going quieter this time.",
    replies: 12,
    reposts: 40,
    likes: 512,
    image: true,
  },
  {
    name: "Launch Radar Daily Digest of Everything New",
    handle: "launchradar",
    time: "8h",
    text: "Top launches today: a calendar that says no for you, a CRM with one field, and yet another AI notes app.",
    replies: 66,
    reposts: 301,
    likes: 2240,
  },
  {
    name: "Theo",
    handle: "theo_builds",
    time: "1d",
    text: "Deleted 4,000 lines today. Best commit of the year.",
    replies: 203,
    reposts: 1500,
    likes: 19800,
    verified: true,
  },
]

export const trends = [
  { topic: "Technology", name: "#DesignEngineering", posts: "18.2K" },
  { topic: "Fashion", name: "Spring collections", posts: "52.9K" },
  { topic: "Business", name: "Q4 earnings", posts: "9,104" },
  { topic: "Sports", name: "Cup final", posts: "211K" },
]

export const follows = [
  { name: "Grace Okafor", handle: "graceo" },
  { name: "Canvas Community Updates & Announcements", handle: "canvascommunity" },
  { name: "Rune", handle: "rune_builds" },
]

export const fmt = (n: number) =>
  Intl.NumberFormat("en", { notation: "compact" }).format(n)

export const initials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")

