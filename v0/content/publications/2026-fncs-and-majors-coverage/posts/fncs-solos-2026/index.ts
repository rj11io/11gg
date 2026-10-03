import type { Post } from "../../../../types"
import { postHref } from "../../../../routes"
import rawContent from "./fncs-solos-2026.md"

export const fncsSolos = {
  postId: 608,
  slug: "fncs-solos-2026",
  title: "FNCS Solos 2026: the October schedule and route to Finals",
  excerpt: "The standalone regional Solos event is ongoing. Qualifiers, Fast Track, Heats and Last Chance lead to Finals scheduled for October 26-27.",
  created: "2026-08-31",
  updated: "2026-10-03",
  authorIds: ["rj11io"],
  isNSFW: false,
  isNew: false,
  isFeatured: false,
  isDraft: false,
  tags: ["FNCS", "2026", "Solos", "Battle Royale", "Guide"],
  content: rawContent.replaceAll(
    "{{indexHref}}",
    postHref("2026-fncs-and-majors-coverage", { postId: 601, slug: "index" }, ["fortnite", "competitive"]),
  ),
} satisfies Post
