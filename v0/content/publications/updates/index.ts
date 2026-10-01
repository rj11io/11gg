import type { Publication } from "../../types"
import { launch102 } from "./posts/launch-1-0-2"
import { update103 } from "./posts/update-1-0-3"
import { update110 } from "./posts/update-1-1-0"
import { update120 } from "./posts/update-1-2-0"

/**
 * One post per version update of Pokémon Champions, in release order. The
 * created date of each post is the update's release date, so the listing
 * reads as the patch history. Array order is editorial order, oldest first.
 */
export const pokemonChampionsUpdates: Publication = {
  relId: 5,
  pubId: "updates",
  title: "Pokémon Champions updates",
  description:
    "Every version update of Pokémon Champions since launch: what changed, what it fixed, which regulation it opened.",
  created: "2026-04-08",
  updated: "2026-10-02",
  isNSFW: false,
  isNew: true,
  isFeatured: true,
  isDraft: false,
  tags: ["Pokémon Champions", "Updates", "Patch notes"],
  synopsis:
    "The patch history of Pokémon Champions, one post per version. Each post lists what was added, what changed in balance, which Regulation and Ranked seasons it opened, and the sources behind every line. Written from official notes where they exist and from the community trackers that fill the gaps, and it says which is which.",
  sectionId: "pokemon-champions",
  posts: [launch102, update103, update110, update120],
}
