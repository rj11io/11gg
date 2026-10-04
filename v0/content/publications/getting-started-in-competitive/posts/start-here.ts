import type { Post } from "../../../types"
import { postHref } from "../../../routes"

export const competitiveStartHere = {
  postId: 1001,
  slug: "start-here",
  title: "Getting started in competitive: start here",
  excerpt: "Start with your account and chosen event, then follow the roadmap through qualification, match rules and practice.",
  created: "2026-10-04",
  updated: "2026-10-04",
  authorIds: ["rj11io"],
  isNSFW: false,
  isNew: true,
  isFeatured: false,
  isDraft: true,
  tags: ["Fortnite", "Competitive", "Beginner guide", "Reading guide"],
  content: `
# Getting started in competitive: start here

Start with an event you want to enter. Check its eligibility requirements before planning your practice around it. This series follows that route from account setup to playing and reviewing competitive matches.

## Read first

[Eligibility, account setup and region requirements](${postHref("getting-started-in-competitive", { postId: 1002, slug: "eligibility-account-setup-and-region-requirements" }, ["fortnite", "competitive"])}). Check age and consent, account security, levels, event-specific qualification, platform, team and region requirements. The guide also explains what to inspect when an event is locked. Rules checked October 4, 2026.

## The beginner roadmap

Work through these questions in order. Further articles will be linked when available.

1. Can I enter? Complete the eligibility and account checks above for the selected event.
2. Which event should I prepare for? Learn its format, qualification route, scoring and session limits.
3. Which rankings matter? Understand the entry conditions attached to Ranked, official Power Rankings and other ranking systems.
4. How does this match work? Check the event's applicable mechanics, resources, storm rules and playlist differences.
5. How should I practice? Build a repeatable routine for decisions, teamwork where applicable and replay review.

## Keep the event rules close

The [Epic Rules Library](https://www.fortnite.com/competitive/rules-guidelines/rules-library?region=NAC) links the master rules and named competitions. Read the rules for your event alongside its in-game requirements. An example from one competition is a starting point for understanding, not a guarantee of entry into another.
`,
} satisfies Post
