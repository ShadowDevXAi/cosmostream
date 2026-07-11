// src/routes/dashboard.library.tsx

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { 
  FileImage, 
  FileVideo, 
  FileAudio, 
  FileText, 
  Search, 
  RefreshCw, 
  Trash2, 
  Copy, 
  Check, 
  ExternalLink, 
  FolderOpen,
  HardDriveDownload
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cosmos } from "@/lib/cosmos-config";
import { getApiKey } from "@/lib/cosmos-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/library")({
  component: Library,
});

interface UserFileNode {
  _id: string; // MongoDB tracking string token
  file_name: string;
  size: number;
  mime: string;
  download_count: number;
  created_at?: string;
}

interface BackendResponse {
  success: boolean;
  files: UserFileNode[];
}

function Library() {
  const nav = useNavigate();
  const [filesList, setFilesList] = useState<UserFileNode[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<UserFileNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeToken = getApiKey() || localStorage.getItem("cosmos_token");
  const BACKEND_URL = "https://shadowapiweb.onrender.com";

  // Route guard configuration parameters
  useEffect(() => {
    if (!activeToken) {
      toast.error("Session missing. Re-authenticating network layer.");
      nav({ to: "/auth" });
    }
  }, [nav, activeToken]);

  // Pull array metadata from secure cluster storage partitions
  const loadCloudStorageRegistry = async () => {
    if (!activeToken) return;
    try {
      setLoading(true);
      const { data } = await cosmos.get<BackendResponse>("/my-files", {
        headers: {
          "X-API-Key": activeToken,
          "Authorization": `Bearer ${activeToken}`
        },
      });
      if (data && data.success) {
        setFilesList(data.files || []);
        setFilteredFiles(data.files || []);
      }
    } catch (err) {
      console.error("Failed to render backend storage cluster registries:", err);
      toast.error("Failed to re-index account cloud repository.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCloudStorageRegistry();
  }, [activeToken]);

  // Live filter query scanner matrix
  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    const result = filesList.filter(
      (f) =>
        f.file_name.toLowerCase().includes(query) ||
        f._id.toLowerCase().includes(query)
    );
    setFilteredFiles(result);
  }, [searchQuery, filesList]);

  // 🔥 RESTORE TO PHONE FILE STREAMING HANDSHAKE
  const triggerDeviceRestore = (fileId: string, filename: string) => {
    toast.success("📥 Initializing secure tunnel sync to device memory...");
    const dynamicAnchor = document.createElement("a");
    // Directly intercepts the cloud stream pipe link from the backend node
    dynamicAnchor.href = `${BACKEND_URL}/f/${fileId}`;
    dynamicAnchor.setAttribute("download", filename);
    document.body.appendChild(dynamicAnchor);
    dynamicAnchor.click();
    document.body.removeChild(dynamicAnchor);
  };

  // Garbage collection: Clears pointers and releases consumed space
  const executePurgePipeline = async (fileId: string) => {
    if (!activeToken) return;
    // 🔥 FIXED: Standardized to pure English compliance messaging
    if (!confirm("Are you sure you want to permanently delete this media asset from your cloud vault? This action cannot be undone.")) return;

    try {
      const res = await fetch(`${BACKEND_URL}/delete/${fileId}`, {
        method: "DELETE",
        headers: {
          "X-API-Key": activeToken,
          "Authorization": `Bearer ${activeToken}`
        },
      });

      if (res.ok) {
        const structuralRefresh = filesList.filter((f) => f._id !== fileId);
        setFilesList(structuralRefresh);
        toast.success("Asset unmapped and completely recycled from cloud pools.");
      } else {
        toast.error("Wipe instruction rejected by cluster server node.");
      }
    } catch (err) {
      toast.error("Transmission layout block failure during cleanup.");
    }
  };

  const copyStreamingUrlNode = async (fileId: string) => {
    const urlString = `${BACKEND_URL}/f/${fileId}`;
    await navigator.clipboard.writeText(urlString);
    setCopiedId(fileId);
    toast.success("Dynamic streaming link token copied to clipboard.");
    setTimeout(() => setCopiedId(null), 1600);
  };

  const selectMimeDynamicIcon = (mimeString: string) => {
    const lowerMime = (mimeString || "").toLowerCase();
    if (lowerMime.startsWith("video/")) return FileVideo;
    if (lowerMime.startsWith("image/")) return FileImage;
    if (lowerMime.startsWith("audio/")) return FileAudio;
    return FileText;
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] bg-transparent flex items-center justify-center text-xs tracking-wider text-muted-foreground font-mono animate-pulse">
        <RefreshCw className="mr-2 h-4 w-4 animate-spin text-purple-500" />
        LOADING VAULT CLUSTER MEDIA INDEX CORES...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-1 text-white font-sans selection:bg-purple-500/20">
      
      {/* HEADER MATRIX CONTROLS */}
      <div className="flex items-end justify-between gap-4 flex-wrap border-b border-white/5 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">Media Library</h1>
          <p className="mt-1 text-xs text-muted-foreground/80 font-mono">
            Everything you've launched into the Cosmos system infrastructure array.
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input 
              placeholder="Search files by name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-black/40 border-white/5 rounded-xl text-xs font-mono text-purple-300 focus-visible:border-purple-500/30 focus-visible:ring-0 placeholder:text-muted-foreground/30" 
            />
          </div>
          <Button onClick={loadCloudStorageRegistry} variant="outline" className="h-11 border-white/5 bg-white/[0.01] hover:bg-white/[0.04] p-3 rounded-xl shrink-0">
            <RefreshCw className="h-4 w-4 stroke-[1.5]" />
          </Button>
        </div>
      </div>

      {/* COMPONENT CARDS RENDERING LAYER */}
      {filteredFiles.length === 0 ? (
        <div className="text-center p-16 border border-dashed border-white/5 bg-white/[0.005] rounded-2xl animate-fade-in">
          <FolderOpen className="h-10 w-10 mx-auto text-muted-foreground/50 stroke-[1.5] mb-3" />
          <p className="text-xs font-mono text-muted-foreground/70">No active assets detected within this specific workspace scope sector.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-fade-in">
          {filteredFiles.map((f) => {
            const AssetIcon = selectMimeDynamicIcon(f.mime);
            const streamingLinkString = `${BACKEND_URL}/f/${f._id}`;
            
            return (
              <div key={f._id} className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/20 group shadow-xl relative overflow-hidden flex flex-col justify-between">
                
                {/* ICON BOX BLOCK FRAME */}
                <div>
                  <div className="grid aspect-[4/3] place-items-center rounded-xl bg-gradient-to-br from-[#12131e] to-black border border-white/5 relative overflow-hidden group-hover:border-purple-500/10 transition-colors">
                    <AssetIcon className="h-10 w-10 text-purple-400 group-hover:scale-110 transition-transform duration-300 stroke-[1.5]" />
                    <span className="absolute bottom-2 right-2 text-[9px] bg-black/60 font-mono text-amber-400 border border-white/5 px-2 py-0.5 rounded-md font-bold">
                      Hits: {f.download_count}
                    </span>
                  </div>
                  
                  {/* METADATA EXPOSURE CONTENT */}
                  <div className="mt-3.5 min-w-0 space-y-1">
                    <div className="truncate text-xs font-mono font-bold text-neutral-200 antialiased group-hover:text-purple-300 transition-colors" title={f.file_name}>
                      {f.file_name}
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground/70 pt-0.5">
                      <span>{(f.size || 0).toFixed(2)} MB</span>
                      <span className="truncate max-w-[90px] opacity-60 text-right">{(f.mime || "").split("/")[1] || "bin"}</span>
                    </div>
                  </div>
                </div>

                {/* OVERLAY ACTIONS ROW HUB */}
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-1 shrink-0">
                  
                  {/* 📥 ACTIVE RESTORE TO PHONE BUTTON */}
                  <Button
                    size="sm"
                    onClick={() => triggerDeviceRestore(f._id, f.file_name)}
                    className="h-8 bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 text-white font-mono text-[10px] font-bold px-3 rounded-lg shadow-md hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-1"
                  >
                    <HardDriveDownload className="h-3 w-3" /> Restore
                  </Button>

                  <div className="flex gap-0.5">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg cursor-pointer"
                      onClick={() => copyStreamingUrlNode(f._id)}
                      title="Copy streaming token URL"
                    >
                      {copiedId === f._id ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    
                    <a href={streamingLinkString} target="_blank" rel="noreferrer">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-muted-foreground hover:text-purple-400 hover:bg-purple-500/5 rounded-lg cursor-pointer"
                        title="Open continuous content stream player"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>

                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 text-muted-foreground hover:text-red-400 hover:bg-red-500/5 rounded-lg cursor-pointer"
                      onClick={() => executePurgePipeline(f._id)}
                      title="Purge asset permanently"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
