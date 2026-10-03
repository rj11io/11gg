import type { Post } from "../../../../types"
import { postHref } from "../../../../routes"
import rawContent from "./fncs-major-1-second-chance-2026.md"

export const fncsSecondChance = {
  postId: 603,
  slug: "fncs-major-1-second-chance-2026",
  title: "FNCS Second Chance 2026: another route to Summit",
  excerpt: "A separate six-match regional final sent 25 more Duos to Summit's Lower stage after Major 1.",
  created: "2026-04-29",
  updated: "2026-10-03",
  authorIds: ["rj11io"],
  isNSFW: false,
  isNew: false,
  isFeatured: false,
  isDraft: false,
  tags: ["FNCS", "2026", "Second Chance", "Battle Royale", "Duos"],
  content: rawContent.replaceAll(
    "{{indexHref}}",
    postHref("2026-fncs-and-majors-coverage", { postId: 601, slug: "index" }, ["fortnite", "competitive"]),
  ),
} satisfies Post
