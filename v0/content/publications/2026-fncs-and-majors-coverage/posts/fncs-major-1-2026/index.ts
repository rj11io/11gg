import type { Post } from "../../../../types"
import { postHref } from "../../../../routes"
import rawContent from "./fncs-major-1-2026.md"

export const fncsMajor1 = {
  postId: 602,
  slug: "fncs-major-1-2026",
  title: "FNCS Major 1 2026: the route to Summit",
  excerpt: "April's regional Duos circuit sent 50 teams to the Summit Upper stage; checked EU and NA Central Finals ended on 738 and 727 points.",
  created: "2026-04-26",
  updated: "2026-10-03",
  authorIds: ["rj11io"],
  isNSFW: false,
  isNew: false,
  isFeatured: false,
  isDraft: false,
  tags: ["FNCS", "2026", "Major 1", "Battle Royale", "Duos"],
  content: rawContent.replaceAll(
    "{{indexHref}}",
    postHref("2026-fncs-and-majors-coverage", { postId: 601, slug: "index" }, ["fortnite", "competitive"]),
  ),
} satisfies Post
