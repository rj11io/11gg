import type { Metadata } from "next"

import { getSectionPublications, rootSection } from "@content/registry"

import {
  PublicationPage,
  publicationMetadata,
} from "../components/pages/publication-page"

type Props = {
  params: Promise<{ pubId: string }>
}

export const dynamicParams = false

/** Only the root section's publications live here; a section's live under its own path. */
export function generateStaticParams() {
  return getSectionPublications(rootSection.id).map((publication) => ({
    pubId: publication.pubId,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pubId } = await params
  return publicationMetadata(rootSection, pubId)
}

export default async function Page({ params }: Props) {
  const { pubId } = await params
  return <PublicationPage section={rootSection} pubId={pubId} />
}
