"use client"

import { Button } from "@/components/ui/button"
import { Github, Linkedin, Twitter, Mail, ArrowLeft, Download } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { MathBackground } from "@/components/math-background"
import { LogoText } from "@/components/logo"
import Link from "next/link"
import type { ResumeInfo } from "@/lib/resume"

interface PageLayoutProps {
  children: React.ReactNode
  title: string
  description: string
  section: "home" | "blog" | "projects" | "games"
  showBackButton?: boolean
  resumeInfo?: ResumeInfo | null
}

const sectionThemes = {
  home: {
    bg: "jetbrains-hero-bg",
    sectionBg: "jetbrains-section-bg",
    titleClass: "gradient-text",
  },
  blog: {
    bg: "jetbrains-blog-bg",
    sectionBg: "jetbrains-blog-section",
    titleClass: "text-foreground",
  },
  projects: {
    bg: "jetbrains-projects-bg",
    sectionBg: "jetbrains-projects-section",
    titleClass: "text-foreground",
  },
  games: {
    bg: "jetbrains-games-bg",
    sectionBg: "jetbrains-games-section",
    titleClass: "text-foreground",
  },
}

export function PageLayout({ children, title, description, section, showBackButton = true, resumeInfo }: PageLayoutProps) {
  const theme = sectionThemes[section]
  const isHome = section === "home"

  return (
    <div className={`min-h-screen ${theme.bg} text-foreground relative overflow-hidden`}>
      <MathBackground />

      {/* Navigation */}
      <nav className="border-b border-border/30 backdrop-blur-sm bg-background/10 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {showBackButton && !isHome && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Home
                  </Link>
                </Button>
              )}
              <LogoText />
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <Button variant="ghost" size="sm" asChild>
                <a href="https://github.com/esubaalew" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="https://linkedin.com/in/esubaalew" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="https://twitter.com/esubaalew" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className={`text-3xl sm:text-4xl md:text-6xl font-bold mb-4 text-balance ${theme.titleClass}`}>
              {title}
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-6 text-pretty leading-relaxed">
              {description}
            </p>
          </div>

          {/* Navigation buttons for non-home pages */}
          {!isHome && (
            <div className="flex flex-wrap gap-4 mb-12">
              <Button variant="outline" asChild className="jetbrains-card border-2">
                <Link href="/">Home</Link>
              </Button>
              <Button variant="outline" asChild className="jetbrains-card border-2 border-green-500/50 hover:border-green-400 text-green-400 hover:text-green-300">
                <Link href="/blog">Blog</Link>
              </Button>
              <Button variant="outline" asChild className="jetbrains-card border-2 border-orange-500/50 hover:border-orange-400 text-orange-400 hover:text-orange-300">
                <Link href="/projects">Projects</Link>
              </Button>
            </div>
          )}

          {/* Home page specific content */}
          {isHome && (
            <>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button asChild className="w-full sm:w-auto jetbrains-button border-0">
                  <a href="mailto:hello@esubalew.et">
                    <Mail className="mr-2 h-4 w-4" />
                    Get in touch
                  </a>
                </Button>
                {resumeInfo && (
                  <Button variant="outline" asChild className="w-full sm:w-auto jetbrains-card border-2 border-blue-500/50 hover:border-blue-400 text-blue-400 hover:text-blue-300">
                    <a href={resumeInfo.path} download={resumeInfo.filename} target="_blank" rel="noopener noreferrer">
                      <Download className="mr-2 h-4 w-4" />
                      Resume
                    </a>
                  </Button>
                )}
                <Button variant="outline" asChild className="w-full sm:w-auto jetbrains-card border-2 border-green-500/50 hover:border-green-400 text-green-400 hover:text-green-300">
                  <Link href="/blog">Blog</Link>
                </Button>
                <Button variant="outline" asChild className="w-full sm:w-auto jetbrains-card border-2 border-orange-500/50 hover:border-orange-400 text-orange-400 hover:text-orange-300">
                  <Link href="/projects">Projects</Link>
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {["Python", "Rust", "AI/ML", "Systems Programming", "Web Development", "Data Structures", "Algorithms"].map(
                  (skill) => (
                    <span key={skill} className="text-xs sm:text-sm px-3 py-1 bg-muted/50 rounded-full border border-border/50">
                      {skill}
                    </span>
                  ),
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Main content */}
      <main className="relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className={`py-8 sm:py-12 px-4 sm:px-6 border-t border-border/30 ${theme.sectionBg} relative z-10`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">© 2024 Esubalew Chekol</p>
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <a
                href="mailto:hello@esubalew.et"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                hello@esubalew.et
              </a>
              <a
                href="https://github.com/esubaalew"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
