import { describe, expect, it } from "vitest"

import type { Author, Publication, Section } from "@content/types"
import { validatePublications } from "@content/validation"

const authors: Author[] = [{ id: "me", name: "Me", displayName: "M", bio: "Writes.", tags: [] }]
const sections: Section[] = [
  { id: "root", kind: "root", segment: "", title: "Site" },
  { id: "a", kind: "game", segment: "a", parentId: "root", title: "A" },
  { id: "b", kind: "game", segment: "b", parentId: "root", title: "B" },
]

function publication(relId: number, sectionId: string): Publication {
  return {
    relId,
    pubId: "updates",
    title: "Updates",
    description: "Updates.",
    created: "2026-10-01",
    isNSFW: false,
    isNew: false,
    isFeatured: false,
    isDraft: false,
    tags: [],
    sectionId,
    posts: [
      { postId: 1, slug: "one", title: "One", created: "2026-10-01", authorIds: ["me"], isNSFW: false, isNew: false, isFeatured: false, isDraft: false, tags: [], content: "# One\n\nBody." },
    ],
  }
}

describe("publication ids", () => {
  it("are unique within a section, not across the site", () => {
    expect(() => validatePublications([publication(1, "a"), publication(2, "b")], authors, sections)).not.toThrow()
    expect(() => validatePublications([publication(1, "a"), publication(2, "a")], authors, sections)).toThrow(
      "Duplicate publication pubId: updates in section a"
    )
  })

  it("refuse a section that does not exist", () => {
    expect(() => validatePublications([publication(1, "zz")], authors, sections)).toThrow("sectionId zz is not a section")
  })
})
