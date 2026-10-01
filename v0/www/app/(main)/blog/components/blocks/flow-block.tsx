"use client"

import dynamic from "next/dynamic"

import type { FlowSpec } from "@content/blocks/flow"

/**
 * Thin client wrapper so the real canvas loads only in the browser. React
 * Flow can render on the server, but without measured nodes it ships hidden
 * markup and a large payload for nothing; the figure caption around this
 * component is already in the HTML, so the reader loses no text.
 */
const FlowCanvas = dynamic(() => import("./flow-canvas"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full animate-pulse bg-muted/40"
      style={{ height: "var(--flow-height)" }}
      aria-hidden="true"
    />
  ),
})

export function FlowBlock({ spec }: { spec: FlowSpec }) {
  return (
    <div style={{ "--flow-height": `${spec.height}px` } as React.CSSProperties}>
      <FlowCanvas spec={spec} />
    </div>
  )
}
