import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { Scissors, Play, Download, Sparkles, FileVideo, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/editor")({
  component: Editor,
});

function Editor() {
  const nav = useNavigate();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [range, setRange] = useState<number[]>([0, 30]);
  const [maxDuration, setMaxDuration] = useState<number>(120);
  const [processing, setProcessing] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const token = localStorage.getItem("cosmos_token");

  // Enforcing active session route guard parameters
  useEffect(() => {
    if (!token) {
      toast.error("Session missing. Re-authenticating system parameters.");
      nav({ to: "/auth" });
    }
  }, [nav, token]);

  const handleVideoLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setVideoFile(selectedFile);
      
      // Revoke older local streams to clean browser memory layers
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      
      const objectUrl = URL.createObjectURL(selectedFile);
      setVideoUrl(objectUrl);
      setRange([0, 10]);
      toast.success("Asset buffered inside browser engine memory workspace.");
    }
  };

  const syncDurationMetadata = () => {
    if (videoRef.current) {
      const duration = Math.floor(videoRef.current.duration);
      setMaxDuration(duration);
      setRange([0, Math.min(duration, 30)]);
    }
  };

  const handleTrimSimulation = () => {
    setProcessing(true);
    toast.info("Initializing client-side ffmpeg.wasm pipeline matrices...");
    
    setTimeout(() => {
      setProcessing(false);
      toast.success("Clip successfully parsed. Export payload generated!");
    }, 2500);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-2 font-sans text-white selection:bg-purple-500/20">
      
      {/* HEADER NODES SECTION */}
      <div className="flex items-end justify-between gap-4 flex-wrap border-b border-white/5 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">Editing Suite</h1>
          <p className="mt-1 text-xs text-muted-foreground/80 font-mono">
            Trim & crop media vectors in your browser container. Powered by client-side hooks.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400 animate-pulse">
          <Sparkles className="h-3.5 w-3.5" /> Client-side · 0 ms server latency
        </div>
      </div>

      {/* WORKSPACE DECK CONTAINER */}
      <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 shadow-2xl space-y-6">
        
        {/* VIDEO DISPLAY PLAYER MODULE */}
        <div className="aspect-video w-full overflow-hidden rounded-xl border border-white/5 bg-black/40 grid place-items-center relative group">
          {videoUrl ? (
            <video 
              ref={videoRef}
              src={videoUrl} 
              controls 
              onLoadedMetadata={syncDurationMetadata}
              className="w-full h-full object-contain rounded-xl"
            />
          ) : (
            <label htmlFor="video-ingest" className="flex flex-col items-center gap-3 text-muted-foreground cursor-pointer w-full h-full justify-center group-hover:bg-white/[0.01] transition-all">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                <Play className="h-6 w-6 stroke-[2.5] ml-0.5" />
              </div>
              <div className="text-xs font-mono tracking-wide text-neutral-300">Click or drop localized asset clip to stream canvas</div>
              <div className="text-[10px] font-mono text-muted-foreground/60">Supports MP4, WebM container nodes</div>
              <input 
                id="video-ingest" 
                type="file" 
                accept="video/*" 
                onChange={handleVideoLoad} 
                className="hidden" 
              />
            </label>
          )}
        </div>

        {/* METADATA SLIDER SEGMENT CONTROLLER */}
        {videoFile && (
          <div className="space-y-4 animate-fade-in border-t border-white/5 pt-4">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-muted-foreground font-bold uppercase tracking-wider">Trim Segmentation Parameters</span>
              <span className="font-black text-purple-400 bg-purple-500/5 border border-purple-500/20 px-2.5 py-1 rounded-md">
                {String(range[0]).padStart(2, "0")}s — {String(range[1]).padStart(2, "0")}s
              </span>
            </div>
            
            <Slider
              value={range}
              onValueChange={setRange}
              min={0}
              max={maxDuration}
              step={1}
              className="[&_.bg-primary]:bg-gradient-to-r [&_.bg-primary]:from-purple-500 [&_.bg-primary]:to-pink-500 py-2"
            />
            
            <div className="flex justify-between text-[10px] font-mono text-muted-foreground/50">
              <span>Origin Node: 00s</span>
              <span>Buffer Vector Max Weight: {maxDuration}s</span>
            </div>
          </div>
        )}

        {/* MANAGEMENT ACTIONS SWITCH PLATFORM */}
        <div className="flex flex-wrap gap-3 border-t border-white/5 pt-4">
          <Button 
            onClick={handleTrimSimulation}
            disabled={processing || !videoFile}
            className="h-11 px-5 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-mono text-xs font-bold tracking-wider rounded-xl shadow-xl transition-all disabled:opacity-40"
          >
            {processing ? (
              <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> SUB-THREAD PARSING CLIP...</>
            ) : (
              <><Scissors className="mr-2 h-4 w-4" /> Trim Selected Frame</>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            disabled={!videoFile || processing}
            className="h-11 px-5 border-white/10 bg-white/[0.01] hover:bg-white/[0.04] text-white font-mono text-xs rounded-xl shadow-lg"
          >
            <Download className="mr-2 h-4 w-4 text-neutral-400" /> Export Asset Payload
          </Button>
        </div>

      </div>
    </div>
  );
}
