import { describe, expect, it } from "vitest"

import { createSectionTree, validateSections } from "@content/section-tree"
import type { Section } from "@content/types"

const root: Section = { id: "root", kind: "root", segment: "", title: "Site" }
const tree: Section[] = [
  root,
  { id: "gaming", kind: "category", segment: "gaming", parentId: "root", title: "Gaming" },
  { id: "pokemon", kind: "game", segment: "pokemon", parentId: "root", title: "Pokémon", categories: ["gaming"] },
  { id: "champions", kind: "edition", segment: "champions", parentId: "pokemon", title: "Champions" },
]

describe("section tree", () => {
  it("builds paths, ancestors, children and descendants", () => {
    const t = createSectionTree(tree)
    expect(t.path("champions")).toEqual(["pokemon", "champions"])
    expect(t.ancestors("champions").map((section) => section.id)).toEqual(["root", "pokemon", "champions"])
    expect(t.children("root").map((section) => section.id)).toEqual(["gaming", "pokemon"])
    expect(t.descendants("root").map((section) => section.id)).toEqual(["gaming", "pokemon", "champions"])
    expect(t.findByPath(["pokemon", "champions"])?.id).toBe("champions")
    expect(t.findByPath(["nope"])).toBeUndefined()
  })

  it("accepts the sample tree", () => {
    expect(() => validateSections(tree)).not.toThrow()
  })

  it("refuses two roots, a reserved segment, an edition outside a game and a cycle", () => {
    expect(() => validateSections([root, { ...root, id: "root2" }])).toThrow("exactly one root")
    expect(() => validateSections([root, { id: "x", kind: "game", segment: "blog", parentId: "root", title: "X" }])).toThrow("reserved")
    expect(() => validateSections([root, { id: "e", kind: "edition", segment: "e", parentId: "root", title: "E" }])).toThrow("must sit under a game")
    expect(() =>
      validateSections([root, { id: "a", kind: "game", segment: "a", parentId: "b", title: "A" }, { id: "b", kind: "game", segment: "b", parentId: "a", title: "B" }])
    ).toThrow("cycle")
  })
})
