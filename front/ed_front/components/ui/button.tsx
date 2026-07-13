import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "ghost" | "outline" | "pill"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Custom Slack styles applied manually to avoid heavy class-variance-authority setup for simple overrides
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    
    const variants = {
      default: "bg-primary-600 text-pure-white hover:bg-primary-700 rounded-lg", // vibrant primary CTA
      ghost: "bg-transparent text-primary-900 hover:bg-primary-50 rounded-lg", // ghost CTA
      outline: "border border-fog bg-transparent hover:bg-primary-50 hover:border-primary-300 text-carbon rounded-lg",
      pill: "bg-transparent text-primary-900 hover:bg-primary-50 rounded-full-5", // 9999px radius
    }
    
    const sizes = {
      default: "px-[1.5rem] py-[0.75rem]",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    }

    return (
      <Comp
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
