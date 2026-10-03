import type { Section } from "./types"

/**
 * The gg funnel: the site, then categories, games and dedicated child sections. Paths
 * use the games' full official names as references; the site's own name is
 * 11gg. body is the hub's own words, Markdown, shown on its landing. See the
 * Sections and modules post in the platform docs.
 */
export const sections: Section[] = [
  {
    id: "root",
    kind: "root",
    segment: "",
    title: "11gg",
    description: "Games followed update by update, by someone who plays them.",
    body:
      "One site, a section per game. Each section carries its own blog, a short list of resources worth opening, and tools built here. Start with the monthly releases calendar under Gaming, or pick a game.",
  },
  {
    id: "gaming",
    kind: "category",
    segment: "gaming",
    parentId: "root",
    title: "Gaming",
    description: "Games as games: releases, updates, what is worth playing.",
    body:
      "The monthly releases calendar lives here: what came out last month, what is out now, what is dated next, and which dates moved. The game sections below hold the writing on each game.",
  },
  {
    id: "esports",
    kind: "category",
    segment: "esports",
    parentId: "root",
    title: "Esports",
    description: "The competitive side: formats, seasons, championships.",
    body:
      "The competitive side of the games on this site: formats, seasons, regulations, championships. Nothing is published here yet. The game sections listed below carry what exists so far.",
  },
  {
    id: "fortnite",
    kind: "game",
    segment: "fortnite",
    parentId: "root",
    title: "Fortnite",
    description: "Fortnite news, updates, guides and the competitive scene.",
    categories: ["gaming", "esports"],
    body:
      "Season news and updates live here, with tags for the modes each post covers. The Competitive section is the home for tournaments, event coverage and getting started in competition.",
  },
  {
    id: "fortnite-competitive",
    kind: "edition",
    segment: "competitive",
    parentId: "fortnite",
    title: "Competitive",
    description: "Fortnite tournaments, event coverage and guides to getting started.",
    body:
      "A place for Fortnite's competitive scene: tournament formats, qualification, event coverage and guides for your first competition. No articles are published yet.",
  },
  {
    id: "world-of-warcraft",
    kind: "game",
    segment: "world-of-warcraft",
    parentId: "root",
    title: "World of Warcraft",
    description: "Blizzard's MMO in all its branches.",
    categories: ["gaming"],
    body:
      "Blizzard's MMO in all its branches. The first thing followed here is World of Warcraft: Forever, the permanent Classic branch announced at BlizzCon 2026, from the announcement to its launch on 4 November and onward.",
  },
  {
    id: "wow-forever",
    kind: "edition",
    segment: "forever",
    parentId: "world-of-warcraft",
    title: "Forever",
    description: "The permanent Classic branch, launched 4 November 2026.",
    body:
      "The original Azeroth kept at level 60 and grown sideways. One post per news item from announcement to launch, and the patches after.",
  },
  {
    id: "pokemon",
    kind: "game",
    segment: "pokemon",
    parentId: "root",
    title: "Pok\u00e9mon",
    description: "The games, the battles, the competitive scene.",
    categories: ["gaming", "esports"],
    body:
      "The battle games and the competitive scene around them. Pok\u00e9mon Champions is the first edition followed here, with one post per version update and a team viewer that reads the Showdown export format.",
  },
  {
    id: "pokemon-champions",
    kind: "edition",
    segment: "champions",
    parentId: "pokemon",
    title: "Champions",
    description: "The battle game, update by update.",
    body:
      "The battle game, update by update: what each version added, changed and fixed, which regulation it opened. The team viewer tool renders any Showdown export as cards.",
  },
]
