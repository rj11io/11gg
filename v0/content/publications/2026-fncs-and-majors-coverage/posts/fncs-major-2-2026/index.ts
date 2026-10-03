import type { Post } from "../../../../types"
import { postHref } from "../../../../routes"
import rawContent from "./fncs-major-2-2026.md"

export const fncsMajor2 = {
  postId: 605,
  slug: "fncs-major-2-2026",
  title: "FNCS Major 2 2026: the summer route to Global",
  excerpt: "The summer Major awarded 25 Global Championship places, with Europe and NA Central Finals led by 732 and 617-point Duos.",
  created: "2026-08-02",
  updated: "2026-10-03",
  authorIds: ["rj11io"],
  isNSFW: false,
  isNew: false,
  isFeatured: false,
  isDraft: false,
  tags: ["FNCS", "2026", "Major 2", "Battle Royale", "Duos"],
  content: rawContent.replaceAll(
    "{{indexHref}}",
    postHref("2026-fncs-and-majors-coverage", { postId: 601, slug: "index" }, ["fortnite", "competitive"]),
  ),
} satisfies Post
