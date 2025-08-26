"use client"

import { ArrowLeft, Home, Menu } from "lucide-react"

interface BackHeaderProps {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  showHome?: boolean;
  onMenu?: () => void;
}

export default function Header({
  title = "온느수학",
  onBack,
  showHome = true,
  onMenu,
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
      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onMenu && (
              <Menu
                className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer"
                onClick={onMenu}
              />
            )}
            <ArrowLeft
              className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer"
              onClick={handleBack}
            />
          </div>

          {/* Title */}
          <div className="text-center flex-1 mx-4">
            <h1 className="text-lg sm:text-xl font-bold text-gray-800">{title}</h1>
          </div>

          {/* Home Button */}
          {showHome && (
            <Home
              className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer"
              onClick={handleHome}
            />
          )}
        </div>
      </div>
    </header>
  )
}
