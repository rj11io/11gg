import type { Section } from "./types"

/**
 * The gg funnel: the site, then categories, then games, then editions. Paths
 * use the games' full official names as references; the site's own name is
 * 11gg. See the Sections and modules post in the platform docs.
 */
export const sections: Section[] = [
  { id: "root", kind: "root", segment: "", title: "11gg", description: "The gaming and esports vertical of rj11.io." },
  { id: "gaming", kind: "category", segment: "gaming", parentId: "root", title: "Gaming", description: "Games as games: releases, updates, what is worth playing." },
  { id: "esports", kind: "category", segment: "esports", parentId: "root", title: "Esports", description: "The competitive side: formats, seasons, championships." },
  { id: "fortnite", kind: "game", segment: "fortnite", parentId: "root", title: "Fortnite", description: "Epic's battle royale and everything built around it.", categories: ["gaming", "esports"] },
  { id: "fortnite-br", kind: "edition", segment: "br", parentId: "fortnite", title: "Battle Royale", description: "The main mode, season by season." },
  { id: "world-of-warcraft", kind: "game", segment: "world-of-warcraft", parentId: "root", title: "World of Warcraft", description: "Blizzard's MMO in all its branches.", categories: ["gaming"] },
  { id: "wow-forever", kind: "edition", segment: "forever", parentId: "world-of-warcraft", title: "Forever", description: "The permanent Classic branch, launched 4 November 2026." },
  { id: "pokemon", kind: "game", segment: "pokemon", parentId: "root", title: "Pokémon", description: "The games, the battles, the competitive scene.", categories: ["gaming", "esports"] },
  { id: "pokemon-champions", kind: "edition", segment: "champions", parentId: "pokemon", title: "Champions", description: "The battle game, update by update." },
]
