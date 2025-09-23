import { blogMetadata } from "@/lib/seo"

export const metadata = blogMetadata

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
