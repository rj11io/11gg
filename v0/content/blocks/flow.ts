/**
 * The flow block: a fenced code block with the language "flow" whose body is
 * JSON describing nodes and edges. Positions are optional; the renderer lays
 * the graph out when they are missing.
 *
 * ~~~flow
 * {
 *   "nodes": [{ "id": "a", "label": "Write" }, { "id": "b", "label": "Build" }],
 *   "edges": [{ "from": "a", "to": "b" }]
 * }
 * ~~~
 */
export const flowDirections = ["LR", "TB"] as const

export type FlowDirection = (typeof flowDirections)[number]

export const flowNodeKinds = ["default", "input", "output"] as const

export type FlowNodeKind = (typeof flowNodeKinds)[number]

export type FlowNode = {
  id: string
  label: string
  description?: string
  kind: FlowNodeKind
  position?: { x: number; y: number }
}

export type FlowEdge = {
  id: string
  from: string
  to: string
  label?: string
  animated: boolean
  dashed: boolean
}

export type FlowSpec = {
  title?: string
  description?: string
  direction: FlowDirection
  /** Pixels. The canvas needs a fixed height to draw anything. */
  height: number
  nodes: FlowNode[]
  edges: FlowEdge[]
  controls: boolean
  minimap: boolean
}

const idPattern = /^[a-zA-Z0-9_-]+$/

function fail(message: string): never {
  throw new Error(message)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function optionalString(
  input: Record<string, unknown>,
  key: string,
  label: string
): string | undefined {
  const value = input[key]
  if (value === undefined) return undefined
  if (typeof value !== "string") fail(`${label}.${key} must be a string`)
  return value
}

function optionalBoolean(
  input: Record<string, unknown>,
  key: string,
  label: string,
  fallback: boolean
): boolean {
  const value = input[key]
  if (value === undefined) return fallback
  if (typeof value !== "boolean") fail(`${label}.${key} must be true or false`)
  return value
}

export function parseFlowBlock(code: string): FlowSpec {
  let input: unknown
  try {
    input = JSON.parse(code)
  } catch (error) {
    fail(`not valid JSON (${(error as Error).message})`)
  }
  if (!isRecord(input)) fail("must be a JSON object")

  const direction = optionalString(input, "direction", "flow") ?? "LR"
  if (!flowDirections.includes(direction as FlowDirection)) {
    fail(`direction must be LR or TB`)
  }

  const height = input.height ?? 360
  if (typeof height !== "number" || height < 200 || height > 900) {
    fail("height must be a number between 200 and 900")
  }

  const nodesInput = input.nodes
  if (!Array.isArray(nodesInput) || nodesInput.length === 0) {
    fail("nodes must be a non-empty array")
  }
  const ids = new Set<string>()
  let positioned = 0
  const nodes: FlowNode[] = nodesInput.map((entry, index) => {
    const label = `nodes[${index}]`
    if (!isRecord(entry)) fail(`${label} must be an object`)
    const id = entry.id
    if (typeof id !== "string" || !idPattern.test(id)) {
      fail(`${label}.id must be letters, digits, _ or -`)
    }
    if (ids.has(id)) fail(`node id ${id} appears twice`)
    ids.add(id)
    const text = optionalString(entry, "label", label) ?? id
    const kind = optionalString(entry, "kind", label) ?? "default"
    if (!flowNodeKinds.includes(kind as FlowNodeKind)) {
      fail(`${label}.kind must be default, input or output`)
    }
    const x = entry.x
    const y = entry.y
    let position: FlowNode["position"]
    if (x !== undefined || y !== undefined) {
      if (typeof x !== "number" || typeof y !== "number") {
        fail(`${label} needs both x and y as numbers, or neither`)
      }
      position = { x, y }
      positioned += 1
    }
    return {
      id,
      label: text,
      description: optionalString(entry, "description", label),
      kind: kind as FlowNodeKind,
      position,
    }
  })
  if (positioned !== 0 && positioned !== nodes.length) {
    fail("either every node has x and y, or none does")
  }

  const edgesInput = input.edges ?? []
  if (!Array.isArray(edgesInput)) fail("edges must be an array")
  const edgeIds = new Set<string>()
  const edges: FlowEdge[] = edgesInput.map((entry, index) => {
    const label = `edges[${index}]`
    if (!isRecord(entry)) fail(`${label} must be an object`)
    const from = entry.from
    const to = entry.to
    if (typeof from !== "string" || !ids.has(from)) {
      fail(`${label}.from must name a node id`)
    }
    if (typeof to !== "string" || !ids.has(to)) {
      fail(`${label}.to must name a node id`)
    }
    const id = `${from}->${to}#${index}`
    edgeIds.add(id)
    return {
      id,
      from,
      to,
      label: optionalString(entry, "label", label),
      animated: optionalBoolean(entry, "animated", label, false),
      dashed: optionalBoolean(entry, "dashed", label, false),
    }
  })

  return {
    title: optionalString(input, "title", "flow"),
    description: optionalString(input, "description", "flow"),
    direction: direction as FlowDirection,
    height,
    nodes,
    edges,
    controls: optionalBoolean(input, "controls", "flow", true),
    minimap: optionalBoolean(input, "minimap", "flow", false),
  }
}
