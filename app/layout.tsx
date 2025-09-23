import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Esubalew Chekol - Software Engineer & AI Student",
    template: "%s - Esubalew Chekol"
  },
  description: "Software Engineer & MSc AI Student. I build systems that think, learn, and scale. Passionate about Rust, Python, and the elegant algorithms that power modern computing.",
  keywords: ["Esubalew Chekol", "Software Engineer", "AI", "Python", "Rust", "Machine Learning", "Systems Programming", "Portfolio", "Blog", "Projects"],
  authors: [{ name: "Esubalew Chekol", url: "https://esubalew.et" }],
  creator: "Esubalew Chekol",
  publisher: "Esubalew Chekol",
  metadataBase: new URL("https://esubalew.et"),
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${inter.variable} ${jetbrainsMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
