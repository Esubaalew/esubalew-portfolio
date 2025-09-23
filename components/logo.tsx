interface LogoProps {
  size?: number
  className?: string
}

export function Logo({ size = 32, className = "" }: LogoProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="oklch(0.65 0.18 280)" />
          <stop offset="50%" stopColor="oklch(0.7 0.15 300)" />
          <stop offset="100%" stopColor="oklch(0.6 0.2 320)" />
        </linearGradient>
      </defs>
      
      {/* Background Circle */}
      <circle 
        cx="50" 
        cy="50" 
        r="45" 
        fill="url(#logoGradient)" 
        stroke="oklch(0.8 0.1 290)" 
        strokeWidth="2"
      />
      
      {/* Letter E */}
      <path 
        d="M25 30 L25 70 M25 30 L40 30 M25 50 L35 50 M25 70 L40 70" 
        stroke="white" 
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Dot separator */}
      <circle cx="50" cy="50" r="2" fill="white" />
      
      {/* Letter C */}
      <path 
        d="M75 35 Q65 30 60 40 Q60 50 60 60 Q65 70 75 65" 
        stroke="white" 
        strokeWidth="4" 
        strokeLinecap="round" 
        fill="none"
      />
    </svg>
  )
}

export function LogoText({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Logo size={28} />
      <span className="font-mono text-lg font-medium">esubalew.chekol</span>
    </div>
  )
}
