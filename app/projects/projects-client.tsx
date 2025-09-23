"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { ThemeToggle } from "@/components/theme-toggle"
import { LogoText } from "@/components/logo"
import Link from "next/link"
import type { Project } from "@/lib/markdown"

const PROJECTS_PER_PAGE = 6

interface ProjectsClientProps {
  projects: Project[]
}

export function ProjectsClient({ projects }: ProjectsClientProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set())

  const totalPages = Math.ceil(projects.length / PROJECTS_PER_PAGE)
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE
  const currentProjects = projects.slice(startIndex, startIndex + PROJECTS_PER_PAGE)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "in-progress":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      case "planned":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const toggleExpanded = (slug: string) => {
    const newExpanded = new Set(expandedProjects)
    if (newExpanded.has(slug)) {
      newExpanded.delete(slug)
    } else {
      newExpanded.add(slug)
    }
    setExpandedProjects(newExpanded)
  }

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
                <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground">Blog</Link>
                <Link href="/projects" className="text-sm font-medium">Projects</Link>
              </nav>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Clean Projects Title */}
      <div className="py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Projects</h1>
          <p className="text-lg text-muted-foreground">
            A collection of software engineering and AI projects showcasing technical expertise and problem-solving skills.
          </p>
        </div>
      </div>

      {/* Clean Projects List */}
      <main className="px-4 sm:px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          {projects.length > 0 ? (
            <>
              <div className="grid gap-8 mb-8">
                {currentProjects.map((project) => {
                  const isExpanded = expandedProjects.has(project.slug)
                  return (
                    <div key={project.slug} className="border-b border-border/30 pb-8 last:border-b-0">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                              <span className={`px-2 py-1 text-xs rounded ${getStatusColor(project.status)}`}>
                                {project.status.replace("-", " ")}
                              </span>
                              {project.tech.length > 0 && (
                                <>
                                  <span>•</span>
                                  <div className="flex items-center space-x-2">
                                    {project.tech.slice(0, 3).map((tech) => (
                                      <span key={tech} className="text-xs uppercase tracking-wide">
                                        {tech}
                                      </span>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                            <h2 className="text-2xl font-bold mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                              {project.title}
                            </h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">{project.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex gap-3">
                            {project.github && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={project.github} target="_blank" rel="noopener noreferrer">
                                  <Github className="mr-2 h-4 w-4" />
                                  Code
                                </a>
                              </Button>
                            )}
                            {project.demo && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={project.demo} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  Demo
                                </a>
                              </Button>
                            )}
                          </div>
                          
                          {project.content && project.content.trim() && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleExpanded(project.slug)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              {isExpanded ? "Show Less" : "Read More"}
                            </Button>
                          )}
                        </div>

                        {isExpanded && project.content && (
                          <div className="pt-6 border-t border-border/30">
                            <div className="prose prose-lg dark:prose-invert max-w-none">
                              <MarkdownRenderer content={project.content} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Previous
                  </Button>
                  
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-lg font-semibold mb-2">No Projects Yet</h3>
              <p className="text-muted-foreground mb-4">
                Projects will automatically appear here when you add markdown files.
              </p>
              <code className="text-sm bg-muted px-2 py-1 rounded">
                content/projects/*.md
              </code>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
