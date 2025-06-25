"use client"

import type { ReactNode } from "react"

interface AnimatedBorderBoxProps {
  children: ReactNode
  className?: string
  delay?: number
}

export const AnimatedBorderBox = ({ children, className = "", delay = 0 }: AnimatedBorderBoxProps) => {
  return (
    <div className="relative group">
      {/* Animated background for the border effect */}
      <div
        className="absolute -inset-0.5 bg-gradient-to-r from-[#00d4ff] via-[#c77dff] to-[#ff00dd] rounded-xl opacity-75 group-hover:opacity-100 blur-sm group-hover:blur-md transition-all duration-1000 animate-gradient-x"
        style={{
          animationDelay: `${delay}s`,
        }}
      />

      {/* Dark border to create the "pipe" effect */}
      <div className="absolute -inset-[1px] bg-[#050a14] rounded-xl z-[1]" />

      {/* Animated inner border */}
      <div
        className="absolute -inset-[2px] bg-gradient-to-r from-[#00d4ff] via-[#c77dff] to-[#ff00dd] rounded-xl z-[2] opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x"
        style={{
          animationDelay: `${delay + 0.2}s`,
          clipPath:
            "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 2px 2px, 2px calc(100% - 2px), calc(100% - 2px) calc(100% - 2px), calc(100% - 2px) 2px, 2px 2px)",
        }}
      />

      {/* Content container */}
      <div className={`relative bg-[#0a1525] rounded-lg z-10 ${className}`}>{children}</div>
    </div>
  )
}