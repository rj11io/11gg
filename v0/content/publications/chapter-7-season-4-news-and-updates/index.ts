import type { Publication } from "../../types"
import { v4200 } from "./posts/v42-00-override"
import { v4210 } from "./posts/v42-10-override-week-1"
import { v4220 } from "./posts/v42-20-override-week-2"
import { v4230 } from "./posts/v42-30-fortnitemares-2026"

/**
 * One post per major update of Chapter 7 Season 4, Override, in release order.
 * The created date of each post is the update's date, so the listing reads as
 * the season's history. Array order is editorial order, oldest first.
 */
export const chapter7Season4: Publication = {
  relId: 2,
  pubId: "chapter-7-season-4-news-and-updates",
  title: "Chapter 7: Season 4 news and updates",
  description:
    "News and updates from Fortnite's Chapter 7: Season 4, Override: the map, Sprites, collaborations and changes in each major patch.",
  created: "2026-08-20",
  updated: "2026-10-03",
  isNSFW: false,
  isNew: true,
  isFeatured: true,
  isDraft: false,
  tags: ["Fortnite", "Chapter 7", "Season 4", "Updates"],
  synopsis:
    "News and updates in release order. Chapter 7 Season 4 ran from 20 August 2026 under the name Override. This publication follows it update by update: the launch, the two Override Week updates, and Fortnitemares, with the weapons, Sprites, Overrides and collaborations each one brought. Every post links the official update notes it was written from.",
  sectionId: "fortnite",
  posts: [v4200, v4210, v4220, v4230],
}
