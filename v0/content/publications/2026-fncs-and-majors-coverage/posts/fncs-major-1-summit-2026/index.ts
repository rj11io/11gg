import type { Post } from "../../../../types"
import { postHref } from "../../../../routes"
import rawContent from "./fncs-major-1-summit-2026.md"

export const fncsSummit = {
  postId: 604,
  slug: "fncs-major-1-summit-2026",
  title: "FNCS Summit 2026: Malibuca and Vico win in Düsseldorf",
  excerpt: "The three-day Summit brought 75 Duos to Düsseldorf, crowned Malibuca and Vico, and awarded 15 Global Championship places.",
  created: "2026-05-31",
  updated: "2026-10-03",
  authorIds: ["rj11io"],
  isNSFW: false,
  isNew: false,
  isFeatured: false,
  isDraft: false,
  tags: ["FNCS", "2026", "Summit", "Battle Royale", "Duos"],
  content: rawContent.replaceAll(
    "{{indexHref}}",
    postHref("2026-fncs-and-majors-coverage", { postId: 601, slug: "index" }, ["fortnite", "competitive"]),
  ),
} satisfies Post
