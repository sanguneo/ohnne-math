"use client";

import { Link } from "react-router";
import { X } from "lucide-react";

interface NavigationDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function NavigationDrawer({ open, onClose }: NavigationDrawerProps) {
  return (
    <div className={`fixed inset-0 z-40 ${open ? "" : "pointer-events-none"}`}>
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <nav
        className={`absolute left-0 top-0 h-full w-64 bg-white rounded-r-2xl shadow-xl transform transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 space-y-6">
          <button onClick={onClose} className="flex items-center gap-2 text-gray-600">
            <X className="w-5 h-5" /> 닫기
          </button>
          <ul className="space-y-4 text-lg">
            <li>
              <Link to="/" onClick={onClose} className="block hover:text-blue-600">
                홈
              </Link>
            </li>
            <li>
              <Link to="/english" onClick={onClose} className="block hover:text-blue-600">
                영어
              </Link>
            </li>
            <li>
              <Link to="/math" onClick={onClose} className="block hover:text-blue-600">
                수학
              </Link>
            </li>
            <li>
              <Link to="/settings" onClick={onClose} className="block hover:text-blue-600">
                설정
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}
