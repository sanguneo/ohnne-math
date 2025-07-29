"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Home } from "lucide-react"

interface BackHeaderProps {
  title?: string
  subtitle?: string
  onBack?: () => void
  showHome?: boolean
}

export default function Header({
   title = "온느수학",
   onBack,
   showHome = true,
 }: BackHeaderProps) {
  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      window.history.back()
    }
  }

  const handleHome = () => {
    window.location.href = "/"
  }

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b-2 border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
            <ArrowLeft className="w-6 h-6" onClick={handleBack}/>

          {/* Title */}
          <div className="text-center flex-1 mx-4">
            <h1 className="text-lg sm:text-xl font-bold text-gray-800">{title}</h1>
          </div>

          {/* Home Button */}
          {showHome && (<Home className="w-6 h-6" onClick={handleHome}/>)}
        </div>
      </div>
    </header>
  )
}
