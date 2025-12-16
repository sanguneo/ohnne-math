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
    <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onMenu && (
              <ButtonIcon onClick={onMenu}>
                <Menu className="w-6 h-6" />
              </ButtonIcon>
            )}
            {onBack && (
              <ButtonIcon onClick={handleBack}>
                <ArrowLeft className="w-6 h-6" />
              </ButtonIcon>
            )}
          </div>

          <div className="flex items-center gap-2 text-center flex-1 justify-center">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">{title}</h1>
          </div>

          <div className="flex items-center gap-3">
            {showHome && (
              <ButtonIcon onClick={handleHome}>
                <Home className="w-5 h-5" />
              </ButtonIcon>
            )}
            <ButtonIcon>
              <Bell className="w-5 h-5" />
            </ButtonIcon>
            <div className="p-0.5 rounded-full bg-gradient-to-br from-primary to-purple-500">
              <div className="bg-background rounded-full p-1">
                <User className="w-4 h-4 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

function ButtonIcon({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
    >
      {children}
    </button>
  );
}
