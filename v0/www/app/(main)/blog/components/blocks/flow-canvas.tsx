"use client"

import dagre from "@dagrejs/dagre"
import {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react"
import { useTheme } from "next-themes"
import { useMemo } from "react"

import "@xyflow/react/dist/style.css"

import type { FlowNodeKind, FlowSpec } from "@content/blocks/flow"

import { useReducedMotion } from "./use-reduced-motion"

type CardNode = Node<
  { label: string; description?: string; kind: FlowNodeKind },
  "card"
>

const NODE_WIDTH = 180
const NODE_HEIGHT = 56

/**
 * The one node type every flow uses: a small card in the site's tokens with a
 * handle on each side the graph needs. Module scope, as React Flow requires,
 * so the type map is stable across renders.
 */
function FlowCard({ data, sourcePosition, targetPosition }: NodeProps<CardNode>) {
  return (
    <div
      className="w-45 border border-border bg-card px-3 py-2 text-sm shadow-sm"
      style={{ width: NODE_WIDTH, minHeight: NODE_HEIGHT }}
    >
      <div className="font-medium text-foreground">{data.label}</div>
      {data.description ? (
        <div className="mt-0.5 text-xs text-muted-foreground">{data.description}</div>
      ) : null}
      {data.kind !== "input" ? (
        <Handle type="target" position={targetPosition ?? Position.Left} className="!size-2 !border-0 !bg-primary" />
      ) : null}
      {data.kind !== "output" ? (
        <Handle type="source" position={sourcePosition ?? Position.Right} className="!size-2 !border-0 !bg-primary" />
      ) : null}
    </div>
  )
}

const nodeTypes = { card: FlowCard }

/** Lays out nodes without positions with dagre, left to right or top down. */
function layout(spec: FlowSpec): { nodes: CardNode[]; edges: Edge[] } {
  const leftToRight = spec.direction === "LR"
  const sourcePosition = leftToRight ? Position.Right : Position.Bottom
  const targetPosition = leftToRight ? Position.Left : Position.Top

  const graph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))
  graph.setGraph({ rankdir: spec.direction, nodesep: 24, ranksep: 48 })
  for (const node of spec.nodes) {
    graph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT })
  }
  for (const edge of spec.edges) graph.setEdge(edge.from, edge.to)
  const needsLayout = spec.nodes.some((node) => !node.position)
  if (needsLayout) dagre.layout(graph)

  const nodes: CardNode[] = spec.nodes.map((node) => {
    const placed = graph.node(node.id)
    const position = node.position ?? {
      x: placed.x - NODE_WIDTH / 2,
      y: placed.y - NODE_HEIGHT / 2,
    }
    return {
      id: node.id,
      type: "card",
      position,
      sourcePosition,
      targetPosition,
      data: { label: node.label, description: node.description, kind: node.kind },
    }
  })

  const edges: Edge[] = spec.edges.map((edge) => ({
    id: edge.id,
    source: edge.from,
    target: edge.to,
    label: edge.label,
    animated: edge.animated,
    type: "smoothstep",
    markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18 },
    style: edge.dashed ? { strokeDasharray: "6 4" } : undefined,
  }))

  return { nodes, edges }
}

export default function FlowCanvas({ spec }: { spec: FlowSpec }) {
  // This component only ever mounts in the browser (flow-block.tsx loads it
  // with ssr off), so the theme is already resolved and needs no guard.
  const { resolvedTheme } = useTheme()
  const reducedMotion = useReducedMotion()

  const { nodes, edges } = useMemo(() => layout(spec), [spec])
  const quietEdges = useMemo(
    () => (reducedMotion ? edges.map((edge) => ({ ...edge, animated: false })) : edges),
    [edges, reducedMotion]
  )

  return (
    <div
      className="w-full overflow-hidden border border-border"
      style={{ height: spec.height }}
      role="img"
      aria-label={spec.title ?? "Flow chart"}
    >
      <ReactFlow
        nodes={nodes}
        edges={quietEdges}
        nodeTypes={nodeTypes}
        colorMode={resolvedTheme === "dark" ? "dark" : "light"}
        fitView
        // Never shrink below 0.6: a wide graph in a narrow frame stays
        // readable and the reader pans, instead of squinting at a thumbnail.
        fitViewOptions={{ padding: 0.15, minZoom: 0.6 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll={false}
        zoomOnDoubleClick={false}
        panOnDrag
        preventScrolling={false}
        minZoom={0.3}
        maxZoom={2}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        {spec.controls ? <Controls showInteractive={false} /> : null}
        {spec.minimap ? <MiniMap pannable={false} zoomable={false} /> : null}
      </ReactFlow>
    </div>
  )
}
