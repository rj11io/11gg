import type { Post } from "../../../../types"
import { postHref } from "../../../../routes"
import rawContent from "./fncs-global-championship-2026.md"

export const fncsGlobal = {
  postId: 607,
  slug: "fncs-global-championship-2026",
  title: "FNCS Global Championship 2026: Pixie and SwizzY win by two points",
  excerpt: "The Antwerp final ended 525, 523 and 521 at the top, with Pixie and SwizzY taking the 2026 Duos championship.",
  created: "2026-09-27",
  updated: "2026-10-03",
  authorIds: ["rj11io"],
  isNSFW: false,
  isNew: false,
  isFeatured: false,
  isDraft: false,
  tags: ["FNCS", "2026", "Global Championship", "Battle Royale", "Duos"],
  content: rawContent.replaceAll(
    "{{indexHref}}",
    postHref("2026-fncs-and-majors-coverage", { postId: 601, slug: "index" }, ["fortnite", "competitive"]),
  ),
} satisfies Post
