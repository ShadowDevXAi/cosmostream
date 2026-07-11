import { useEffect, useState } from "react";
import { Rocket, RefreshCw, Radio } from "lucide-react";
import { onCosmosWake } from "@/lib/cosmos-config";

export function WakeOverlay() {
  const [state, setState] = useState({ active: false, secondsLeft: 0, attempt: 0 });

  useEffect(() => {
    const off = onCosmosWake(setState);
    return () => {
      off();
    };
  }, []);

  if (!state.active) return null;

  // Calculating fluid telemetry baseline mapping matrices
  const totalDuration = 50;
  const pct = Math.max(0, Math.min(100, ((totalDuration - state.secondsLeft) / totalDuration) * 100));

  return (
    <div className="fixed inset-0 z-[200] grid place-items-center bg-[#06070a]/80 backdrop-blur-xl animate-fade-in text-white font-sans selection:bg-purple-500/20 select-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.03),transparent_60%)] pointer-events-none" />
      
      {/* CARD INTERFACE BOX */}
      <div className="bg-[#0c0d14]/60 border border-white/5 mx-4 w-full max-w-md rounded-2xl p-8 text-center relative shadow-2xl backdrop-blur-md">
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
        
        {/* ROCKET AMBIENT LOGO ENGINE */}
        <div className="relative inline-flex items-center justify-center mb-5">
          <div className="absolute h-14 w-14 rounded-full bg-purple-500/10 border border-purple-500/20 animate-ping opacity-40" />
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#12131e] to-black border border-white/5 flex items-center justify-center text-purple-400 shadow-md">
            <Rocket className="h-5 w-5 text-purple-400 animate-bounce stroke-[1.8]" />
          </div>
        </div>

        {/* STATUS CORE TYPOGRAPHY */}
        <h2 className="text-lg font-black font-mono uppercase tracking-wider text-neutral-100">
          Waking up Cosmos Engine
        </h2>
        
        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/5 px-2.5 py-0.5 text-[10px] font-mono font-bold text-amber-400 border border-amber-500/20 mt-2.5 uppercase tracking-wide">
          <Radio className="h-3 w-3 animate-pulse" />
          Cold Boot Sequence Pipeline Active
        </div>

        <p className="mt-4 text-xs font-mono text-muted-foreground/80 leading-relaxed max-w-sm mx-auto">
          Render cluster node is currently deploying container slots from temporary sleep state variables. Automated sequence retry (attempt {state.attempt}/2).
        </p>

        {/* PROGRESS SPEED BAR METER */}
        <div className="mt-6 space-y-2">
          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden p-0.5 border border-white/5 relative">
            <div 
              className="bg-gradient-to-r from-purple-600 via-indigo-500 to-pink-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(168,85,247,0.4)]" 
              style={{ width: `${pct}%` }}
            />
          </div>
          
          {/* SECONDS COUNTERS TICKER */}
          <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground/60 pt-0.5 px-0.5">
            <span className="flex items-center gap-1">
              <RefreshCw className="h-3 w-3 animate-spin text-purple-500/70" /> 
              Syncing clusters response...
            </span>
            <span className="font-bold text-purple-300 bg-purple-500/5 border border-purple-500/10 px-2 py-0.5 rounded-md">
              {state.secondsLeft}s remaining
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
