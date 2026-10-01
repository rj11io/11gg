import type { Post } from "../../../../types"

import content from "./beta-is-live.md"

export const beta = {
  postId: 403,
  slug: "beta-is-live",
  title: "The beta is live",
  excerpt:
    "The World of Warcraft: Forever beta opened on 17 September and runs to 21 October: who is in, what is testable, and the Server Slam still to be dated.",
  created: "2026-09-17",
  authorIds: ["rj11io"],
  isNSFW: false,
  isNew: false,
  isFeatured: false,
  isDraft: false,
  tags: ["Beta"],
  content,
} satisfies Post
