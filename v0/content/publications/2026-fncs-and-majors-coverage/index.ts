import type { Publication } from "../../types"
import { coverageIndex } from "./posts/index"
import { fncsSolos } from "./posts/fncs-solos-2026"
import { fncsGlobal } from "./posts/fncs-global-championship-2026"
import { fncsLastChance } from "./posts/fncs-global-last-chance-2026"
import { fncsMajor2 } from "./posts/fncs-major-2-2026"
import { fncsSummit } from "./posts/fncs-major-1-summit-2026"
import { fncsSecondChance } from "./posts/fncs-major-1-second-chance-2026"
import { fncsMajor1 } from "./posts/fncs-major-1-2026"

export const fncs2026: Publication = {
  relId: 6,
  pubId: "2026-fncs-and-majors-coverage",
  title: "2026 FNCS and majors coverage",
  description: "The 2026 FNCS circuit: regional Majors, Summit, Last Chance, Global Championship and standalone Solos, one article per event.",
  created: "2026-04-24",
  updated: "2026-10-03",
  isNSFW: false,
  isNew: true,
  isFeatured: false,
  isDraft: false,
  tags: ["Fortnite", "FNCS", "2026", "Competitive"],
  sectionId: "fortnite-competitive",
  synopsis: "Start with the event guide, then follow all seven events through their dates, formats, qualification routes and verified results. Completed events are disclosed backfills; the standalone Solos article tracks an ongoing competition. Every article links its official sources.",
  posts: [coverageIndex, fncsMajor1, fncsSecondChance, fncsSummit, fncsMajor2, fncsLastChance, fncsGlobal, fncsSolos],
}
