import type { Post } from "../../../types"
import { postHref } from "../../../routes"

export const coverageIndex = {
  postId: 601,
  slug: "index",
  title: "2026 FNCS: event guide and coverage index",
  excerpt: "Follow the six-event Duos circuit and standalone Solos competition, with a guide to each event and its place in the season.",
  created: "2026-10-03",
  updated: "2026-10-03",
  authorIds: ["rj11io"],
  isNSFW: false,
  isNew: true,
  isFeatured: false,
  isDraft: false,
  tags: ["FNCS", "2026", "Index", "Battle Royale"],
  content: `
# 2026 FNCS: event guide and coverage index

The 2026 Fortnite Championship Series follows a Duos circuit from regional Majors to two international events. A standalone regional Solos competition follows the Global Championship. This index follows all seven events.

## The events

| Event | Organizer dates in 2026 | Format |
| --- | --- | --- |
| FNCS Major 1 | April 6-26; Finals April 25-26 | Regional Duos |
| Major 1 Second Chance Qualifier | April 28-29 | Regional Duos |
| Major 1 Summit | May 29-31 | International Duos LAN |
| FNCS Major 2 | July 18-August 2; Finals August 1-2 | Regional Duos |
| Global Championship Last Chance | August 3-14 | Regional Duos |
| Fortnite Global Championship | September 26-27 | International Duos LAN |
| FNCS Solos | September 28-October 27 | Regional Solos |

## How the season connects

Major 1 and its Second Chance Qualifier feed the Summit. The Summit, Major 2 and Global Last Chance provide the Global Championship field. Solos is a separate competition with regional titles.

Epic replaced the original Major 3 with Global Last Chance in its May schedule update. Promotional cosmetic cups, Pro-Am and Reload competitions are outside this publication's seven-event scope.

## Coverage

- [FNCS Major 1 2026: the route to Summit](${postHref("2026-fncs-and-majors-coverage", { postId: 602, slug: "fncs-major-1-2026" }, ["fortnite", "competitive"])}). April's regional Duos circuit sent 50 teams to the Summit Upper stage; checked EU and NA Central Finals ended on 738 and 727 points.
- [FNCS Second Chance 2026: another route to Summit](${postHref("2026-fncs-and-majors-coverage", { postId: 603, slug: "fncs-major-1-second-chance-2026" }, ["fortnite", "competitive"])}). A separate six-match regional final sent 25 more Duos to Summit's Lower stage after Major 1.
- [FNCS Summit 2026: Malibuca and Vico win in Düsseldorf](${postHref("2026-fncs-and-majors-coverage", { postId: 604, slug: "fncs-major-1-summit-2026" }, ["fortnite", "competitive"])}). The three-day Summit brought 75 Duos to Düsseldorf, crowned Malibuca and Vico, and awarded 15 Global Championship places.
- [FNCS Major 2 2026: the summer route to Global](${postHref("2026-fncs-and-majors-coverage", { postId: 605, slug: "fncs-major-2-2026" }, ["fortnite", "competitive"])}). The summer Major awarded 25 Global Championship places, with Europe and NA Central Finals led by 732 and 617-point Duos.
- [FNCS Global Last Chance 2026: the final ten Global places](${postHref("2026-fncs-and-majors-coverage", { postId: 606, slug: "fncs-global-last-chance-2026" }, ["fortnite", "competitive"])}). August's separate Last Chance event completed the Global field; checked EU and NA Central Finals ended on 351 and 349 points.
- [FNCS Global Championship 2026: Pixie and SwizzY win by two points](${postHref("2026-fncs-and-majors-coverage", { postId: 607, slug: "fncs-global-championship-2026" }, ["fortnite", "competitive"])}). The Antwerp final ended 525, 523 and 521 at the top, with Pixie and SwizzY taking the 2026 Duos championship.
- [FNCS Solos 2026: the October schedule and route to Finals](${postHref("2026-fncs-and-majors-coverage", { postId: 608, slug: "fncs-solos-2026" }, ["fortnite", "competitive"])}). The standalone regional Solos event is ongoing. Qualifiers, Fast Track, Heats and Last Chance lead to Finals scheduled for October 26-27.

## Reading the coverage

This index stays first in reading order. Individual articles follow the events chronologically. Historical articles retain the event's reference date and disclose when they were written; updates reflect later revisions. Event dates follow Epic's organizer calendar. Region-specific sessions can cross midnight, so players should check the in-game Compete tab for their final local window.

Coverage cutoff: October 3, 2026. Solos is ongoing; its Finals are scheduled for October 26-27.

## Sources

- [Epic's revised 2026 schedule](https://www.fortnite.com/news/fncs-schedule-and-competitive-updates).
- [2026 FNCS Duos rules](https://www.fortnite.com/competitive/rules-guidelines/rules-library/fortnite-championship-series-fncs-2026-official-rules?region=NAC).
- [2026 FNCS Solos rules](https://www.fortnite.com/competitive/rules-guidelines/rules-library/fortnite-championship-series-fncs-solos-2026-official-rules?region=NAC).
`,
} satisfies Post
