import * as React from "react"

import { cn } from "@/shared/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-gray-400 selection:bg-blue-600 selection:text-white flex h-12 w-full rounded-xl border border-gray-300 bg-white/70 px-4 py-2 text-base shadow-inner transition-[color,box-shadow] backdrop-blur-sm outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-200",
        "aria-invalid:border-red-500 aria-invalid:focus-visible:ring-red-200",
        className
      )}
      {...props}
    />
  )
}

export { Input }
