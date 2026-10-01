import type { Publication } from "../../types"
import { releases202609 } from "./posts/2026-09"
import { releases202610 } from "./posts/2026-10"

/**
 * One post a month, written by the 11gg monthly releases routine kept in the
 * 11brain knowledge base. Each post covers last month, this month and next
 * month, so the newest post is always the current calendar. Array order is
 * editorial order, oldest first; the listing shows newest first.
 */
export const monthlyReleases: Publication = {
  relId: 1,
  pubId: "monthly-releases",
  title: "Monthly gaming releases",
  description:
    "One post a month: the notable game releases of last month, this month and next month, with the dates that moved.",
  created: "2026-09-02",
  updated: "2026-10-02",
  isNSFW: false,
  isNew: true,
  isFeatured: true,
  isDraft: false,
  tags: ["Releases", "Calendar", "Gaming"],
  sectionId: "gaming",
  synopsis:
    "A release calendar written as a monthly post rather than a database. Every month lists what came out, what is out now and what is dated next, sorted by date, with a note on what mattered and a record of every date that moved. Dates are checked in two sources at the time of writing; the Dates that moved section is what keeps the record honest afterwards.",
  posts: [releases202609, releases202610],
}
