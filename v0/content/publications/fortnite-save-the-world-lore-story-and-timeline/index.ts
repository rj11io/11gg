import type { Publication } from "../../types"
import { saveTheWorldLoreIndex } from "./posts/start-here"

export const saveTheWorldLore: Publication = {
  relId: 9,
  pubId: "fortnite-save-the-world-lore-story-and-timeline",
  title: "Fortnite: Save the World lore, story, and timeline",
  description: "Homebase's campaign and event stories, with original release references and unresolved dialogue, endings and continuity identified.",
  created: "2026-10-04",
  updated: "2026-10-04",
  isNSFW: false,
  isNew: true,
  isFeatured: false,
  isDraft: true,
  tags: ["Fortnite", "Save the World", "Lore", "Story", "Timeline"],
  sectionId: "fortnite",
  synopsis: "Begin with Save the World lore: start here, the first-position living guide. Follow Homebase's campaign into Canny Valley, then explore the event branches using their original release references. Complete stories will gain links and short summaries as they become available.",
  editorNotes: "Evergreen publication written October 4, 2026. Historical reference dates are identified in the guide; unknown dates remain unknown. Draft until a reviewed guide and at least one complete original-evidence story exist. Battle Royale has a separate publication. No cover artwork added.",
  posts: [saveTheWorldLoreIndex],
}
