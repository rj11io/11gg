import type { Publication } from "../../types"
import { competitiveStartHere } from "./posts/start-here"
import { competitiveEligibility } from "./posts/eligibility-account-setup-and-region-requirements"

export const gettingStartedInCompetitive: Publication = {
  relId: 10,
  pubId: "getting-started-in-competitive",
  title: "Getting started in competitive",
  description: "A beginner route into Fortnite competition, starting with eligibility, account setup and the requirements of your chosen event.",
  created: "2026-10-04",
  updated: "2026-10-04",
  isNSFW: false,
  isNew: true,
  isFeatured: false,
  isDraft: true,
  tags: ["Fortnite", "Competitive", "Beginner guide"],
  sectionId: "fortnite-competitive",
  synopsis: "Begin with Getting started in competitive: start here, the first reading guide. Follow account and eligibility checks before learning event formats, qualification, match rules and practice habits. Each article distinguishes general requirements from the rules of a named event.",
  editorNotes: "Evergreen beginner curriculum written October 4, 2026. Rules-check dates appear in the articles; recheck the selected event before entering. Local drafts await publication review.",
  posts: [competitiveStartHere, competitiveEligibility],
}
