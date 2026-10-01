"use client"

import { useEffect, useState } from "react"

/**
 * True when the reader asked the operating system for less motion. Starts
 * false on the server and on the first client render so the markup matches,
 * then follows the media query. Block components use it to turn chart and map
 * animation off, which is part of the accessibility contract.
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  return reduced
}
