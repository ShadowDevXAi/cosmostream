import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          // Expanded canvas cushions to support elegant alpha-frosted boxes with crisp monospace weights
          "flex min-h-[80px] w-full rounded-xl border border-white/10 bg-white/[0.01] px-4 py-3 font-mono text-xs text-neutral-100 shadow-inner transition-all duration-300 resize-y " +
          "placeholder:text-muted-foreground/40 " +
          // Intercepted multi-line text blocks active boundaries to execute premium purple glow vectors
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
Textarea.displayName = "Textarea";

export { Textarea };
