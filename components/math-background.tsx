"use client"

import { useEffect, useState } from "react"

const mathSymbols = [
  "∫",
  "∂",
  "∇",
  "∑",
  "∏",
  "∞",
  "α",
  "β",
  "γ",
  "δ",
  "ε",
  "θ",
  "λ",
  "μ",
  "π",
  "σ",
  "φ",
  "ψ",
  "ω",
  "≈",
  "≠",
  "≤",
  "≥",
  "∈",
  "∉",
  "⊂",
  "⊃",
  "∪",
  "∩",
  "∅",
  "ℝ",
  "ℕ",
  "ℤ",
  "ℚ",
  "ℂ",
  "f(x)",
  "∂f/∂x",
  "lim",
  "log",
  "ln",
  "sin",
  "cos",
  "tan",
  "e^x",
  "x²",
  "√x",
  "∇²",
]

const jetbrainsColors = [
  "oklch(0.75 0.15 280)", // Purple
  "oklch(0.8 0.12 300)",  // Magenta
  "oklch(0.7 0.18 320)",  // Pink
  "oklch(0.65 0.2 260)",  // Blue-purple
  "oklch(0.7 0.15 160)",  // Green
  "oklch(0.75 0.12 60)",  // Yellow
  "oklch(0.68 0.16 40)",  // Orange
  "oklch(0.6 0.2 320)",   // Deep pink
]

interface MathElement {
  id: number
  symbol: string
  x: number
  y: number
  opacity: number
  size: number
  rotation: number
  color: string
  animationDelay: number
}

export function MathBackground() {
  const [elements, setElements] = useState<MathElement[]>([])

  useEffect(() => {
    const generateElements = () => {
      const newElements: MathElement[] = []
      for (let i = 0; i < 35; i++) {
        newElements.push({
          id: i,
          symbol: mathSymbols[Math.floor(Math.random() * mathSymbols.length)],
          x: Math.random() * 100,
          y: Math.random() * 100,
          opacity: Math.random() * 0.4 + 0.1, // Increased opacity for vibrant colors
          size: Math.random() * 32 + 18, // Larger size range
          rotation: Math.random() * 360,
          color: jetbrainsColors[Math.floor(Math.random() * jetbrainsColors.length)],
          animationDelay: Math.random() * 10,
        })
      }
      setElements(newElements)
    }

    generateElements()
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {elements.map((element) => (
        <div
          key={element.id}
          className="absolute font-mono select-none transition-all duration-1000"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            opacity: element.opacity,
            fontSize: `${element.size}px`,
            color: element.color,
            transform: `rotate(${element.rotation}deg)`,
            animation: `jetbrains-float ${25 + Math.random() * 15}s infinite ease-in-out`,
            animationDelay: `${element.animationDelay}s`,
            textShadow: `0 0 20px ${element.color}40, 0 0 40px ${element.color}20`,
          }}
        >
          {element.symbol}
        </div>
      ))}
      <style jsx>{`
        @keyframes jetbrains-float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          25% {
            transform: translateY(-30px) rotate(90deg) scale(1.1);
          }
          50% {
            transform: translateY(-15px) rotate(180deg) scale(0.9);
          }
          75% {
            transform: translateY(-40px) rotate(270deg) scale(1.05);
          }
        }
        
        @keyframes gradient-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  )
}
