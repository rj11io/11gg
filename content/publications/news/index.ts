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
 * Naming: the title names the game as a reference, the way a news desk names
 * its subject. No credit line on posts since 2026-10-01: a disclaimer is added
 * per page, only where a reader could mistake a post for the publisher's.
 * Whether the title stays is the operator's call.
 */
export const wowForever: Publication = {
  relId: 3,
  pubId: "news",
  title: "World of Warcraft: Forever",
  description:
    "World of Warcraft: Forever, the permanent Classic branch, from its BlizzCon 2026 announcement to its 4 November launch, one post per news item.",
  created: "2026-09-12",
  updated: "2026-10-02",
  isNSFW: false,
  isNew: true,
  isFeatured: true,
  isDraft: false,
  tags: ["World of Warcraft", "WoW Forever", "Classic"],
  synopsis:
    "Blizzard announced World of Warcraft: Forever on 12 September 2026 as a third branch next to modern WoW and Classic: the original Azeroth kept at level 60 and grown sideways. This publication follows it in order, announcement, upgrades, beta, and the dates to launch, with the official sources behind each post.",
  sectionId: "wow-forever",
  posts: [announced, upgrades, beta, roadToLaunch],
}
