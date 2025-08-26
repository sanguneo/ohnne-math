"use client";

import { useState } from "react";
import Header from "./Header";
import NavigationDrawer from "./NavigationDrawer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Header onMenu={() => setOpen(true)} />
      <NavigationDrawer open={open} onClose={() => setOpen(false)} />
      {children}
    </>
  );
}
