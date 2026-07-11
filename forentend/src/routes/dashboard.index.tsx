import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HardDrive, Activity, Files, TrendingUp, UploadCloud, Link2, CreditCard, ArrowUpRight, RefreshCw, Download } from "lucide-react";
import { cosmos } from "@/lib/cosmos-config";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/")({
  component: Overview,
});

// Enterprise Telemetry Schema Matrix
type TelemetryData = {
  plan_name?: string;
  used?: number;
  limit?: number;
  current_usage_mb?: number;
  upload_limit_mb?: number;
  storage_used_mb?: number;
  storage_limit_mb?: number;
  storage_percentage?: number;
  storage_remaining_mb?: number;
  lifetime_requests?: number;
  lifetime_requests_count?: number;
  bandwidth_used_gb?: number;
  total_files_count?: number;
  sub_api_key?: string;
  downloads_used?: number;   
  download_limit?: number;   
};

type BackendResponse = {
  success: boolean;
  telemetry?: TelemetryData;
} & TelemetryData;

function Overview() {
  const nav = useNavigate();
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLiveTelemetryCluster = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("cosmos_token") : null;

    if (!token) {
      nav({ to: "/auth" });
      return;
    }
    setError(null);
    try {
      const { data } = await cosmos.get<BackendResponse>("/user/dashboard-telemetry", {
        headers: {
          "X-API-Key": token
        }
      });
      
      if (data && data.success) {
        const extractedData = data.telemetry ? data.telemetry : data;
        setTelemetry(extractedData);
      } else {
        setError("Telemetry data stream corruption.");
      }
    } catch (err) {
      setError("Could not link to live telemetry cluster.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLiveTelemetryCluster();
  }, []);

  // 🧠 CRITICAL COMPUTATION GRID
  const limit = telemetry?.upload_limit_mb ?? telemetry?.storage_limit_mb ?? telemetry?.limit ?? 500;
  const used = telemetry?.storage_used_mb ?? telemetry?.current_usage_mb ?? telemetry?.used ?? 0;
  const pct = telemetry?.storage_percentage ?? (limit > 0 ? (used / limit) * 100 : 0);
  const remaining = telemetry?.storage_remaining_mb ?? Math.max(0, limit - used);
  
  const totalRequests = telemetry?.lifetime_requests_count ?? telemetry?.lifetime_requests ?? 0;
  const totalFiles = telemetry?.total_files_count ?? 0;
  const planName = telemetry?.plan_name ?? "Pulsar Free";
  const bandwidth = telemetry?.bandwidth_used_gb ?? 0;

  // 🔥 DOWNLOAD LIMIT COMPUTATION TRACKERS (Updated strictly to 5 DLs/day fallback)
  const dlsUsed = telemetry?.downloads_used ?? 0;
  const dlsLimit = telemetry?.download_limit ?? 5; // Strict 5 downloads per day constraint
  const dlsPct = dlsLimit > 0 ? (dlsUsed / dlsLimit) * 100 : 0;
  const dlsRemaining = Math.max(0, dlsLimit - dlsUsed);

  const cards = [
    { 
      label: "Storage used", 
      value: `${used.toFixed(1)} MB`, 
      sub: `of ${limit >= 1024 ? `${(limit / 1024).toFixed(1)} GB` : `${limit} MB`}`, 
      icon: HardDrive,
      color: "text-purple-400"
    },
    { 
      label: "Downloads Counter", 
      value: `${dlsUsed} / ${dlsLimit} DLs`, // Shows "3 / 5 DLs" format
      sub: "Daily limit allocation", 
      icon: Download,
      color: "text-pink-400"
    },
    { 
      label: "Files Loaded", 
      value: String(totalFiles), 
      sub: "in your library collection", 
      icon: Files,
      color: "text-emerald-400"
    },
    { 
      label: "Bandwidth Weight", 
      value: `${bandwidth.toFixed(4)} GB`, 
      sub: "egress tracking this month", 
      icon: TrendingUp,
      color: "text-blue-400"
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] bg-transparent flex items-center justify-center text-xs tracking-wider text-neutral-400 font-mono animate-pulse">
        <RefreshCw className="mr-2 h-4 w-4 animate-spin text-purple-500" />
        SYNCING REAL-TIME AGGREGATION PARAMETERS...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto selection:bg-purple-500/30">
      {/* MISSION CONTROL HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">Mission Control</h1>
            <span className="text-[10px] bg-purple-500/10 border border-purple-500/30 text-purple-400 font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-widest animate-pulse">
              {planName}
            </span>
          </div>
          <p className="mt-1 text-sm text-neutral-400">Live telemetry metrics synchronized directly from the Cosmos engine cluster.</p>
        </div>
        
        <Button 
          onClick={loadLiveTelemetryCluster} 
          variant="outline" 
          className="h-9 border-white/10 text-xs font-mono bg-white/[0.01] hover:bg-white/[0.05] text-white cursor-pointer"
        >
          <RefreshCw className="mr-2 h-3.5 w-3.5 stroke-[1.5]" /> Refresh Telemetry
        </Button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs font-mono">
          ⚠️ Core Exception Intercepted: {error}
        </div>
      )}

      {/* INDUSTRIAL DATA METRICS CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-5 border border-white/5 bg-white/[0.01] hover:border-white/10 transition-colors shadow-xl group"
          >
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase">{s.label}</span>
              <s.icon className={`h-4 w-4 ${s.color} transition-transform group-hover:scale-110`} />
            </div>
            <div className={`mt-3 text-3xl font-black font-mono tracking-tight ${s.color}`}>{s.value}</div>
            <div className="mt-1 text-[11px] text-neutral-400/70 font-mono">{s.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* TWIN QUOTA PROGRESS GRID */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* STORAGE BAR */}
        <div className="glass rounded-2xl p-6 border border-white/5 bg-white/[0.01] shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm uppercase font-mono tracking-wider text-neutral-200">Storage Core Quota</h3>
              <p className="text-xs text-neutral-400/80 font-mono mt-0.5">Space Weight Limitation</p>
            </div>
            <span className="font-mono text-sm font-black text-purple-400">{pct.toFixed(1)}% Consumed</span>
          </div>
          
          <div className="w-full bg-white/5 h-3.5 rounded-full overflow-hidden p-0.5 border border-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-purple-600 via-indigo-500 to-pink-500 rounded-full shadow-[0_0_12px_rgba(168,85,247,0.3)]"
            />
          </div>
          
          <div className="flex justify-between text-[10px] font-mono text-neutral-400/60 pt-0.5">
            <span>Used: {used.toFixed(2)} MB</span>
            <span className="text-purple-300 font-bold">Remaining: {remaining.toFixed(2)} MB</span>
          </div>
        </div>

        {/* DOWNLOAD LIMIT PROGRESS BAR (Configured for daily 5 limits) */}
        <div className="glass rounded-2xl p-6 border border-white/5 bg-white/[0.01] shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm uppercase font-mono tracking-wider text-neutral-200">Download Limit Quota</h3>
              <p className="text-xs text-neutral-400/80 font-mono mt-0.5">Daily Converter Allocation</p>
            </div>
            <span className="font-mono text-sm font-black text-pink-400">{dlsPct.toFixed(1)}% Used</span>
          </div>
          
          <div className="w-full bg-white/5 h-3.5 rounded-full overflow-hidden p-0.5 border border-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${dlsPct}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 rounded-full shadow-[0_0_12px_rgba(244,63,94,0.3)]"
            />
          </div>
          
          <div className="flex justify-between text-[10px] font-mono text-neutral-400/60 pt-0.5">
            <span>Processed: {dlsUsed} Today</span>
            <span className="text-pink-300 font-bold">Available Today: {dlsRemaining} DLs</span>
          </div>
        </div>
      </div>

      {/* QUICK LINK GATEWAYS GRID */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { to: "/dashboard/converter", icon: UploadCloud, label: "Upload media", desc: "Drag & drop streaming ingestion" },
          { to: "/dashboard/links", icon: Link2, label: "Convert URL", desc: "Mint automated streaming proxy" },
          { to: "/pricing", icon: CreditCard, label: "Upgrade plan", desc: "Scale capacity allocation matrices" },
        ].map((a) => (
          <Link
            key={a.to}
            to={a.to}
            className="glass group flex items-center justify-between rounded-xl p-4 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all hover:shadow-lg hover:border-purple-500/20"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/10">
                <a.icon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-bold tracking-tight text-neutral-200 group-hover:text-purple-400 transition-colors">{a.label}</div>
                <div className="text-[11px] text-neutral-400/70 font-mono mt-0.5">{a.desc}</div>
              </div>
            </div>
            <ArrowUpRight className="h-4 w-4 text-neutral-400 transition-all group-hover:text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        ))}
      </div>
    </div>
  );
}
