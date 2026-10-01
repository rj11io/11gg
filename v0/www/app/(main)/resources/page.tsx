import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getSectionResources, rootSection } from "@content/registry"

import { ResourcesPage, resourcesMetadata } from "../blog/components/pages/resources-page"

export const metadata: Metadata = resourcesMetadata(rootSection)

/** The site's own resources. A 404 until the root section has at least one. */
export default function Page() {
  if (getSectionResources(rootSection.id).length === 0) notFound()
  return <ResourcesPage section={rootSection} />
}
