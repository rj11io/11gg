import type { Post } from "../../../../types"

import content from "./road-to-launch.md"

export const roadToLaunch = {
  postId: 404,
  slug: "road-to-launch",
  title: "The road to 4 November",
  excerpt:
    "Every date Blizzard has given for World of Warcraft: Forever, from the announcement to launch, and what is still unknown.",
  created: "2026-09-12",
  updated: "2026-10-04",
  authorIds: ["rj11io"],
  isNSFW: false,
  isNew: true,
  isFeatured: true,
  isDraft: false,
  tags: ["Launch", "Dates"],
  content,
} satisfies Post
