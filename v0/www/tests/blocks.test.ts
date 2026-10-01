import { describe, expect, it } from "vitest"

import { validateContentBlocks } from "@content/blocks"
import { parseChartBlock } from "@content/blocks/chart"
import { extractFencedBlocks } from "@content/blocks/fenced"
import { parseFlowBlock } from "@content/blocks/flow"
import { parseMapBlock } from "@content/blocks/map"
import { parsePokepasteBlock } from "@content/blocks/pokepaste"

describe("fenced blocks", () => {
  it("finds fences of both kinds and counts per language", () => {
    const blocks = extractFencedBlocks("~~~chart\n{}\n~~~\n\n```json\n{}\n```\n\n~~~chart\n{}\n~~~\n")
    expect(blocks.map((block) => [block.language, block.ordinal])).toEqual([["chart", 1], ["json", 1], ["chart", 2]])
  })

  it("names the post, the language and the block that failed", () => {
    expect(() => validateContentBlocks('~~~chart\n{ "type": "bar", "data": [] }\n~~~', "pub/1")).toThrow(
      "pub/1: chart block 1 data must be a non-empty array"
    )
  })
})

describe("chart", () => {
  it("defaults the category field, the series and the colours", () => {
    const spec = parseChartBlock('{ "type": "bar", "data": [{ "month": "Jan", "a": 1, "b": 2 }] }')
    expect(spec.x).toBe("month")
    expect(spec.series.map((series) => series.key)).toEqual(["a", "b"])
    expect(spec.series[1].color).toBe("var(--chart-2)")
    expect(spec.legend).toBe(true)
  })

  it("refuses an unknown type and a non-numeric series value", () => {
    expect(() => parseChartBlock('{ "type": "donut", "data": [{ "a": "x", "b": 1 }] }')).toThrow("type must be one of")
    expect(() => parseChartBlock('{ "type": "bar", "data": [{ "a": "x", "b": 1 }, { "a": "y", "b": "no" }] }')).toThrow(
      "data[1].b must be a number"
    )
  })

  it("refuses text that is not JSON", () => {
    expect(() => parseChartBlock("{ type: bar }")).toThrow("not valid JSON")
  })
})

describe("flow", () => {
  it("accepts nodes without positions and labels edges", () => {
    const spec = parseFlowBlock('{ "nodes": [{ "id": "a" }, { "id": "b", "kind": "output" }], "edges": [{ "from": "a", "to": "b", "label": "go" }] }')
    expect(spec.direction).toBe("LR")
    expect(spec.nodes[0].label).toBe("a")
    expect(spec.edges[0].label).toBe("go")
  })

  it("refuses an edge to a missing node and a mix of positioned nodes", () => {
    expect(() => parseFlowBlock('{ "nodes": [{ "id": "a" }], "edges": [{ "from": "a", "to": "zz" }] }')).toThrow("edges[0].to must name a node id")
    expect(() => parseFlowBlock('{ "nodes": [{ "id": "a", "x": 0, "y": 0 }, { "id": "b" }] }')).toThrow("either every node has x and y, or none does")
  })
})

describe("map", () => {
  it("fits to points when there is no centre", () => {
    const spec = parseMapBlock('{ "markers": [{ "lat": 38.7, "lng": -9.1, "title": "Lisbon" }] }')
    expect(spec.center).toBeUndefined()
    expect(spec.markers[0].title).toBe("Lisbon")
  })

  it("refuses a bad coordinate and an empty map", () => {
    expect(() => parseMapBlock('{ "markers": [{ "lat": 95, "lng": 0, "title": "x" }] }')).toThrow("lat must be a number from -90 to 90")
    expect(() => parseMapBlock("{}")).toThrow("needs a center, or at least one marker")
  })
})

describe("pokepaste", () => {
  const paste = `=== [gen9vgc] Core ===

Smogonbirb (Talonflame) (F) @ Sharp Beak
Ability: Gale Wings
Level: 50
Shiny: Yes
Tera Type: Flying
EVs: 252 Atk / 4 Def / 252 Spe
IVs: 0 SpA
Jolly Nature
- Brave Bird
- Protect

Incineroar @ Safety Goggles
Ability: Intimidate
- Fake Out`

  it("reads the header, every line shape and the team title", () => {
    const spec = parsePokepasteBlock(paste)
    expect(spec.title).toBe("Core")
    expect(spec.format).toBe("gen9vgc")
    const [bird, cat] = spec.sets
    expect(bird).toMatchObject({ species: "Talonflame", nickname: "Smogonbirb", gender: "F", item: "Sharp Beak", level: 50, shiny: true, teraType: "Flying", nature: "Jolly" })
    expect(bird.evs).toMatchObject({ atk: 252, def: 4, spe: 252, hp: 0 })
    expect(bird.ivs.spa).toBe(0)
    expect(bird.ivs.hp).toBe(31)
    expect(cat.moves).toEqual(["Fake Out"])
  })

  it("refuses an EV over 252, five moves and an unreadable line", () => {
    expect(() => parsePokepasteBlock("Pikachu\nEVs: 300 Spe")).toThrow("set 1 EVs Spe is 300, the most is 252")
    expect(() => parsePokepasteBlock("Pikachu\n- a\n- b\n- c\n- d\n- e")).toThrow("has 5 moves, the most is four")
    expect(() => parsePokepasteBlock("Pikachu\nJolly")).toThrow('has an unreadable line "Jolly"')
  })
})
