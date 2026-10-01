import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { rootSection } from "@content/registry"
import { browseContentTypes } from "@content/routes"

import {
  BrowsePage,
  browseMetadata,
  isBrowseContentType,
} from "../../components/pages/browse-page"

type Props = {
  params: Promise<{ content: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return browseContentTypes.map((content) => ({ content }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { content } = await params
  if (!isBrowseContentType(content)) return { title: "Not found" }
  return browseMetadata(rootSection, content)
}

export default async function Page({ params }: Props) {
  const { content } = await params
  if (!isBrowseContentType(content)) notFound()
  return <BrowsePage section={rootSection} content={content} />
}
