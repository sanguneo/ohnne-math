"use client"

import { ArrowLeft, Home, Menu, Bell, User, BookOpen } from "lucide-react"

interface BackHeaderProps {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  showHome?: boolean;
  onMenu?: () => void;
}

export default function Header({
  title = "학습앱",
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
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onMenu && (
              <Menu
                className="w-6 h-6 cursor-pointer"
                onClick={onMenu}
              />
            )}
            {onBack && (
              <ArrowLeft
                className="w-6 h-6 cursor-pointer"
                onClick={handleBack}
              />
            )}
          </div>

          <div className="flex items-center gap-2 text-center flex-1 justify-center">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            <h1 className="text-lg font-bold text-gray-800">{title}</h1>
          </div>

          <div className="flex items-center gap-3">
            {showHome && (
              <Home
                className="w-5 h-5 cursor-pointer"
                onClick={handleHome}
              />
            )}
            <Bell className="w-5 h-5 text-gray-600" />
            <div className="p-[2px] rounded-full bg-gradient-to-br from-indigo-400 to-purple-500">
              <div className="bg-white rounded-full p-1">
                <User className="w-4 h-4 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
