"use client";

import { Link } from "react-router";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function NavigationDrawer({ open, onClose }: NavigationDrawerProps) {
  return (
    <div className={`fixed inset-0 z-40 ${open ? "" : "pointer-events-none"}`}>
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`absolute left-0 top-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">Menu</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="닫기"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav>
            <ul className="space-y-1">
              <li>
                <Link
                  to="/"
                  onClick={onClose}
                  className="block rounded px-4 py-2 text-sm hover:bg-primary/10"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/math"
                  onClick={onClose}
                  className="block rounded px-4 py-2 text-sm hover:bg-primary/10"
                >
                  Math
                </Link>
              </li>
              <li>
                <Link
                  to="/english"
                  onClick={onClose}
                  className="block rounded px-4 py-2 text-sm hover:bg-primary/10"
                >
                  English
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </div>
  );
}
