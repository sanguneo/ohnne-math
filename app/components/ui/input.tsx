import * as React from "react"
import { AlertCircle } from "lucide-react"

import { cn } from "~/shared/utils"

interface InputProps extends React.ComponentProps<"input"> {
  label?: string
  icon?: React.ComponentType<{ className?: string; size?: number }>
  error?: string
  wrapperClassName?: string
}

function Input({
  className,
  type,
  label,
  icon: Icon,
  error,
  wrapperClassName,
  ...props
}: InputProps) {
  return (
    <div className={cn("space-y-2", wrapperClassName)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        )}
        <input
          type={type}
          data-slot="input"
          className={cn(
            "w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-4 bg-white shadow-sm transition-all file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
            Icon ? "pl-11" : "",
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
              : "border-gray-200 focus:border-blue-500 focus:ring-blue-200",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <AlertCircle size={16} className="mr-1" />
          {error}
        </p>
      )}
    </div>
  )
}

export { Input }

