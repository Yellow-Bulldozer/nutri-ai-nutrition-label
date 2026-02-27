"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const liquidGlassButtonVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded-full font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-white border border-white/30 shadow-lg hover:shadow-2xl backdrop-blur-xl",
        primary:
          "bg-gradient-to-br from-emerald-400/20 to-emerald-400/10 hover:from-emerald-400/30 hover:to-emerald-400/20 text-emerald-300 border border-emerald-400/30 shadow-lg hover:shadow-emerald-500/30 backdrop-blur-xl",
        secondary:
          "bg-gradient-to-br from-blue-400/20 to-blue-400/10 hover:from-blue-400/30 hover:to-blue-400/20 text-blue-300 border border-blue-400/30 shadow-lg hover:shadow-blue-500/30 backdrop-blur-xl",
      },
      size: {
        default: "h-10 px-6 py-2 text-sm",
        sm: "h-8 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface LiquidGlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof liquidGlassButtonVariants> {
  asChild?: boolean;
}

const LiquidGlassButton = React.forwardRef<
  HTMLButtonElement,
  LiquidGlassButtonProps
>(
  (
    { className, variant, size, asChild = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          liquidGlassButtonVariants({ variant, size, className })
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
LiquidGlassButton.displayName = "LiquidGlassButton";

export { LiquidGlassButton, liquidGlassButtonVariants };
