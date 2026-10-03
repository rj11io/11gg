import type { Post } from "../../../../types"
import { postHref } from "../../../../routes"
import rawContent from "./fncs-global-last-chance-2026.md"

export const fncsLastChance = {
  postId: 606,
  slug: "fncs-global-last-chance-2026",
  title: "FNCS Global Last Chance 2026: the final ten Global places",
  excerpt: "August's separate Last Chance event completed the Global field; checked EU and NA Central Finals ended on 351 and 349 points.",
  created: "2026-08-14",
  updated: "2026-10-03",
  authorIds: ["rj11io"],
  isNSFW: false,
  isNew: false,
  isFeatured: false,
  isDraft: false,
  tags: ["FNCS", "2026", "Last Chance", "Battle Royale", "Duos"],
  content: rawContent.replaceAll(
    "{{indexHref}}",
    postHref("2026-fncs-and-majors-coverage", { postId: 601, slug: "index" }, ["fortnite", "competitive"]),
  ),
} satisfies Post
