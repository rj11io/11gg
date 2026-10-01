import type { Metadata } from "next"

import { getSectionPosts, rootSection } from "@content/registry"

import { PostPage, postMetadata } from "../../components/pages/post-page"

type Props = {
  params: Promise<{ pubId: string; postId: string }>
}

export const dynamicParams = false

/** Only the root section's posts live here; a section's live under its own path. */
export function generateStaticParams() {
  return getSectionPosts(rootSection.id).map((post) => ({
    pubId: post.publicationId,
    postId: post.slug ?? String(post.postId),
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pubId, postId } = await params
  return postMetadata(rootSection, pubId, postId)
}

export default async function Page({ params }: Props) {
  const { pubId, postId } = await params
  return <PostPage section={rootSection} pubId={pubId} postId={postId} />
}
