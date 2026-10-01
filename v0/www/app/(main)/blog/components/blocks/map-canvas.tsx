"use client"

import L from "leaflet"
import { useEffect, useRef } from "react"

import "leaflet/dist/leaflet.css"

import type { MapSpec } from "@content/blocks/map"

/**
 * Tiles. OpenStreetMap's own servers by default, which welcome light use
 * from a personal site with attribution shown. A different provider is one
 * build-time setting away; keep the attribution it requires in step.
 */
const tileUrl = process.env.NEXT_PUBLIC_MAP_TILES ?? "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
const tileAttribution =
  process.env.NEXT_PUBLIC_MAP_ATTRIBUTION ??
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

/** A pin drawn inline, coloured by the primary token, with an optional label. */
function pinIcon(label?: string) {
  const text = label
    ? `<text x="14" y="15" text-anchor="middle" font-size="11" font-weight="600" fill="var(--primary-foreground)">${escapeHtml(label)}</text>`
    : `<circle cx="14" cy="12" r="4" fill="var(--primary-foreground)" />`
  return L.divIcon({
    className: "blog-map-pin",
    html: `<svg width="28" height="36" viewBox="0 0 28 36" aria-hidden="true"><path d="M14 35c6-9 12-15.5 12-22a12 12 0 1 0-24 0c0 6.5 6 13 12 22z" fill="var(--primary)"/>${text}</svg>`,
    iconSize: [28, 36],
    iconAnchor: [14, 35],
    popupAnchor: [0, -30],
  })
}

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;")
}

/** Popup content built from DOM nodes, so titles are never parsed as HTML. */
function popup(title: string, description?: string) {
  const root = document.createElement("div")
  const heading = document.createElement("p")
  heading.className = "font-semibold"
  heading.textContent = title
  root.append(heading)
  if (description) {
    const body = document.createElement("p")
    body.className = "mt-1 text-sm"
    body.textContent = description
    root.append(body)
  }
  return root
}

export default function MapCanvas({ spec }: { spec: MapSpec }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const map = L.map(element, {
      zoomControl: spec.zoomControl,
      scrollWheelZoom: false,
      keyboard: true,
      zoomAnimation: !reduceMotion,
      fadeAnimation: !reduceMotion,
      markerZoomAnimation: !reduceMotion,
      attributionControl: true,
    })
    L.tileLayer(tileUrl, { attribution: tileAttribution, maxZoom: 19 }).addTo(map)

    const bounds = L.latLngBounds([])
    for (const marker of spec.markers) {
      const pin = L.marker([marker.lat, marker.lng], {
        icon: pinIcon(marker.label),
        title: marker.title,
        alt: marker.title,
      }).addTo(map)
      pin.bindPopup(popup(marker.title, marker.description))
      bounds.extend(pin.getLatLng())
    }
    if (spec.line.length) {
      const line = L.polyline(spec.line, { color: "var(--primary)", weight: 4, opacity: 0.85 }).addTo(map)
      bounds.extend(line.getBounds())
    }
    if (spec.area.length) {
      const area = L.polygon(spec.area, {
        color: "var(--primary)",
        weight: 2,
        fillColor: "var(--primary)",
        fillOpacity: 0.15,
      }).addTo(map)
      bounds.extend(area.getBounds())
    }
    if (spec.circles.length) {
      const largest = Math.max(...spec.circles.map((circle) => circle.value))
      for (const circle of spec.circles) {
        const dot = L.circleMarker([circle.lat, circle.lng], {
          radius: 6 + 26 * Math.sqrt(circle.value / largest),
          color: "var(--primary)",
          weight: 1.5,
          fillColor: "var(--primary)",
          fillOpacity: 0.35,
        }).addTo(map)
        dot.bindTooltip(`${circle.title}: ${circle.value.toLocaleString()}`)
        bounds.extend(dot.getLatLng())
      }
    }

    if (spec.center) {
      map.setView(spec.center, spec.zoom)
    } else {
      map.fitBounds(bounds, { padding: [32, 32], maxZoom: spec.zoom })
    }

    // The container can change size after mount: fonts load, a details element
    // opens, the pane resizes. Leaflet measures once, so tell it again.
    const observer = new ResizeObserver(() => map.invalidateSize())
    observer.observe(element)

    return () => {
      observer.disconnect()
      map.remove()
    }
  }, [spec])

  return (
    <div
      ref={ref}
      className="w-full overflow-hidden border border-border"
      style={{ height: spec.height }}
      role="region"
      aria-label={spec.title ?? "Map"}
    />
  )
}
