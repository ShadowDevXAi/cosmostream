import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#06070a]/60 backdrop-blur-md font-sans">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        
        {/* BRAND IDENTITY LOGO NODE */}
        <Logo />
        
        {/* CENTRAL NAVIGATION STRIP */}
        <nav className="hidden items-center gap-8 text-xs font-mono font-medium tracking-wider uppercase text-muted-foreground/80 md:flex">
          <Link to="/" className="hover:text-purple-400 transition-colors">Features</Link>
          <Link to="/pricing" className="hover:text-purple-400 transition-colors">Pricing</Link>
          <Link to="/dashboard" className="hover:text-purple-400 transition-colors">Dashboard</Link>
          <Link to="/dashboard/api-keys" className="hover:text-purple-400 transition-colors">Developers</Link>
        </nav>
        
        {/* GATEWAY CONTROL INTERFACES */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-xs font-mono text-muted-foreground hover:text-white transition-colors" asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
          
          <Button asChild size="sm" className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-9 font-mono text-xs font-bold tracking-wider text-white rounded-xl shadow-lg shadow-purple-950/10 transition-all duration-300">
            <Link to="/dashboard">Launch App Node</Link>
          </Button>
        </div>

      </div>
    </header>
  );
}
