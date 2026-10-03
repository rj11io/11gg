import type { Post } from "../../../../types"

import content from "./update-1-0-3.md"

export const update103 = {
  postId: 202,
  slug: "update-1-0-3",
  title: "Update 1.0.3",
  excerpt:
    "The first patch, two weeks after launch: the day-two bug list fixed, no balance changes, required for online play.",
  created: "2026-04-23",
  authorIds: ["rj11io"],
  isNSFW: false,
  isNew: false,
  isFeatured: false,
  isDraft: false,
  tags: ["Patch", "Version 1.0.3", "Regulation M-A"],
  content,
} satisfies Post
