import type { Publication } from "../../types"
import { announced } from "./posts/announced-at-blizzcon-2026"
import { upgrades } from "./posts/upgrades-and-collections"
import { beta } from "./posts/beta-is-live"
import { roadToLaunch } from "./posts/road-to-launch"

/**
 * World of Warcraft: Forever, announced at BlizzCon 2026, followed one news
 * item per post from the announcement to launch. The created date of each
 * post is the date of the news it covers. Array order is editorial order,
 * oldest first.
 *
 * The publication title identifies its pre-release coverage scope.
 */
export const wowForever: Publication = {
  relId: 3,
  pubId: "wow-forever-pre-release-news-and-updates",
  title: "WoW Forever pre-release news and updates",
  description:
    "WoW Forever pre-release news and updates, from the BlizzCon 2026 announcement to the planned 4 November launch, one post per news item.",
  created: "2026-09-12",
  updated: "2026-10-03",
  isNSFW: false,
  isNew: true,
  isFeatured: true,
  isDraft: false,
  tags: ["World of Warcraft", "WoW Forever", "Classic"],
  synopsis:
    "The pre-release record. Blizzard announced World of Warcraft: Forever on 12 September 2026 as a third branch next to modern WoW and Classic: the original Azeroth kept at level 60 and grown sideways. This publication follows it in order, announcement, upgrades, beta, and the dates to launch, with the official sources behind each post.",
  sectionId: "wow-forever",
  posts: [announced, upgrades, beta, roadToLaunch],
}
