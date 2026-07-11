import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, UserCheck, Search, LockKeyhole, Eye, EyeOff, RefreshCw, Radio } from "lucide-react";
import { Stardust } from "@/components/cosmos/Stardust";
import { Logo } from "@/components/cosmos/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Secure Admin Gateway — Cosmos Cloud" }] }),
  component: AdminPage,
});

function AdminPage() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminSecret, setAdminSecret] = useState("");
  const [showSecret, setShowSecret] = useState(false);

  const [targetUsername, setTargetUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const BACKEND_URL = "https://shadowapiweb.onrender.com";

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminSecret.trim()) {
      setErrorMsg("Please enter the master key sequence.");
      toast.error("Master key field cannot be empty.");
      return;
    }
    setErrorMsg("");
    setIsAdminAuthenticated(true);
    toast.success("Firewall bypassed. Admin terminal unlocked.");
  };

  const handleVerifyUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      // Direct pipeline query transmission to the automated verification node
      const response = await fetch(
        `${BACKEND_URL}/admin/verify-user?username=${targetUsername.trim()}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "secret-code": adminSecret.trim(), 
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMsg(`SUCCESS: Profile @${targetUsername} has been assigned production quotas!`);
        toast.success(`User @${targetUsername} fully activated!`);
        setTargetUsername(""); 
      } else {
        setErrorMsg(data.detail || "Authorization signature validation failure.");
        toast.error("User activation transaction rejected.");
      }
    } catch (err) {
      setErrorMsg("Failed to broadcast transaction package to the live cloud cluster nodes.");
      toast.error("Network packet drop exception.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen text-white bg-[#06070a] font-sans selection:bg-red-500/20 overflow-hidden">
      <Stardust />
      
      {/* CONTROL GATEWAY HEADER */}
      <header className="mx-auto flex h-16 max-w-7xl items-center justify-between px-8 border-b border-white/5 bg-black/20 backdrop-blur-md relative z-20">
        <Logo />
        <Link to="/dashboard" className="text-xs font-mono text-muted-foreground hover:text-purple-400 transition-colors">
          ← Back to Control Hub
        </Link>
      </header>

      <main className="mx-auto grid max-w-md px-6 py-20 relative z-20 animate-fade-in">
        
        {/* CONDITION 1: SECURITY GATEWAY UNLOCKED VIEW */}
        {!isAdminAuthenticated ? (
          <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-8 shadow-2xl relative overflow-hidden text-center backdrop-blur-xl">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
            
            <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 mx-auto mb-4 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
              <LockKeyhole className="h-5 w-5 animate-pulse" />
            </div>
            
            <h1 className="text-xl font-black font-mono tracking-wider uppercase text-neutral-200">Cosmos Firewall Secure Node</h1>
            <p className="text-[11px] text-muted-foreground/80 font-mono mt-2 leading-relaxed">
              This terminal context maps direct root administrative authorization. Unauthorized connection packets are audited.
            </p>

            {errorMsg && (
              <div className="mt-4 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-left text-xs font-mono text-red-400">
                ⚠️ Error: {errorMsg}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="mt-6 space-y-4 text-left">
              <div className="space-y-1 relative">
                <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider">Master Security Token</label>
                <div className="relative">
                  <Input 
                    type={showSecret ? "text" : "password"} 
                    required 
                    placeholder="Enter ADMIN_SECRET string" 
                    value={adminSecret} 
                    onChange={(e) => setAdminSecret(e.target.value)} 
                    className="h-11 bg-black/40 border-white/5 pr-10 rounded-xl text-xs font-mono text-red-300 focus-visible:border-red-500/30 focus-visible:ring-0" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowSecret(!showSecret)} 
                    className="absolute right-3 top-3.5 text-muted-foreground hover:text-white transition-colors"
                  >
                    {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <Button type="submit" className="h-11 w-full bg-gradient-to-r from-red-700 to-rose-600 hover:from-red-600 hover:to-rose-500 text-white font-mono text-xs tracking-wider font-bold rounded-xl shadow-lg shadow-red-950/20 transition-all">
                Unlock Control Interface
              </Button>
            </form>
          </div>
        ) : (
          
          /* CONDITION 2: TERMINAL CONSOLE ACTIVE WORKER MODULE */
          <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-8 shadow-2xl backdrop-blur-xl relative">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
            
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/5 px-3 py-1 text-[10px] font-mono font-bold text-emerald-400 border border-emerald-500/20 mb-5 tracking-wider uppercase">
              <Radio className="h-3 w-3 animate-ping" />
              Kernel Root Network Stream Active
            </div>

            <h1 className="text-2xl font-black font-mono tracking-tight uppercase text-neutral-100">
              KYC Asset Activator
            </h1>
            <p className="text-xs text-muted-foreground/80 font-mono mt-1 leading-relaxed">
              Audit the user documents via Telegram channel storage buffers, then dispatch secure clearance authorization keys below.
            </p>

            {errorMsg && <div className="mt-4 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs font-mono text-red-400">⚠️ {errorMsg}</div>}
            {successMsg && <div className="mt-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-3 text-xs font-mono text-emerald-400">✅ {successMsg}</div>}

            <form onSubmit={handleVerifyUser} className="mt-6 space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider">Target Profile Account ID</label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input 
                    required 
                    placeholder="e.g. bkgaminguniverse" 
                    value={targetUsername} 
                    onChange={(e) => setTargetUsername(e.target.value)} 
                    className="h-11 bg-black/40 border-white/5 pl-10 rounded-xl text-xs font-mono text-purple-300 focus-visible:border-purple-500/30 focus-visible:ring-0" 
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading || !targetUsername} 
                className="h-11 w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-700 text-white font-mono text-xs font-bold tracking-wider rounded-xl shadow-xl transition-all disabled:opacity-40"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" /> DISPATCHING METADATA UPDATE PACKETS...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <UserCheck className="h-4 w-4" /> Clear KYC & Open Quotas
                  </span>
                )}
              </Button>
            </form>

            <button 
              onClick={() => { setIsAdminAuthenticated(false); setAdminSecret(""); setSuccessMsg(""); setErrorMsg(""); toast.info("Terminal console locked."); }} 
              className="w-full text-center text-[11px] font-mono text-muted-foreground hover:text-red-400 transition-colors mt-5 underline underline-offset-4"
            >
              Terminate Session Securely
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
