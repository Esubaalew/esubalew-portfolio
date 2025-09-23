import { ProjectsClient } from "./projects-client"
import { getProjects } from "@/lib/markdown"
import { projectsMetadata } from "@/lib/seo"

export const metadata = projectsMetadata

export default function ProjectsPage() {
  const projects = getProjects()
  return <ProjectsClient projects={projects} />
}
