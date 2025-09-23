"use client"

import { Button } from "@/components/ui/button"
import { Home, ArrowLeft, Search, Zap } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function NotFound() {
  const [glitchText, setGlitchText] = useState("404")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?"
    const originalText = "404"
    
    const glitchInterval = setInterval(() => {
      let newText = ""
      for (let i = 0; i < originalText.length; i++) {
        if (Math.random() < 0.1) {
          newText += glitchChars[Math.floor(Math.random() * glitchChars.length)]
        } else {
          newText += originalText[i]
        }
      }
      setGlitchText(newText)
      
      // Reset to original after short time
      setTimeout(() => setGlitchText(originalText), 100)
    }, 2000)

    return () => clearInterval(glitchInterval)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating geometric shapes */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-purple-500/30 rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border-2 border-blue-500/30 rotate-12 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full animate-bounce"></div>
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(147, 51, 234, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(147, 51, 234, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-2xl mx-auto">
        {/* Glitch 404 */}
        <div className="mb-8">
          <h1 
            className="text-8xl sm:text-9xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-4 font-mono tracking-wider"
            style={{
              textShadow: '0 0 30px rgba(147, 51, 234, 0.5)',
              animation: 'glow 2s ease-in-out infinite alternate'
            }}
          >
            {glitchText}
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-6 rounded-full animate-pulse"></div>
        </div>

        {/* Error Message */}
        <div className="mb-8 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 flex items-center justify-center gap-2">
            <Zap className="h-8 w-8 text-yellow-400 animate-pulse" />
            Page Not Found
            <Zap className="h-8 w-8 text-yellow-400 animate-pulse" />
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            Looks like this page got lost in the digital void. 
            <br className="hidden sm:block" />
            Don't worry, even the best algorithms make mistakes!
          </p>
        </div>

        {/* Fun Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8 text-center">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
            <div className="text-2xl font-bold text-purple-400">∞</div>
            <div className="text-xs text-gray-400">Possibilities</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
            <div className="text-2xl font-bold text-pink-400">0</div>
            <div className="text-xs text-gray-400">Pages Found</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
            <div className="text-2xl font-bold text-blue-400">404</div>
            <div className="text-xs text-gray-400">Error Code</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 transition-all duration-300">
            <Link href="/blog">
              <Search className="mr-2 h-5 w-5" />
              Browse Blog
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="border-blue-500/50 text-blue-300 hover:bg-blue-500/10 hover:border-blue-400 transition-all duration-300">
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-5 w-5" />
              View Projects
            </Link>
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-xs text-gray-500">
            Lost? No worries - even the best developers encounter 404s!
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes glow {
          from {
            text-shadow: 0 0 20px rgba(147, 51, 234, 0.5);
          }
          to {
            text-shadow: 0 0 30px rgba(147, 51, 234, 0.8), 0 0 40px rgba(147, 51, 234, 0.3);
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(45deg);
          }
          to {
            transform: rotate(405deg);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  )
}
