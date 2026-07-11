"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          // Remapped traditional notice panels into deep translucent space capsules layers
          toast:
            "group toast group-[.toaster]:rounded-2xl group-[.toaster]:border group-[.toaster]:border-white/10 group-[.toaster]:bg-[#0c0d14]/95 group-[.toaster]:text-neutral-100 group-[.toaster]:shadow-2xl group-[.toaster]:shadow-purple-950/40 group-[.toaster]:backdrop-blur-xl group-[.toaster]:font-mono group-[.toaster]:text-xs group-[.toaster]:p-4 select-none relative overflow-hidden",
          
          // Formatted alert text into tight uppercase mono tracking definitions
          title: "font-mono font-black tracking-wide text-neutral-200 text-xs",
          description: "group-[.toast]:text-muted-foreground/60 font-mono text-[11px] tracking-wide mt-1 leading-relaxed",
          
          // Infused premium cosmic gradient pools on action confirmation layout targets
          actionButton: 
            "group-[.toast]:bg-gradient-to-br group-[.toast]:from-purple-600 group-[.toast]:to-indigo-600 group-[.toast]:text-white group-[.toast]:font-bold group-[.toast]:rounded-xl group-[.toast]:transition-all group-[.toast]:duration-200 group-[.toast]:active:scale-95 group-[.toast]:border group-[.toast]:border-transparent group-[.toast]:shadow-lg group-[.toast]:shadow-purple-500/10 group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:text-xs cursor-pointer",
          
          // Synced cancel markers to run securely inside frosted alpha bounding tracks
          cancelButton: 
            "group-[.toast]:bg-white/5 group-[.toast]:text-neutral-300 group-[.toast]:font-medium group-[.toast]:rounded-xl group-[.toast]:border group-[.toast]:border-white/5 group-[.toast]:transition-all group-[.toast]:duration-200 hover:group-[.toast]:bg-white/10 hover:group-[.toast]:text-white group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:text-xs cursor-pointer",
        },
      }}
      {...props}
    >
      {/* Decorative linear trace component injected inside individual active nodes layout windows */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent pointer-events-none" />
    </Sonner>
  );
};

export { Toaster };
