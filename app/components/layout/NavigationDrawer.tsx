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
        className={`absolute left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 space-y-4">
          <button onClick={onClose} className="flex items-center gap-2">
            <X className="w-5 h-5" /> Close
          </button>
          <ul className="space-y-2">
            <li>
              <Link to="/" onClick={onClose} className="block py-1">
                Home
              </Link>
            </li>
            <li>
              <Link to="/math" onClick={onClose} className="block py-1">
                Math
              </Link>
            </li>
            <li>
              <Link to="/english" onClick={onClose} className="block py-1">
                English
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}
