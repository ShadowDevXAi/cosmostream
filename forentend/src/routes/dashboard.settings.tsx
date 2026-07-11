import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, RefreshCw, LogOut, KeyRound, User, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({ meta: [{ title: "Settings — Cosmos Media Cloud" }] }),
  component: Settings,
});

interface SettingsTelemetry {
  plan_name: string;
  sub_api_key: string;
  storage_used_mb: number;
  storage_limit_mb: number;
}

function Settings() {
  const nav = useNavigate();
  const [telemetry, setTelemetry] = useState<SettingsTelemetry | null>(null);
  const [loading, setLoading] = useState(true);
  const [rotating, setRotating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const token = localStorage.getItem("cosmos_token");
  const BACKEND_URL = "https://shadowapiweb.onrender.com";

  // Fetch real-time account verification and session settings matrices
  const loadUserSettingsCluster = async () => {
    if (!token) { nav({ to: "/auth" }); return; }
    try {
      const res = await fetch(`${BACKEND_URL}/user/dashboard-telemetry`, {
        headers: { "X-API-Key": token }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTelemetry(data.telemetry);
      }
    } catch (err) {
      console.error("Failed to stream account configuration settings nodes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserSettingsCluster();
  }, []);

  const handleClipboardCopy = async () => {
    if (!telemetry?.sub_api_key) return;
    await navigator.clipboard.writeText(telemetry.sub_api_key);
    setCopied(true);
    toast.success("Security Sub-API Key copied to clipboard.");
    setTimeout(() => setCopied(false), 1800);
  };

  const triggerKeyRotationPipeline = async () => {
    if (!token) return;
    if (!confirm("🚨 Warning: Key rotate karne se aapke purane chalte hue scripts ka access band ho jayega. Continue?")) return;

    setRotating(true);
    try {
      const res = await fetch(`${BACKEND_URL}/user/generate-api-key`, {
        method: "POST",
        headers: { "X-API-Key": token }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("New cryptographic integration token generated successfully!");
        // Refresh configuration allocations
        loadUserSettingsCluster();
      }
    } catch (err) {
      toast.error("Cryptographic engine failed to register rotation signature.");
    } finally {
      setRotating(false);
    }
  };

  const executeSessionWipeOut = () => {
    if (!confirm("Bhai, kya aap platform se active session exit karna chahte hain?")) return;
    localStorage.removeItem("cosmos_token");
    toast.info("Session context deleted securely.");
    nav({ to: "/auth" });
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] bg-transparent flex items-center justify-center text-xs tracking-wider text-muted-foreground font-mono animate-pulse">
        <RefreshCw className="mr-2 h-4 w-4 animate-spin text-purple-500" />
        DECRYPTING SECURE SETTINGS WORKSPACE NODES...
      </div>
    );
  }

  const maskKeyNodeString = (k: string) => `${k.slice(0, 14)}${"•".repeat(16)}`;

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-1 font-sans text-white selection:bg-purple-500/20">
      
      {/* SETTINGS LAYER HEADER */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">System Settings</h1>
        <p className="mt-1 text-xs text-muted-foreground/80 font-mono">
          Manage system nodes parameters and private communication access keys.
        </p>
      </div>

      {/* USER MATRIC IDENTITY PLUG */}
      <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/10">
            <User className="h-5 w-5 stroke-[1.5]" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-neutral-100 flex items-center gap-2">
              Account Profile Connected
              <span className="text-[9px] font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                Active SSL
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground/70 font-mono mt-0.5">
              Assigned Tier Profile Node: <span className="text-purple-400 font-bold">{telemetry?.plan_name}</span>
            </p>
          </div>
        </div>
      </div>

      {/* SECURE SUB-API CRYPTO KEY EXP PANEL */}
      <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 shadow-2xl space-y-4 relative overflow-hidden">
        <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-purple-400 uppercase">
          <KeyRound className="h-4 w-4" /> Your Active Sub-API Token String
        </div>
        <p className="text-xs text-muted-foreground/80 leading-relaxed max-w-2xl">
          Pass this credential variable as an <code className="font-mono text-purple-400 font-bold">X-API-Key</code> request header value parameters block to authenticate programmatic media ingests.
        </p>

        <div className="flex items-center gap-2 rounded-xl bg-black/40 border border-white/5 p-2 pl-4">
          <code className="flex-1 truncate font-mono text-xs text-purple-300">
            {telemetry?.sub_api_key ? (revealed ? telemetry.sub_api_key : maskKeyNodeString(telemetry.sub_api_key)) : "—"}
          </code>
          
          <div className="flex items-center gap-1 shrink-0">
            <Button size="sm" variant="ghost" className="h-9 text-xs font-mono text-muted-foreground hover:text-white" onClick={() => setRevealed(!revealed)}>
              {revealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </Button>
            
            <Button
              size="sm"
              onClick={handleClipboardCopy}
              disabled={!telemetry?.sub_api_key}
              className={`h-9 font-mono text-xs px-4 rounded-lg transition-all ${copied ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-white/5 text-white hover:bg-white/10"}`}
            >
              {copied ? <Check className="mr-1 h-3.5 w-3.5" /> : <Copy className="mr-1 h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy Token"}
            </Button>
          </div>
        </div>

        {/* CORE PRIVILEGE CONTROLS ACTION SWITCHES */}
        <div className="flex gap-2 border-t border-white/5 pt-4">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={rotating}
            onClick={triggerKeyRotationPipeline} // 🔥 FIXED: Mapped correct function name hook here
            className="h-9 border-white/10 text-xs font-mono bg-white/[0.01] hover:bg-white/[0.04] text-white rounded-xl shadow-md"
          >
            <RefreshCw className={`mr-2 h-3.5 w-3.5 ${rotating ? 'animate-spin' : ''}`} /> 
            {rotating ? "Rotating Matrix..." : "Rotate Key Node"}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={executeSessionWipeOut}
            className="h-9 border-red-500/10 text-xs font-mono bg-red-500/5 hover:bg-red-500/10 text-red-400 rounded-xl shadow-md"
          >
            <LogOut className="mr-2 h-3.5 w-3.5" /> Sign Out Session
          </Button>
        </div>

      </div>

    </div>
  );
}
