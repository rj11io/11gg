import type { Post } from "../../../../types"
import { postHref } from "../../../../routes"
import content from "./eligibility-account-setup-and-region-requirements.md"

export const competitiveEligibility = {
  postId: 1002,
  slug: "eligibility-account-setup-and-region-requirements",
  title: "Eligibility, account setup and region requirements",
  excerpt: "Check age, consent, 2FA, account level, event qualification, platform, team and region rules before your first Fortnite tournament.",
  created: "2026-10-04",
  updated: "2026-10-04",
  authorIds: ["rj11io"],
  isNSFW: false,
  isNew: true,
  isFeatured: false,
  isDraft: true,
  tags: ["Fortnite", "Competitive", "Eligibility", "Account security", "Regions"],
  content: content.replaceAll(
    "{{READING_GUIDE}}",
    postHref("getting-started-in-competitive", { postId: 1001, slug: "start-here" }, ["fortnite", "competitive"]),
  ),
} satisfies Post
