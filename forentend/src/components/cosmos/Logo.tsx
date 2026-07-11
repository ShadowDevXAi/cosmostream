import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 selection:bg-transparent group ${className}`}>
      
      {/* 🪐 ORBITAL HIGH-TECH SYSTEM ICON */}
      <div className="relative h-9 w-9 shrink-0">
        {/* Core Outer Plasma Ring Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-500 to-pink-500 animate-pulse shadow-[0_0_15px_rgba(168,85,247,0.25)] transition-transform duration-500 group-hover:scale-105" />
        
        {/* Deep Isolated Base Dark Layer Mask */}
        <div className="absolute inset-[3px] rounded-full bg-[#0c0d14]" />
        
        {/* Inner Engine Plasma Node Vector */}
        <div className="absolute inset-[7px] rounded-full bg-gradient-to-br from-purple-500 to-pink-500 opacity-80 group-hover:opacity-100 transition-all duration-300 group-hover:scale-90" />
      </div>
      
      {/* 📄 SYSTEM TYPOGRAPHY MATRICES LABEL */}
      <div className="leading-none select-none font-mono">
        <div className="text-sm font-black tracking-wider uppercase bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
          Cosmos
        </div>
        <div className="text-[9px] uppercase tracking-[0.25em] text-purple-400/80 mt-0.5 font-bold">
          Media Cloud
        </div>
      </div>

    </Link>
  );
}
