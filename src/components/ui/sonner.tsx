"use client"

import { useTheme } from "next-themes"
import { Toaster as SonnerToaster, toast as sonnerToast, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <SonnerToaster
      theme={theme as ToasterProps["theme"]}
      position="bottom-center"
      className="la-toaster"
      icons={{
        success: <CircleCheckIcon className="w-4.5 h-4.5" />,
        info: <InfoIcon className="w-4.5 h-4.5" />,
        warning: <TriangleAlertIcon className="w-4.5 h-4.5" />,
        error: <OctagonXIcon className="w-4.5 h-4.5" />,
        loading: <Loader2Icon className="w-4.5 h-4.5 animate-spin" />,
      }}
      style={{ "--width": "fit-content" } as React.CSSProperties}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "la-toast",
          icon: "la-toast-icon",
          title: "la-toast-message",
          description: "la-toast-message",
        },
      }}
      {...props}
    />
  )
}

export { sonnerToast as toast }
export default Toaster
