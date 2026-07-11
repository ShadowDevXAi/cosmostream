import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { UploadCloud, Rocket, FileVideo, Copy, Check, ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cosmos } from "@/lib/cosmos-config";
import { getApiKey } from "@/lib/cosmos-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/converter")({
  component: Converter,
});

// Matches our secure multi-tenant backend payload schema exactly
type UploadResult = { success?: boolean; url?: string };

function Converter() {
  const nav = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [copied, setCopied] = useState(false);

  const activeToken = getApiKey();

  // Enforcing active session router guard
  useEffect(() => {
    if (!activeToken) {
      toast.error("Session missing. Re-authenticating network parameters.");
      nav({ to: "/auth" });
    }
  }, [nav, activeToken]);

  const executeIngestPipeline = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);

    const fd = new FormData();
    fd.append("file", file);

    try {
      // Passing the unified X-API-Key header directly inside your cosmos helper options
      const { data } = await cosmos.post<UploadResult>("/upload", fd, {
        headers: {
          "X-API-Key": activeToken || "",
        },
      });

      if (data && data.url) {
        setResult(data);
        setFile(null);
        toast.success("Asset successfully mirrored across multi-layer channels!");
      } else {
        toast.error("Pipeline failure: Invalid cluster response payload.");
      }
    } catch (err: any) {
      // Intercepts quota limit failures (402) or network downtime dynamically
      const serverError = err.response?.data?.detail || "Upload failed. Storage quota exceeded or timeout.";
      toast.error(serverError);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const link = result?.url ?? "";
  
  const copyToClipboard = async () => {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Streaming node link saved to clipboard.");
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-2 font-sans text-white">
      {/* HEADER NODES CONTENT */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
          Media Converter Ingest
        </h1>
        <p className="mt-1 text-xs text-muted-foreground/80 font-mono">
          Drop a file — we pipe it directly into the Cosmos triple-layer failover engine via your account authorization node.
        </p>
      </div>

      {/* CORE DRAG DROP CRADLE FRAME */}
      <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <label
          htmlFor="upload"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (loading) return;
            setFile(e.dataTransfer.files?.[0] ?? null);
            setResult(null);
          }}
          className="flex h-72 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/10 bg-black/20 p-6 text-center transition-all duration-300 hover:border-purple-500/30 hover:bg-white/[0.02] group relative"
        >
          {file ? (
            <div className="space-y-3 animate-fade-in">
              <FileVideo className="h-12 w-12 text-purple-400 mx-auto transition-transform group-hover:scale-110" />
              <div className="text-xs font-mono font-bold text-purple-300 break-all max-w-md">{file.name}</div>
              <div className="text-[10px] font-mono text-muted-foreground bg-white/5 px-2.5 py-1 rounded-md inline-block">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
          ) : (
            <div className="space-y-3 pointer-events-none">
              <UploadCloud className="h-12 w-12 text-muted-foreground/70 mx-auto transition-all duration-300 group-hover:text-purple-400 group-hover:scale-110" />
              <div className="text-xs font-mono text-neutral-300">Drop your file node here or click to scan directory</div>
              <div className="text-[10px] font-mono text-muted-foreground/60">Automated structured routing payload via X-API-Key</div>
            </div>
          )}
          <input
            id="upload"
            type="file"
            className="hidden"
            disabled={loading}
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
              setResult(null);
            }}
          />
        </label>

        {/* PIPELINE TRIGGER SWITCH */}
        <Button
          onClick={executeIngestPipeline}
          className="mt-6 w-full h-11 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-mono text-xs tracking-wider font-bold rounded-xl shadow-xl transition-all duration-300 disabled:opacity-40"
          disabled={!file || loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin text-white" />
              DEPLOYING SHADOW MIRRORS LOOP NETWORKS...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Rocket className="h-4 w-4" /> INGEST ASSET TO COSMOS
            </span>
          )}
        </Button>

        {/* SECURE MINTED LINK OUTPUT PANEL */}
        {link && (
          <div className="mt-6 rounded-xl border border-emerald-500/10 bg-emerald-500/[0.02] p-5 space-y-3 shadow-xl animate-fade-in">
            <div className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              PROXIED STORAGE SYSTEM LINK GENERATED
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
              <code className="flex-1 bg-black/40 border border-white/5 font-mono text-xs p-3 rounded-xl text-emerald-300 overflow-x-auto select-all flex items-center min-h-[42px]">
                {link}
              </code>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-11 px-4 border-white/10 font-mono text-xs bg-white/[0.01] text-white" onClick={copyToClipboard}>
                  {copied ? <Check className="h-4 w-4 text-emerald-400 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  Copy Link
                </Button>
                <a href={link} target="_blank" rel="noreferrer">
                  <Button size="sm" className="h-11 px-4 bg-purple-600 hover:bg-purple-700 text-white font-mono text-xs">
                    <ExternalLink className="h-4 w-4 mr-1" /> Open Stream
                  </Button>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
