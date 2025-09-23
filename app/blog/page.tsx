import { getBlogPosts } from "@/lib/markdown"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LogoText } from "@/components/logo"
import { blogMetadata } from "@/lib/seo"

export const metadata = blogMetadata

export default function BlogPage() {
  const posts = getBlogPosts()

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Simple Header */}
      <header className="border-b border-border/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Home
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

      {/* Clean Blog Title */}
      <div className="py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-lg text-muted-foreground">
            Technical articles, tutorials, and insights on software engineering, AI, and systems programming.
          </p>
        </div>
      </div>

      {/* Clean Blog List */}
      <main className="px-4 sm:px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          {posts.length > 0 ? (
            <div className="space-y-12">
              {posts.map((post) => (
                <article key={post.slug} className="group">
                  <Link href={`/blog/${post.dateSlug}/${post.slug}`}>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <time dateTime={post.date}>
                          {new Date(post.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </time>
                        {post.tags.length > 0 && (
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
                      <h2 className="text-2xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed">
                        {post.description}
                      </p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                No blog posts yet. Create markdown files in{" "}
                <code className="text-sm bg-muted px-2 py-1 rounded">content/blog/</code> to get started.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}