import type { Publication } from "../../types"
import { releases202609 } from "./posts/2026-09"
import { releases202610 } from "./posts/2026-10"

/**
 * One post per month of 2026, written by the 11gg monthly releases routine kept in the
 * 11brain 11portfolio routines folder. Each post covers the current month, the upcoming month and the past
 * month, so the newest post is always the current calendar. Array order is
 * editorial order, oldest first; the listing shows newest first.
 */
export const monthlyReleases: Publication = {
  relId: 1,
  pubId: "2026-monthly-gaming-releases",
  title: "2026 monthly gaming releases",
  description:
    "The 2026 monthly gaming release calendar: notable releases for the current month, the upcoming month and the past month, including dates that moved.",
  created: "2026-09-02",
  updated: "2026-10-03",
  isNSFW: false,
  isNew: true,
  isFeatured: true,
  isDraft: false,
  tags: ["Releases", "Calendar", "Gaming"],
  sectionId: "gaming",
  synopsis:
    "The 2026 archive. A release calendar written as a monthly post rather than a database. Every post starts with the current month, looks ahead to the upcoming month, then catches up on the past month, sorted by date, with a note on what mattered and a record of every date that moved. Dates are checked in two sources at the time of writing; the Dates that moved section is what keeps the record honest afterwards.",
  posts: [releases202609, releases202610],
}
