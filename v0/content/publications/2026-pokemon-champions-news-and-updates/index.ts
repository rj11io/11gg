import type { Publication } from "../../types"
import { championsIndex } from "./posts/start-here"
import { launch102 } from "./posts/launch-1-0-2"
import { update103 } from "./posts/update-1-0-3"
import { update110 } from "./posts/update-1-1-0"
import { update120 } from "./posts/update-1-2-0"

/** The living guide comes first; articles retain their reference dates and reading order. */
export const pokemonChampionsUpdates: Publication = {
  relId: 5,
  pubId: "2026-pokemon-champions-news-and-updates",
  title: "2026 Pokémon Champions news and updates",
  description:
    "Pokémon Champions news and updates in 2026: version changes, fixes and the regulations each update introduced.",
  created: "2026-04-06",
  updated: "2026-10-04",
  isNSFW: false,
  isNew: true,
  isFeatured: true,
  isDraft: false,
  tags: ["Pokémon Champions", "Updates", "Patch notes"],
  synopsis:
    "Start with 2026 Pokémon Champions: start here for our selected updates and the complete official patch-history source. The 2026 news and update record. Selected Pokémon Champions patches, one post per covered version. Each post lists what was added, what changed in balance, which Regulation and Ranked seasons it opened, and the sources behind every line. Written from official notes where they exist and from the community trackers that fill the gaps, and it says which is which.",
  sectionId: "pokemon-champions",
  posts: [championsIndex, launch102, update103, update110, update120],
}
