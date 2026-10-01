"use client"

import dynamic from "next/dynamic"

import type { MapSpec } from "@content/blocks/map"

/**
 * Leaflet reads window the moment it is imported, so the canvas can only
 * load in the browser. A placeholder of the same height holds the space.
 */
const MapCanvas = dynamic(() => import("./map-canvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full animate-pulse bg-muted/40" style={{ height: "var(--map-height)" }} aria-hidden="true" />
  ),
})

export function MapBlock({ spec }: { spec: MapSpec }) {
  return (
    <div style={{ "--map-height": `${spec.height}px` } as React.CSSProperties}>
      <MapCanvas spec={spec} />
    </div>
  )
}
