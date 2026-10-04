import type { Publication } from "../../types"
import { fortniteLoreIndex } from "./posts/start-here"

export const fortniteLore: Publication = {
  relId: 8,
  pubId: "fortnite-lore-story-and-timeline",
  title: "Fortnite lore, story, and timeline",
  description: "Battle Royale stories and a dated reading sequence, with original game evidence, licensed comic branches and unresolved continuity identified.",
  created: "2026-10-04",
  updated: "2026-10-04",
  isNSFW: false,
  isNew: true,
  isFeatured: false,
  isDraft: true,
  tags: ["Fortnite", "Battle Royale", "Lore", "Story", "Timeline"],
  sectionId: "fortnite",
  synopsis: "Begin with Fortnite lore: start here, the first-position living reading guide. Follow Chapters 1–7 in order, with licensed comic branches and later OG/Remix revisits identified separately. Complete story articles will be linked as they become available.",
  editorNotes: "Evergreen lore publication written October 4, 2026; historical reference dates appear in the guide. Kept draft until the guide and at least one complete original-evidence story pass review. Save the World remains a separate publication. No cover artwork added.",
  posts: [fortniteLoreIndex],
}
