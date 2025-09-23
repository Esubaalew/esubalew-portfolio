import fs from "fs"
import path from "path"
import matter from "gray-matter"

export interface BlogPost {
  slug: string
  title: string
  date: string
  description: string
  content: string
  tags?: string[]
  dateSlug: string // Format: YYYY/MM/DD for URL
}

export interface Project {
  slug: string
  title: string
  description: string
  content: string
  tech: string[]
  github?: string
  demo?: string
  status: "completed" | "in-progress" | "planned"
}

export function getBlogPosts(): BlogPost[] {
  const postsDirectory = path.join(process.cwd(), "content/blog")

  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const filenames = fs.readdirSync(postsDirectory)
  const posts = filenames
    .filter((name) => name.endsWith(".md"))
    .map((name) => {
      const filePath = path.join(postsDirectory, name)
      const fileContents = fs.readFileSync(filePath, "utf8")
      const { data, content } = matter(fileContents)

      const postDate = new Date(data.date || new Date().toISOString())
      const dateSlug = `${postDate.getFullYear()}/${String(postDate.getMonth() + 1).padStart(2, '0')}/${String(postDate.getDate()).padStart(2, '0')}`
      
      return {
        slug: name.replace(/\.md$/, ""),
        title: data.title || "Untitled",
        date: data.date || new Date().toISOString(),
        description: data.description || "",
        content,
        tags: data.tags || [],
        dateSlug,
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return posts
}

export function getBlogPost(slug: string): BlogPost | null {
  try {
    const filePath = path.join(process.cwd(), "content/blog", `${slug}.md`)
    const fileContents = fs.readFileSync(filePath, "utf8")
    const { data, content } = matter(fileContents)

    const postDate = new Date(data.date || new Date().toISOString())
    const dateSlug = `${postDate.getFullYear()}/${String(postDate.getMonth() + 1).padStart(2, '0')}/${String(postDate.getDate()).padStart(2, '0')}`

    return {
      slug,
      title: data.title || "Untitled",
      date: data.date || new Date().toISOString(),
      description: data.description || "",
      content,
      tags: data.tags || [],
      dateSlug,
    }
  } catch {
    return null
  }
}

export function getBlogPostByDateAndSlug(year: string, month: string, day: string, slug: string): BlogPost | null {
  const post = getBlogPost(slug)
  if (!post) return null
  
  const postDate = new Date(post.date)
  const postYear = postDate.getFullYear().toString()
  const postMonth = String(postDate.getMonth() + 1).padStart(2, '0')
  const postDay = String(postDate.getDate()).padStart(2, '0')
  
  if (postYear === year && postMonth === month && postDay === day) {
    return post
  }
  
  return null
}

export function getProjects(): Project[] {
  const projectsDirectory = path.join(process.cwd(), "content/projects")

  if (!fs.existsSync(projectsDirectory)) {
    return []
  }

  const filenames = fs.readdirSync(projectsDirectory)
  const projects = filenames
    .filter((name) => name.endsWith(".md"))
    .map((name) => {
      const filePath = path.join(projectsDirectory, name)
      const fileContents = fs.readFileSync(filePath, "utf8")
      const { data, content } = matter(fileContents)

      return {
        slug: name.replace(/\.md$/, ""),
        title: data.title || "Untitled",
        description: data.description || "",
        content,
        tech: data.tech || [],
        github: data.github,
        demo: data.demo,
        status: data.status || "completed",
      }
    })

  return projects
}

export function getProject(slug: string): Project | null {
  try {
    const filePath = path.join(process.cwd(), "content/projects", `${slug}.md`)
    const fileContents = fs.readFileSync(filePath, "utf8")
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data.title || "Untitled",
      description: data.description || "",
      content,
      tech: data.tech || [],
      github: data.github,
      demo: data.demo,
      status: data.status || "completed",
    }
  } catch {
    return null
  }
}
