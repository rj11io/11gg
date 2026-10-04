import type { Publication } from "../../types"
import { monthlyIndex } from "./posts/start-here"
import { releases202609 } from "./posts/2026-09"
import { releases202610 } from "./posts/2026-10"

/** The living guide comes first; articles retain their reference dates and reading order. */
export const monthlyReleases: Publication = {
  relId: 1,
  pubId: "2026-monthly-gaming-releases",
  title: "2026 monthly gaming releases",
  description:
    "The 2026 monthly gaming release calendar: notable releases for the current month, the upcoming month and the past month, including dates that moved.",
  created: "2026-09-30",
  updated: "2026-10-04",
  isNSFW: false,
  isNew: true,
  isFeatured: true,
  isDraft: false,
  tags: ["Releases", "Calendar", "Gaming"],
  sectionId: "gaming",
  synopsis:
    "Start with 2026 gaming releases: start here for the available monthly calendars. The 2026 archive. A release calendar written as a monthly post rather than a database. Every post starts with the current month, looks ahead to the upcoming month, then catches up on the past month, sorted by date, with a note on what mattered and a record of every date that moved. Dates are checked in two sources at the time of writing; the Dates that moved section is what keeps the record honest afterwards.",
  posts: [monthlyIndex, releases202609, releases202610],
}
