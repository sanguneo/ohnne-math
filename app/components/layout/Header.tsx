"use client"

import { ArrowLeft, Home, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BackHeaderProps {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  showHome?: boolean;
  onMenu?: () => void;
}

export default function Header({
  title = "교육놀이터",
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
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-md">
      <div className="max-w-6xl mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-1">
          {onMenu && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenu}
              aria-label="메뉴 열기"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            aria-label="뒤로 가기"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
        <h1 className="text-lg font-medium">{title}</h1>
        {showHome ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleHome}
            aria-label="홈으로"
          >
            <Home className="h-5 w-5" />
          </Button>
        ) : (
          <span className="w-5" />
        )}
      </div>
    </header>
  )
}
