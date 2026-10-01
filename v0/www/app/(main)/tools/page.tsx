import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getSectionTools } from "@/lib/tools"
import { rootSection } from "@content/registry"

import { ToolsPage, toolsMetadata } from "../blog/components/pages/tools-page"

export const metadata: Metadata = toolsMetadata(rootSection)

/** The site's own tools index. A 404 until one tool is registered for the root. */
export default function Page() {
  if (getSectionTools(rootSection.id).length === 0) notFound()
  return <ToolsPage section={rootSection} />
}
