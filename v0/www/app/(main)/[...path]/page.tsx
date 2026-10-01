import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { resolveSectionRoute, sectionStaticParams } from "@/lib/section-routes"

import { BlogLanding } from "../blog/components/pages/blog-landing"
import { BrowsePage, browseMetadata } from "../blog/components/pages/browse-page"
import { PostPage, postMetadata } from "../blog/components/pages/post-page"
import { PublicationPage, publicationMetadata } from "../blog/components/pages/publication-page"
import { ResourcesPage, resourcesMetadata } from "../blog/components/pages/resources-page"
import { SectionLanding, sectionMetadata } from "../blog/components/pages/section-landing"
import { ToolsPage, toolsMetadata } from "../blog/components/pages/tools-page"

/**
 * Every page of every section except the root: the landing, the blog, its
 * browse indexes, publications and posts. The address is resolved against the
 * section tree; a static route folder beside this one, such as a tool, wins
 * over it, which is how tools and the blog share a section's path.
 */
type Props = {
  params: Promise<{ path: string[] }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return sectionStaticParams()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { path } = await params
  const route = resolveSectionRoute(path)
  if (!route) return { title: "Not found" }
  switch (route.kind) {
    case "landing":
      return sectionMetadata(route.section)
    case "resources":
      return resourcesMetadata(route.section)
    case "tools":
      return toolsMetadata(route.section)
    case "blog":
      return { title: `${route.section.title} blog`, description: route.section.description }
    case "browse":
      return browseMetadata(route.section, route.content)
    case "publication":
      return publicationMetadata(route.section, route.pubId)
    case "post":
      return postMetadata(route.section, route.pubId, route.postId)
  }
}

export default async function SectionPage({ params }: Props) {
  const { path } = await params
  const route = resolveSectionRoute(path)
  if (!route) notFound()
  switch (route.kind) {
    case "landing":
      return <SectionLanding section={route.section} />
    case "resources":
      return <ResourcesPage section={route.section} />
    case "tools":
      return <ToolsPage section={route.section} />
    case "blog":
      return (
        <BlogLanding
          section={route.section}
          hero={{
            eyebrow: route.section.title,
            title: `${route.section.title} blog`,
            description: route.section.description ?? "",
          }}
        />
      )
    case "browse":
      return <BrowsePage section={route.section} content={route.content} />
    case "publication":
      return <PublicationPage section={route.section} pubId={route.pubId} />
    case "post":
      return <PostPage section={route.section} pubId={route.pubId} postId={route.postId} />
  }
}
