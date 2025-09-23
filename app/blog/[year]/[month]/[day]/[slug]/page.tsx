import Link from "next/link"
import { notFound } from "next/navigation"
import { getBlogPostByDateAndSlug, getBlogPosts } from "@/lib/markdown"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LogoText } from "@/components/logo"

interface BlogPostPageProps {
  params: { 
    year: string
    month: string
    day: string
    slug: string
  }
}

export async function generateStaticParams() {
  const posts = getBlogPosts()
  return posts.map((post) => {
    const postDate = new Date(post.date)
    return {
      year: postDate.getFullYear().toString(),
      month: String(postDate.getMonth() + 1).padStart(2, '0'),
      day: String(postDate.getDate()).padStart(2, '0'),
      slug: post.slug,
    }
  })
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = getBlogPostByDateAndSlug(params.year, params.month, params.day, params.slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  // Import the SEO function dynamically to avoid build issues
  const { generateBlogPostMetadata } = await import('@/lib/seo')
  return generateBlogPostMetadata(post)
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPostByDateAndSlug(params.year, params.month, params.day, params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Simple Header */}
      <header className="border-b border-border/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/blog">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Blog
                </Link>
              </Button>
              <LogoText />
            </div>
            <div className="flex items-center space-x-4">
              <nav className="flex items-center space-x-6">
                <Link href="/blog" className="text-sm font-medium">Blog</Link>
                <Link href="/projects" className="text-sm font-medium text-muted-foreground hover:text-foreground">Projects</Link>
              </nav>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Article Header */}
      <div className="py-12 px-4 sm:px-6 border-b border-border/30">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </time>
              {post.tags && post.tags.length > 0 && (
                <>
                  <span>•</span>
                  <div className="flex items-center space-x-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs uppercase tracking-wide">
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
            <h1 className="text-4xl font-bold leading-tight">
              {post.title}
            </h1>
            {post.description && (
              <p className="text-xl text-muted-foreground leading-relaxed">
                {post.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Article Content */}
      <main className="py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <MarkdownRenderer content={post.content} />
          </div>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="border-t border-border/30 py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      </footer>
    </div>
  )
}