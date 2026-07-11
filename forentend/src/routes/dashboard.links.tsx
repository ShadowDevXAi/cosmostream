// src/routes/dashboard.links.tsx

import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Link2, Copy, Check, ExternalLink, RefreshCw, Sparkles, HardDriveDownload, MonitorSmartphone, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getApiKey } from "@/lib/cosmos-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/links")({
  head: () => ({
    title: "URL Cloud Converter — Cosmos Media Cloud",
  }),
  component: Links,
});

interface CloudAssetPayload {
  asset_id: string;
  file_name: string;
  file_size_mb: number;
  cloud_url: string;
}

function Links() {
  const nav = useNavigate();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [latestAsset, setLatestAsset] = useState<CloudAssetPayload | null>(null);
  const [remainingDownloads, setRemainingDownloads] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const BACKEND_URL = "https://shadowapiweb.onrender.com";

  // 🔑 SAFE MULTI-CHANNEL RECOVERY: Dynamic identification extraction matching local storage states
  const sessionToken = localStorage.getItem("token") || localStorage.getItem("cosmos_token") || getApiKey();
  const permanentApiKey = localStorage.getItem("api_key") || localStorage.getItem("cosmos_api_key");

  // Enforcing active session router guard parameters strictly
  useEffect(() => {
    if (!sessionToken || sessionToken === "null" || sessionToken === "undefined") {
      toast.error("Session missing. Re-authenticating system parameters.");
      nav({ to: "/auth" });
    }
  }, [nav, sessionToken]);

  // ⚡ CORE CONVERSION ENGINE EXECUTION TRIGGER
  const handleLinkConversion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setLatestAsset(null);
    toast.loading("Deploying remote network extractors to capture media stream...");
    
    // Dynamically assemble secure explicit headers matrix
    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json"
    };

    if (sessionToken) {
      requestHeaders["Authorization"] = `Bearer ${sessionToken.trim()}`;
    }

    // 🚨 CRITICAL BUG CORRECTION SHIELD: 
    // Append permanent API key ONLY if it exists and is distinct from the session token.
    // Prevents session token from overlapping inside X-API-Key field which triggers backend 401 drops.
    if (permanentApiKey && permanentApiKey !== "null" && permanentApiKey !== "undefined" && !permanentApiKey.startsWith("cosmos_session_")) {
      requestHeaders["X-Cosmos-API-Key"] = permanentApiKey.trim();
      requestHeaders["X-API-Key"] = permanentApiKey.trim();
    }
    
    try {
      const response = await fetch(`${BACKEND_URL}/converter/process-link`, {
        method: "POST",
        headers: requestHeaders,
        body: JSON.stringify({ url: url.trim() }),
      });
      
      const data = await response.json();
      toast.dismiss();

      if (response.ok && data.success) {
        toast.success("🎉 Processed! Video successfully mirror-synchronized to your cloud pool.");
        setLatestAsset(data.asset);
        if (data.remaining_downloads !== undefined) {
          setRemainingDownloads(data.remaining_downloads);
        }
        setUrl("");
      } else {
        // Automatically captures age-gate blocks (403) or plan storage limit blocks (400) from Python layer
        toast.error(data.detail || "Quota allocation dropped link conversion extraction loop.");
      }
    } catch (err: any) {
      toast.dismiss();
      toast.error("Failed connecting to conversion server clusters.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 📱 DEVICE RESTORE TUNNEL BRIDGE METHOD
  const triggerDeviceRestore = (cloudUrl: string, filename: string) => {
    toast.success("📥 Initializing secure tunnel sync to device memory...");
    const dynamicAnchor = document.createElement("a");
    dynamicAnchor.href = cloudUrl;
    dynamicAnchor.setAttribute("download", filename);
    document.body.appendChild(dynamicAnchor);
    dynamicAnchor.click();
    document.body.removeChild(dynamicAnchor);
  };

  const copyNodeAddress = async () => {
    if (!latestAsset?.cloud_url) return;
    await navigator.clipboard.writeText(latestAsset.cloud_url);
    setCopied(true);
    toast.success("Streaming node link cloned to clipboard.");
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-2 font-sans text-white selection:bg-purple-500/20">
      
      {/* HEADER NODES SUMMARY */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            URL Stream Converter
          </h1>
          <p className="mt-1 text-xs text-muted-foreground/80 font-mono">
            Paste any external video or social media link — we ingest and mirror it into your secure decentralized cloud storage allocation.
          </p>
        </div>
        
        {/* REMAINING ACCOUNT PLAN TIER TRACKER HUD */}
        {remainingDownloads !== null && (
          <div className="sm:self-center bg-purple-950/40 border border-purple-500/20 text-purple-300 text-[10px] font-mono font-bold px-4 py-1.5 rounded-xl h-fit shadow-lg shrink-0">
            REMAINING TIER DOWNLOADS: {remainingDownloads}
          </div>
        )}
      </div>

      {/* CORE INPUT ACTION DECK */}
      <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <form onSubmit={handleLinkConversion} className="flex flex-col gap-3 sm:flex-row items-stretch">
          <div className="relative flex-1">
            <Link2 className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="url"
              disabled={loading}
              placeholder="Paste video link (e.g., YouTube, Instagram, Stream sites, Explicit networks...)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="pl-10 h-12 bg-black/40 border-white/5 rounded-xl text-xs font-mono text-purple-300 focus-visible:border-purple-500/30 focus-visible:ring-0 placeholder:text-muted-foreground/30"
              required
            />
          </div>
          
          <Button
            type="submit"
            disabled={!url.trim() || loading}
            className="h-12 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 font-mono text-xs font-bold tracking-wider px-6 text-white rounded-xl shadow-xl disabled:opacity-40 transition-all duration-300 cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-1.5">
                <RefreshCw className="h-4 w-4 animate-spin text-white" /> MINING STREAM...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" /> SYNC TO COSMOS CLOUD
              </span>
            )}
          </Button>
        </form>

        {/* COMPLIANCE AGE-GATE REGULATORY NOTICE FOOTER */}
        <div className="flex items-start gap-1.5 text-[10px] text-muted-foreground/40 mt-3 font-mono leading-relaxed">
          <ShieldAlert className="h-3.5 w-3.5 text-neutral-600 shrink-0 mt-0.5" />
          <span>Notice: Dynamic content verification filters are actively parsing inbound targets. Age verification parameters are calculated via your database DOB registry token. Access to explicit material requires identity classification metrics of 18+.</span>
        </div>

        {/* OUTPUT MATRIX RENDER SLOT CONTAINER */}
        {latestAsset && (
          <div className="mt-6 rounded-xl border border-purple-500/10 bg-purple-500/[0.01] p-5 space-y-4 shadow-xl animate-fade-in">
            <div className="text-[10px] font-mono font-bold tracking-widest text-purple-400 uppercase flex items-center gap-1.5">
              <MonitorSmartphone className="h-4 w-4 text-purple-400" />
              CLOUD REPOSITORY ACTIVE NODE MAPPED
            </div>
            
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border border-white/5 bg-black/40 p-4 rounded-xl">
              <div className="space-y-1 truncate">
                <div className="text-white font-bold text-xs truncate max-w-md">{latestAsset.file_name}</div>
                <div className="text-muted-foreground/50 text-[10px] font-mono">Allocation Size Cluster: {latestAsset.file_size_mb} MB</div>
              </div>
              
              {/* ACTION PACK CONTROL BUTTONS LAYER */}
              <div className="flex flex-wrap gap-2 shrink-0">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-10 px-4 border-white/10 font-mono text-xs bg-white/[0.01] text-white cursor-pointer hover:bg-white/5" 
                  onClick={copyNodeAddress}
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-400 mr-1" /> : <Copy className="h-4 w-4 mr-1 text-purple-400" />}
                  Copy Node URL
                </Button>
                
                {/* 📥 DYNAMIC MOBILE SYNC TERMINAL OPERATION */}
                <Button
                  size="sm"
                  onClick={() => triggerDeviceRestore(latestAsset.cloud_url, latestAsset.file_name)}
                  className="h-10 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-mono text-xs cursor-pointer flex items-center gap-1.5"
                >
                  <HardDriveDownload className="h-4 w-4" /> Restore to Phone
                </Button>
                
                <a href={latestAsset.cloud_url} target="_blank" rel="noreferrer">
                  <Button size="sm" variant="ghost" className="h-10 px-3 border border-white/5 text-muted-foreground hover:text-white font-mono text-xs cursor-pointer">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>
            
            <p className="text-[10px] text-muted-foreground/40 text-center font-mono leading-relaxed">
              Extraction transaction logged under hash asset ID: <code className="text-neutral-500">{latestAsset.asset_id}</code>. Quota exhaustion tracker is synchronized. If limits are hit, upgrade parameters on the <Link to="/pricing" className="text-purple-400 hover:underline font-black">Subscription Interface</Link>.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
