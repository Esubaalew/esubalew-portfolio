import { getBlogPosts } from "@/lib/markdown"
import { BlogClient } from "./blog-client"
import { blogMetadata } from "@/lib/seo"

export const metadata = blogMetadata

export default function BlogPage() {
  const posts = getBlogPosts()

  return <BlogClient posts={posts} />
}