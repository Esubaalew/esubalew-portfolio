import { PageLayout } from "@/components/page-layout"
import { getResumeFile } from "@/lib/resume"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { homeMetadata } from "@/lib/seo"

export const metadata = homeMetadata

export default async function Portfolio() {
  const resumeInfo = await getResumeFile()
  return (
    <PageLayout
      title="Esubalew Chekol"
      description="Software Engineer & MSc AI Student. I build systems that think, learn, and scale. Currently exploring the intersection of mathematics, artificial intelligence, and systems programming. Passionate about Rust, Python, and the elegant algorithms that power modern computing."
      section="home"
      showBackButton={false}
      resumeInfo={resumeInfo}
    >
      <section id="about" className="py-12 sm:py-16 px-4 sm:px-6 jetbrains-section-bg">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold mb-8">About</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground leading-relaxed mb-6">
              I'm fascinated by the mathematical foundations of computer science and their practical applications. My
              work spans from low-level systems programming in Rust and C++ to high-level machine learning applications
              in Python.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Currently pursuing my MSc in Artificial Intelligence while building production systems that solve
              real-world problems. I believe in writing code that is both mathematically sound and practically useful.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              When I'm not coding, you'll find me exploring new algorithms, contributing to open source projects, or
              diving deep into research papers on machine learning and systems design.
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
