"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { LogoText } from "@/components/logo"
import Link from "next/link"
import type { BlogPost } from "@/lib/markdown"

const POSTS_PER_PAGE = 8

interface BlogClientProps {
  posts: BlogPost[]
}

export function BlogClient({ posts }: BlogClientProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const currentPosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Skip Navigation Links */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50 focus:z-50"
      >
        Skip to main content
      </a>
      
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
              <LogoText asLink />
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
          {posts.length > POSTS_PER_PAGE && (
            <p className="text-sm text-muted-foreground mt-2">
              Showing {startIndex + 1}-{Math.min(startIndex + POSTS_PER_PAGE, posts.length)} of {posts.length} posts
            </p>
          )}
        </div>
      </div>

      {/* Clean Blog List */}
      <main id="main-content" className="px-4 sm:px-6 pb-16" role="main">
        <div className="max-w-4xl mx-auto">
          {posts.length > 0 ? (
            <>
              <div className="space-y-12 mb-8">
                {currentPosts.map((post) => (
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

              {/* Pagination */}
              {totalPages > 1 && (
                <nav aria-label="Blog posts pagination" className="flex items-center justify-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    aria-label="Go to previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center space-x-1" role="group" aria-label="Page numbers">
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      let page: number;
                      if (totalPages <= 7) {
                        page = i + 1;
                      } else if (currentPage <= 4) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 3) {
                        page = totalPages - 6 + i;
                      } else {
                        page = currentPage - 3 + i;
                      }
                      
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="min-w-[40px]"
                          aria-label={`Go to page ${page}`}
                          aria-current={currentPage === page ? "page" : undefined}
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    aria-label="Go to next page"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </nav>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">No blog posts yet</h2>
              <p className="text-muted-foreground">
                Check back later for technical articles and insights.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
