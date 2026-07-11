import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { ShieldAlert, Home, RefreshCw, Sparkles } from "lucide-react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";

// Premium Cosmic 404 Viewport Interface
function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#06070a] px-6 text-white font-sans selection:bg-purple-500/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.03),transparent_50%)]" />
      
      <div className="max-w-md w-full bg-white/[0.01] border border-white/5 rounded-2xl p-8 text-center backdrop-blur-xl relative z-10 shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
        
        <h1 className="text-7xl font-black font-mono tracking-tighter bg-gradient-to-r from-white via-neutral-400 to-neutral-600 bg-clip-text text-transparent animate-pulse">
          404
        </h1>
        <h2 className="mt-4 text-sm font-mono font-bold uppercase tracking-widest text-purple-400">
          Orbit Node Mismatch
        </h2>
        <p className="mt-2 text-xs text-muted-foreground/80 font-mono leading-relaxed">
          The structural cluster resource path you are attempting to query does not exist or has been shifted across dimensions.
        </p>
        
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-mono text-xs font-bold tracking-wide shadow-xl transition-all"
          >
            <Home className="h-4 w-4" /> Return to Orbit Base
          </Link>
        </div>
      </div>
    </div>
  );
}

// Enterprise Core Crash Handler view with dynamic message dump logs
function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#06070a] px-6 text-white font-sans selection:bg-red-500/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.02),transparent_40%)]" />
      
      <div className="max-w-xl w-full bg-white/[0.01] border border-white/5 rounded-2xl p-8 backdrop-blur-xl relative z-10 shadow-2xl space-y-5">
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
        
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <div className="h-10 w-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
            <ShieldAlert className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-bold font-mono text-neutral-200 uppercase tracking-wide">
              Kernel Invariant Exception Intercepted
            </h1>
            <p className="text-[10px] font-mono text-muted-foreground/60">
              Thread execution boundary state corruption caught.
            </p>
          </div>
        </div>

        {/* SECURE ERROR LOGGING TRACE CONTAINER */}
        <div className="bg-black/40 border border-white/5 p-4 rounded-xl font-mono text-[11px] text-red-400 overflow-x-auto max-h-[160px] leading-relaxed shadow-inner">
          <div className="text-muted-foreground/50 uppercase text-[9px] font-bold tracking-wider mb-1">Exception Stack String:</div>
          {error.message || "Unknown runtime micro-kernel disruption."}
        </div>

        {/* CONTROL DECK ACTION SWITCH PANEL */}
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-gradient-to-r from-red-700 to-rose-600 hover:from-red-600 hover:to-rose-500 text-white font-mono text-xs font-bold tracking-wider shadow-lg transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Hot-Reload Pipeline
          </button>
          
          <a
            href="/"
            className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] text-neutral-200 font-mono text-xs font-bold tracking-wider transition-all"
          >
            <Home className="h-3.5 w-3.5 text-muted-foreground" /> Fallback Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Cosmos Media Cloud" },
      { name: "description", content: "Convert, host, edit and stream any media at light-speed." },
      { name: "theme-color", content: "#06070a" },
      { property: "og:title", content: "Cosmos Media Cloud" },
      { property: "og:description", content: "Convert, host, edit and stream any media at light-speed." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-[#06070a] antialiased min-h-screen">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <Toaster theme="dark" />
    </QueryClientProvider>
  );
}
