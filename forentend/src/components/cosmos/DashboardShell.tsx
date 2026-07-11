// src/components/DashboardShell.tsx

import { Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { type ReactNode, useState, useEffect, cloneElement, isValidElement } from "react";
import {
  LayoutDashboard,
  Link2,
  Scissors,
  KeyRound,
  FolderOpen,
  Settings,
  UploadCloud,
  CreditCard,
  Menu,
  X,
  LogOut,
  Sparkles,
  User,
} from "lucide-react";
import { Logo } from "./Logo";
import { Stardust } from "./Stardust";
import { WakeOverlay } from "./WakeOverlay";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };

// 🪐 NAVIGATION REGISTRY
const navItems: NavItem[] = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/converter", label: "Media Upload", icon: UploadCloud },
  { to: "/dashboard/links", label: "URL Converter", icon: Link2 },
  { to: "/dashboard/library", label: "Library", icon: FolderOpen },
  { to: "/dashboard/editor", label: "Editor", icon: Scissors },
  { to: "/pricing", label: "Subscription", icon: CreditCard },
  { to: "/dashboard/api-keys", label: "API Keys", icon: KeyRound },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
  { to: "/profile", label: "My Profile", icon: User },
];

interface SidebarTelemetry {
  plan_name?: string;
  used?: number;
  limit?: number;
  current_usage_mb?: number;
  upload_limit_mb?: number;
  storage_used_mb?: number;
  storage_limit_mb?: number;
  storage_percentage?: number;
}

interface UserProfileData {
  name?: string;
  username: string;
  avatar_url?: string;
}

export function DashboardShell({ children }: { children?: ReactNode }) {
  const nav = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  
  const [telemetry, setTelemetry] = useState<SidebarTelemetry | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 GLOBAL FLATTENED CONTEXT STATES
  const [activeTierFramework, setActiveTierFramework] = useState<string>("Pulsar Free");
  const [maxCapacityMb, setMaxCapacityMb] = useState<number>(500);

  // 🔥 UPDATED CORE APP SERVER ROUTE TO CUSTOM DOMAIN
  const BACKEND_URL = "https://api.cosmostream.in";

  const fetchLiveSidebarMetrics = async () => {
    if (typeof window === "undefined") return;

    const sessionToken = localStorage.getItem("token") || localStorage.getItem("cosmos_token");
    const permanentApiKey = localStorage.getItem("api_key") || localStorage.getItem("cosmos_api_key");
    
    if (!sessionToken || sessionToken === "null" || sessionToken === "undefined") {
      return;
    }

    const requestHeaders: Record<string, string> = {};
    if (sessionToken) {
      requestHeaders["Authorization"] = `Bearer ${sessionToken.trim()}`;
    }

    if (permanentApiKey && permanentApiKey !== "null" && permanentApiKey !== "undefined" && !permanentApiKey.startsWith("cosmos_session_")) {
      requestHeaders["X-Cosmos-API-Key"] = permanentApiKey.trim();
      requestHeaders["X-API-Key"] = permanentApiKey.trim();
    }

    try {
      const res = await fetch(`${BACKEND_URL}/user/dashboard-telemetry`, {
        headers: requestHeaders
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // 🔥 SMART TELEMETRY ADAPTER BLOCK: Extracts direct flat root response or nested telemetry objects
        const extractedTelemetry = data.telemetry ? data.telemetry : data;
        
        const currentTier = data.active_tier_framework || extractedTelemetry.plan_name || "Pulsar Free";
        const currentLimit = data.max_capacity_mb || extractedTelemetry.upload_limit_mb || extractedTelemetry.storage_limit_mb || extractedTelemetry.limit || 500;
        
        setActiveTierFramework(currentTier);
        setMaxCapacityMb(currentLimit);
        setTelemetry(extractedTelemetry);
        setUserProfile(data.user_profile || null);
      }
    } catch (err) {
      console.error("Sidebar runtime metrics allocation streaming failure.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveSidebarMetrics();
  }, [pathname]);

  const executeSessionTermination = () => {
    if (!confirm("Are you sure you want to securely log out from your active session?")) return;
    
    localStorage.removeItem("token");
    localStorage.removeItem("cosmos_token");
    localStorage.removeItem("api_key");
    localStorage.removeItem("cosmos_api_key");
    localStorage.removeItem("api_secret");
    localStorage.removeItem("cosmos_username");
    
    toast.info("Session terminated securely.");
    nav({ to: "/auth" });
  };

  // 🧠 LIVE BULLETPROOF METRIC COMPUTATIONS (Bypasses any 0% widget frozen loops)
  const liveLimit = maxCapacityMb || telemetry?.upload_limit_mb || telemetry?.storage_limit_mb || telemetry?.limit || 500;
  const liveUsed = telemetry?.storage_used_mb || telemetry?.current_usage_mb || telemetry?.used || 0;
  const livePct = telemetry?.storage_percentage ?? (liveLimit > 0 ? (liveUsed / liveLimit) * 100 : 0);

  const limitLabel = liveLimit >= 1024 
    ? `${(liveLimit / 1024).toFixed(1)} GB` 
    : `${liveLimit} MB`;

  const usedLabel = liveUsed >= 1024
    ? `${(liveUsed / 1024).toFixed(2)} GB`
    : `${liveUsed.toFixed(1)} MB`;

  const welcomeMoniker = userProfile?.name || userProfile?.username || (typeof window !== "undefined" ? localStorage.getItem("cosmos_username") : "") || "Astronaut";

  return (
    <div className="relative min-h-screen bg-[#06070a] text-white font-sans selection:bg-purple-500/20 overflow-x-hidden antialiased">
      {/* BACKGROUND GRAPHICS */}
      <div className="hidden md:block pointer-events-none select-none isolation-isolate">
        <Stardust />
      </div>
      <WakeOverlay />
      
      <div className="flex min-h-screen relative w-full items-stretch">
        
        {/* 📱 MOBILE OVERLAY BLUR FILTER MESH */}
        {open && (
          <div 
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden transition-all duration-300 animate-fade-in"
            onClick={() => setOpen(false)}
          />
        )}
        
        {/* 🚀 RESPONSIVE SIDEBAR CORE */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-white/5 bg-[#0c0d14] md:bg-[#0c0d14]/95 md:backdrop-blur-xl transition-transform duration-300 will-change-transform ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col justify-between md:relative md:translate-x-0 md:sticky md:top-0 md:h-screen shrink-0 ${
            open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <div className="flex flex-col h-full overflow-y-auto standard-scroll justify-between">
            <div>
              {/* BRAND HEADER LAYER */}
              <div className="flex h-16 items-center justify-between border-b border-white/5 px-5 shrink-0">
                <Logo />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden text-muted-foreground hover:text-white rounded-xl h-9 w-9" 
                  onClick={() => setOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* NAVIGATION INTERFACES POOL */}
              <nav className="space-y-1 p-3">
                {navItems.map((item) => {
                  const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3 h-10 text-xs font-mono tracking-wide transition-all ${
                        active
                          ? "bg-gradient-to-r from-purple-600/20 via-indigo-600/10 to-transparent border border-purple-500/30 text-purple-400 font-bold shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]"
                          : "text-muted-foreground/80 hover:bg-white/[0.02] hover:text-white"
                      }`}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* DYNAMIC TELEMETRY FOOTER METRICS CORE */}
            <div className="p-3 border-t border-white/5 bg-black/20 space-y-3 font-mono text-[11px] shrink-0 mt-auto">
              <div className="bg-white/[0.01] border border-white/5 rounded-xl p-3.5 space-y-2 relative group">
                <div className="flex justify-between items-center text-[10px] text-muted-foreground font-bold uppercase tracking-wider gap-2">
                  <span className="truncate text-neutral-200">{activeTierFramework}</span>
                  {/* 🔥 Live Calculated Percentage Drop */}
                  <span className="text-purple-400 font-black shrink-0">{livePct.toFixed(1)}%</span>
                </div>
                
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(168,85,247,0.3)]" 
                    style={{ width: `${livePct}%` }}
                  />
                </div>
                
                <div className="flex justify-between items-center text-[10px] text-muted-foreground/60 pt-0.5 gap-2">
                  <span className="truncate">{loading ? "Syncing..." : `${usedLabel} / ${limitLabel}`}</span>
                  <Link to="/pricing" onClick={() => setOpen(false)} className="text-purple-400 hover:text-purple-300 font-bold transition-colors shrink-0">
                    Upgrade
                  </Link>
                </div>
              </div>

              <button 
                onClick={executeSessionTermination}
                className="w-full flex items-center justify-between px-3 h-9 rounded-lg border border-white/5 text-muted-foreground/70 hover:text-red-400 hover:bg-red-500/5 hover:border-red-500/20 transition-all font-sans text-xs cursor-pointer gap-2"
              >
                <span className="font-medium truncate">Terminate Session</span>
                <LogOut className="h-3.5 w-3.5 shrink-0" />
              </button>
            </div>
          </div>
        </aside>

        {/* 💻 MAIN APPLICATION VIEWPORT */}
        <div className="flex min-w-0 flex-1 flex-col layout-view-wrapper">
          
          {/* RESPONSIVE FLOATING HEADER STACK */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/5 bg-[#0c0d14] md:bg-[#0c0d14]/60 md:backdrop-blur-md px-4 sm:px-6 md:px-8 relative w-full gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-muted-foreground hover:text-white rounded-xl h-10 w-10 shrink-0" 
              onClick={() => setOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            {/* USER MONIKER */}
            <div className="hidden text-xs font-mono text-muted-foreground/80 lg:flex items-center gap-1.5 truncate">
              <Sparkles className="h-3.5 w-3.5 text-purple-400 animate-pulse shrink-0" />
              Welcome back, master <span className="text-purple-300 font-bold truncate max-w-[150px]">{welcomeMoniker}</span> Matrix Node ✨
            </div>
            
            {/* ACTIONS SYSTEM TIER */}
            <div className="flex items-center gap-2.5 ml-auto shrink-0 relative">
              <Button size="sm" variant="outline" className="hidden sm:inline-flex border-white/5 bg-white/[0.01] hover:bg-white/[0.04] text-white font-mono text-xs cursor-pointer h-8 rounded-lg" asChild>
                <Link to="/">Orbit Base</Link>
              </Button>
              
              <Link to="/profile" className="focus:outline-none">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-950 border border-white/10 flex items-center justify-center text-xs shadow-inner cursor-pointer hover:border-purple-500/50 hover:ring-2 hover:ring-purple-500/20 transition-all overflow-hidden shrink-0">
                  {userProfile?.avatar_url && userProfile.avatar_url.startsWith("http") ? (
                    <img src={userProfile.avatar_url} alt="Profile Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <span>{userProfile?.avatar_url || "🪐"}</span>
                  )}
                </div>
              </Link>
            </div>
          </header>
          
          {/* 🧩 GLOBAL CONTENT INJECTION VIEW ZONE */}
          <main className="flex-1 px-4 py-6 sm:px-6 md:px-8 overflow-y-auto standard-scroll w-full mx-auto max-w-[100rem]">
            {children ? (
              isValidElement(children) ? (
                cloneElement(children, { activeTierFramework, maxCapacityMb, telemetry } as any)
              ) : (
                children
              )
            ) : (
              <Outlet context={{ activeTierFramework, maxCapacityMb, telemetry }} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
