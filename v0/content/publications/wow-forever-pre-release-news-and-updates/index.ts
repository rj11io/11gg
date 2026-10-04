import type { Publication } from "../../types"
import { foreverIndex } from "./posts/start-here"
import { announced } from "./posts/announced-at-blizzcon-2026"
import { upgrades } from "./posts/upgrades-and-collections"
import { beta } from "./posts/beta-is-live"
import { roadToLaunch } from "./posts/road-to-launch"
import { dwarfChanges } from "./posts/dwarf-changes-from-classic"
import { undeadChanges } from "./posts/undead-changes-from-classic"
import { druidChanges } from "./posts/druid-changes-from-classic"
import { hunterChanges } from "./posts/hunter-changes-from-classic"
import { paladinChanges } from "./posts/paladin-changes-from-classic"
import { priestChanges } from "./posts/priest-changes-from-classic"
import { warriorChanges } from "./posts/warrior-changes-from-classic"

/** The living guide comes first; articles retain their reference dates and reading order. */
export const wowForever: Publication = {
  relId: 3,
  pubId: "wow-forever-pre-release-news-and-updates",
  title: "WoW Forever pre-release news and updates",
  description:
    "WoW Forever pre-release news and updates, from the BlizzCon 2026 announcement to the planned 4 November launch, one post per news item.",
  created: "2026-09-10",
  updated: "2026-10-04",
  isNSFW: false,
  isNew: true,
  isFeatured: true,
  isDraft: false,
  tags: ["World of Warcraft", "WoW Forever", "Classic"],
  synopsis:
    "Start with WoW Forever: start here for the pre-release reading guide. The pre-release record. Blizzard announced World of Warcraft: Forever on 12 September 2026 as a third branch next to modern WoW and Classic: the original Azeroth kept at level 60 and grown sideways. This publication follows it in order, announcement, upgrades, beta, and the dates to launch, with the official sources behind each post.",
  sectionId: "wow-forever",
  posts: [
    foreverIndex,
    announced,
    upgrades,
    beta,
    roadToLaunch,
    dwarfChanges,
    undeadChanges,
    druidChanges,
    hunterChanges,
    paladinChanges,
    priestChanges,
    warriorChanges,
  ],
}
