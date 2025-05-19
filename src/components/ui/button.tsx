// Importing React since we're writing JSX and defining a component.
import * as React from "react"

// Importing Slot from Radix UI to optionally render a child component instead of a native <button>.
import { Slot } from "@radix-ui/react-slot"

// Importing `cva` (Class Variance Authority) and `VariantProps` type to manage utility class variants in a scalable way.
import { cva, type VariantProps } from "class-variance-authority"


// Importing a helper function `cn` (usually a class name combiner) from a utilities file.
import { cn } from "@/lib/utils"


// Defining `buttonVariants` using the `cva` utility to manage conditional Tailwind classes
const buttonVariants = cva(
    // Base classes applied to all buttons regardless of variant or size
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      // 'variant' defines different visual styles for the button
      variant: {
        default:
          // Default button style with primary colors and slight hover darkening
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          // Destructive style for actions like delete, with red tones
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          // Outline style, often used for secondary actions
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          // Secondary style with softer tones than primary
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          // Minimalist style with hover effects but no background
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      // 'size' defines differnet sizing options for the button
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        // Default size with padding and height
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      // default variant and size if none is specified
      variant: "default",
      size: "default",
    },
  }
)

// Defining the Button componenet using Typescript 
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & // Merges default <button> props
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
    // If `asChild` is true, use Slot (Radix UI component) to inherit the parent component
  // Otherwise, render a standard <button>
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

// Exporting both the Button component and the buttonVariants function
// `buttonVariants` can be reused elsewhere (e.g., for styling links like buttons)
export { Button, buttonVariants }
