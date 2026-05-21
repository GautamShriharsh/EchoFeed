"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      richColors
      theme="dark"
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
     style={
            {
              "--normal-bg": "#0f172a",
              "--normal-text": "#f8fafc",
              "--normal-border": "rgba(255,255,255,0.08)",
              "--border-radius": "14px",
            } as React.CSSProperties
          }
      toastOptions={{
            classNames: {
            toast:
            "bg-[#111827] border border-white/10 text-white shadow-2xl",
            title: "text-white font-semibold",
            description: "text-gray-400",
            actionButton:
            "bg-white text-black hover:bg-gray-200",
            cancelButton:
            "bg-zinc-800 text-white hover:bg-zinc-700",
            },
          }}

      {...props}
    />
  )
}

export { Toaster }
