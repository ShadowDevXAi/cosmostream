import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { KeyRound, Plus, Copy, Trash2, Check, Eye, EyeOff, RefreshCw, Terminal, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/api-keys")({
  head: () => ({
    meta: [{ title: "API Keys — Cosmos Media Cloud" }],
  }),
  component: ApiKeys,
});

interface TelemetryData {
  sub_api_key: string;
  plan_name: string;
}

interface GeneratedKeyPair {
  api_key: string;
  app_secret: string;
  message: string;
}

function ApiKeys() {
  const nav = useNavigate();
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [newlyGenerated, setNewlyGenerated] = useState<GeneratedKeyPair | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [visible, setVisible] = useState(false);
  const [secretVisible, setSecretVisible] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const token = localStorage.getItem("cosmos_token");
  const BACKEND_URL = "https://shadowapiweb.onrender.com";

  // Fetch active system credentials on layout mount
  const loadActiveCredentialsNode = async () => {
    if (!token) { nav({ to: "/auth" }); return; }
    try {
      const res = await fetch(`${BACKEND_URL}/user/dashboard-telemetry`, {
        headers: { "X-API-Key": token }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActiveKey(data.telemetry.sub_api_key);
      }
    } catch (err) {
      console.error("Failed to interface with credentials telemetry cluster.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActiveCredentialsNode();
  }, []);

  const triggerKeyGenerationPipeline = async () => {
    if (!token) return;
    if (!confirm("🚨 Warning: Regenerating will revoke all your previous operational tokens instantly. Proceed?")) return;

    setGenerating(true);
    setNewlyGenerated(null);
    try {
      const res = await fetch(`${BACKEND_URL}/user/generate-api-key`, {
        method: "POST",
        headers: { "X-API-Key": token }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNewlyGenerated({
          api_key: data.api_key,
          app_secret: data.app_secret,
          message: data.message
        });
        toast.success("New integration token space successfully minted!");
        // Refresh underlying context tracking variables
        loadActiveCredentialsNode();
      }
    } catch (err) {
      toast.error("Cryptographic engine failed to respond.");
    } finally {
      setGenerating(false);
    }
  };

  const executeClipboardCopy = (textString: string) => {
    navigator.clipboard.writeText(textString);
    setCopiedText(textString);
    toast.success("Credential string saved to clipboard.");
    setTimeout(() => setCopiedText(null), 1500);
  };

  const maskKeyString = (k: string) => `${k.slice(0, 14)}${"•".repeat(12)}`;

  if (loading) {
    return (
      <div className="min-h-[50vh] bg-transparent flex items-center justify-center text-xs tracking-wider text-muted-foreground font-mono animate-pulse">
        <RefreshCw className="mr-2 h-4 w-4 animate-spin text-purple-500" />
        LOADING SECURE SECURITY CREDENTIAL ENTRIES...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-2 font-sans text-white">
      
      {/* PORTAL TOP HEADER */}
      <div className="flex items-end justify-between gap-4 flex-wrap border-b border-white/5 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">Developer Portal</h1>
          <p className="mt-1 text-xs text-muted-foreground/80 font-mono">
            Manage your cluster access parameters. Pass them as an <code className="font-mono text-purple-400 font-bold">X-API-Key</code> tracking header on requests.
          </p>
        </div>
        <Button 
          onClick={triggerKeyGenerationPipeline} 
          disabled={generating}
          className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-11 text-xs font-mono font-bold tracking-wide rounded-xl shadow-xl transition-all"
        >
          {generating ? (
            <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> MINTING KEYS...</>
          ) : (
            <><Plus className="mr-2 h-4 w-4 stroke-[2.5]" /> Generate App Keys</>
          )}
        </Button>
      </div>

      {/* REGENERATED PAIR CONDITIONAL SECURE PANEL DISPLAY */}
      {newlyGenerated && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-amber-400 flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="space-y-1 font-mono text-[11px]">
              <h4 className="font-bold uppercase tracking-wider">Confidential Security Token Allocation</h4>
              <p className="text-muted-foreground/90 leading-relaxed">{newlyGenerated.message}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* API KEY CARD */}
            <div className="bg-white/[0.01] border border-white/5 rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono tracking-wider text-muted-foreground uppercase font-bold">
                <span>Custom Integration API Key</span>
                <Button variant="ghost" className="h-7 text-[10px] text-purple-400" onClick={() => executeClipboardCopy(newlyGenerated.api_key)}>Copy Key</Button>
              </div>
              <div className="font-mono text-xs text-purple-300 p-3 bg-black/40 border border-white/5 rounded-lg select-all overflow-x-auto">
                {newlyGenerated.api_key}
              </div>
            </div>

            {/* APP SECRET CARD */}
            <div className="bg-white/[0.01] border border-white/5 rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono tracking-wider text-muted-foreground uppercase font-bold">
                <span>Custom Application Client Secret</span>
                <Button variant="ghost" className="h-7 text-[10px] text-pink-400" onClick={() => executeClipboardCopy(newlyGenerated.app_secret)}>Copy Secret</Button>
              </div>
              <div className="font-mono text-xs text-pink-300 p-3 bg-black/40 border border-white/5 rounded-lg select-all overflow-x-auto">
                {newlyGenerated.app_secret}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE INTEGRATION CODE SNIPPET */}
      <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 shadow-2xl space-y-3">
        <div className="flex items-center gap-2 text-muted-foreground text-xs font-mono font-bold uppercase tracking-wider">
          <Terminal className="h-4 w-4 text-purple-400" />
          <span>Quickstart Shell Execution Template</span>
        </div>
        <pre className="overflow-x-auto rounded-xl bg-black/40 border border-white/5 p-4 font-mono text-[11px] text-neutral-300 leading-relaxed">
{`fetch("${BACKEND_URL}/upload", {
  method: "POST",
  headers: { `}<span className="text-purple-400 font-bold">{`"X-API-Key": "cosmos_sk_your_private_token"`}</span>{` },
  body: formData
})`}
        </pre>
      </div>

      {/* CORE CREDENTIALS SYSTEM LEDGER TABLE */}
      <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 shadow-2xl space-y-4">
        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Account Authentication Key</h3>
        
        <div className="divide-y divide-white/5">
          {activeKey ? (
            <div className="flex items-center gap-4 py-3 animate-fade-in">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/10">
                <KeyRound className="h-4 w-4 stroke-[1.5]" />
              </div>
              
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold tracking-tight text-neutral-200">Primary Session Key</div>
                <code className="text-xs font-mono text-purple-300/80 break-all select-all mt-0.5 block">
                  {visible ? activeKey : maskKeyString(activeKey)}
                </code>
              </div>
              
              <div className="flex items-center gap-1.5 shrink-0">
                <Button size="icon" variant="ghost" className="h-9 w-9 text-muted-foreground hover:text-white" onClick={() => setVisible(!visible)}>
                  {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button size="icon" variant="ghost" className="h-9 w-9 text-muted-foreground hover:text-white" onClick={() => executeClipboardCopy(activeKey)}>
                  {copiedText === activeKey ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-muted-foreground font-mono">
              No private keys registered to this user space segment container.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
