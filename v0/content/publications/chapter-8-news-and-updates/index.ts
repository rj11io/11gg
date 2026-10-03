import type { Publication } from "../../types"
import { chapter8Index } from "./posts/start-here"
import { chapter8Rumors } from "./posts/chapter-8-leaks-and-rumors"

export const chapter8News: Publication = {
  relId: 7,
  pubId: "chapter-8-news-and-updates",
  title: "Chapter 8 news and updates",
  description:
    "Fortnite Chapter 8 reporting, with dated sources and a clear distinction between announcements, leaks and speculation.",
  created: "2026-01-03",
  updated: "2026-10-03",
  isNSFW: false,
  isNew: true,
  isFeatured: false,
  isDraft: false,
  tags: ["Fortnite", "News", "Chapter 8"],
  sectionId: "fortnite",
  synopsis:
    "Start with the publication index, then read the dated reports. Official announcements and unconfirmed claims are identified separately; the index grows as coverage becomes available.",
  editorNotes:
    "Created two days before the January 5 reference date of the earliest article. Coverage was backfilled on October 3, 2026. The index stays first in reading order with its actual creation date.",
  posts: [chapter8Index, chapter8Rumors],
}
