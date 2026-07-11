import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Expanded to robust h-11 heights with sleek alpha-frosted glass fills
          "flex h-11 w-full rounded-xl border border-white/10 bg-white/[0.01] px-4 py-2 font-mono text-xs text-neutral-100 shadow-inner transition-all duration-300 " +
          // Upgraded traditional file uploading indicators to use premium neon purple layout structures
          "file:border-0 file:bg-transparent file:font-mono file:text-xs file:font-bold file:text-purple-400 file:cursor-pointer " +
          "placeholder:text-muted-foreground/40 " +
          // Intercepted input focus layers to emit high-fidelity purple glow vectors
          "focus-visible:outline-none focus-visible:border-purple-500/40 focus-visible:ring-2 focus-visible:ring-purple-500/20 focus-visible:shadow-[0_0_15px_rgba(168,85,247,0.1)] " +
          "disabled:cursor-not-allowed disabled:opacity-25 md:text-xs",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
