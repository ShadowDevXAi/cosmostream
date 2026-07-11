import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Rocket, FileUp, ShieldCheck, MessageSquareCode, RefreshCw, LogIn, UserPlus, Send } from "lucide-react";
import { Stardust } from "@/components/cosmos/Stardust";
import { Logo } from "@/components/cosmos/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Access Gateway — Cosmos Media Cloud" }] }),
  component: AuthPage,
});

function AuthPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup" | "verify">("signup");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [triggerLoading, setTriggerLoading] = useState(false);

  // Structural Form Context Nodes
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [identifier, setIdentifier] = useState("");
  const [otpCode, setOtpCode] = useState("");

  // Decoupled Telemetry Identifiers States
  const [telegramId, setTelegramId] = useState("");
  const [telegramUsername, setTelegramUsername] = useState("");

  const BACKEND_URL = "https://shadowapiweb.onrender.com";

  // DISPATCH SIGNALS TO BOT INBOX MATRIX
  const handleRequestTelegramOtp = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    setTriggerLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", username.replace("@", "").trim());

      const response = await fetch(`${BACKEND_URL}/trigger-telegram-otp`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        setSuccessMsg("🎯 Secure activation token dispatched! Check your Bot DMs.");
        toast.success("Security token sent to your Telegram account.");
      } else {
        setErrorMsg(data.detail || "Failed to route token package.");
        toast.error(data.detail || "Gateway transmission rejected.");
      }
    } catch (err) {
      setErrorMsg("Failed to connect to gateway network infrastructure.");
      toast.error("Network interface connection dropped.");
    } finally {
      setTriggerLoading(false);
    }
  };

  const executeAuthTransactionPipeline = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(""); 
    setSuccessMsg(""); 
    setLoading(true);

    try {
      // 🟢 TRANSACTION NODE A: SECURE REGISTRATION SIGNUP
      if (mode === "signup") {
        if (password !== confirmPassword) { 
          setErrorMsg("Passwords do not match!"); 
          toast.error("Password string mismatch configuration.");
          setLoading(false); 
          return; 
        }
        if (!telegramId || !telegramUsername) {
          setErrorMsg("Telegram verification identities parameters are mandatory.");
          toast.error("Missing secure messaging routing keys.");
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append("email", email.trim()); 
        formData.append("username", username.trim().replace("@", ""));
        formData.append("password", password); 
        formData.append("confirm_password", confirmPassword);
        formData.append("name", name.trim()); 
        formData.append("surname", surname.trim());
        formData.append("mobile", mobile.trim()); 
        formData.append("dob", dob);
        
        if (profilePic) {
          formData.append("profile_pic", profilePic);
        }

        formData.append("telegram_id", telegramId.trim());
        formData.append("telegram_username", telegramUsername.trim().replace("@", ""));

        const response = await fetch(`${BACKEND_URL}/register`, { 
          method: "POST", 
          body: formData 
        });
        const data = await response.json();

        if (response.ok) {
          window.open("https://t.me/testingbotst", "_blank");
          setSuccessMsg("Profile registered. Bot launched in secondary tab. Press 'START', then query code below.");
          toast.success("Account initiated! Diverting session to Telegram authorization loop.");
          setMode("verify"); 
        } else { 
          setErrorMsg(data.detail || "Signup ledger allocation failure."); 
          toast.error(data.detail || "Registration denied.");
        }
      } 
      
      // 🟡 TRANSACTION NODE B: SECURITY VERIFICATION GATEWAY
      else if (mode === "verify") {
        const verifyFormData = new FormData();
        verifyFormData.append("mobile", mobile.trim());
        verifyFormData.append("otp", otpCode.trim());

        const response = await fetch(`${BACKEND_URL}/verify-mobile`, { 
          method: "POST", 
          body: verifyFormData 
        });
        const data = await response.json();

        if (response.ok) {
          toast.success("Identity validation absolute! Proceed to log in.");
          setSuccessMsg("Mobile verification validated. Verify your email link to finalize your security activation.");
          setMode("signin"); 
        } else { 
          setErrorMsg(data.detail || "Security OTP authentication signature validation failure."); 
          toast.error("Invalid token verification values.");
        }
      } 
      
      // 🔴 TRANSACTION NODE C: CORE LOG IN SYSTEM ACCESS (UPDATED FOR CACHE WIPE)
      else {
        const response = await fetch(`${BACKEND_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier: identifier.trim(), password }),
        });
        const data = await response.json();

        if (response.ok && data.success) {
          // 🔥 CACHE ELIMINATOR MATRIX: Wipes out old tester memory completely right before logging into new nodes
          localStorage.clear();

          // Map active validation token configuration
          localStorage.setItem("cosmos_token", data.token);

          // Map dynamic user schema context if present to keep cosmos-auth alignment safe
          if (data.user) {
            localStorage.setItem("cosmos_user", JSON.stringify({
              email: data.user.email,
              name: data.user.username,
              createdAt: new Date().toISOString()
            }));
          }

          toast.success("System encryption keys mapped. Session authorized.");
          nav({ to: "/dashboard" });
        } else { 
          setErrorMsg(data.detail || "Credentials signature validation conflict."); 
          toast.error(data.detail || "Access denied.");
        }
      }
    } catch (err) {
      setErrorMsg("Core pipeline transaction timeout exception channel dropped.");
      toast.error("Cluster packet response failure.");
    } finally { 
      setLoading(false)
    }
  };

  return (
    <div className="relative min-h-screen text-white bg-[#06070a] font-sans selection:bg-purple-500/20 overflow-x-hidden">
      <Stardust />
      
      {/* HEADER SECTION CONTAINER */}
      <header className="mx-auto flex h-16 max-w-7xl items-center justify-between px-8 bg-black/10 backdrop-blur-sm relative z-20">
        <Logo />
        <Link to="/" className="text-xs font-mono text-muted-foreground hover:text-white transition-colors">
          ← Back to Terminal Orbit
        </Link>
      </header>

      {/* WORKSPACE MAIN LAYOUT FRAME */}
      <main className="mx-auto grid max-w-xl px-6 py-10 relative z-20 animate-fade-in">
        <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
          
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[10px] font-mono font-bold tracking-wider uppercase border border-white/5 text-purple-400 mb-4 animate-pulse">
            <Sparkles className="h-3 w-3 text-purple-400" />
            {mode === "signup" && "Registration Layer Portal"}
            {mode === "signin" && "Identity Validation Checkpoint"}
            {mode === "verify" && "Asynchronous 2FA Matrix Verification"}
          </div>

          <h1 className="text-2xl font-black font-mono tracking-tight uppercase text-neutral-100">
            {mode === "signup" && "Provision Account Space"}
            {mode === "signin" && "Initialize Cloud Session"}
            {mode === "verify" && "Verify Telegram Stream Identity"}
          </h1>

          {errorMsg && <div className="mt-4 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs font-mono text-red-400">⚠️ {errorMsg}</div>}
          {successMsg && <div className="mt-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-3 text-xs font-mono text-emerald-400">✅ {successMsg}</div>}

          <form onSubmit={executeAuthTransactionPipeline} className="mt-6 space-y-4">
            
            {/* INTERFACE SPLIT A: ACCOUNT SETUP FORM ELEMENTS */}
            {mode === "signup" && (
              <div className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <Input required placeholder="First Name" value={name} onChange={(e) => setName(e.target.value)} className="h-11 bg-black/40 border-white/5 rounded-xl text-xs" />
                  <Input required placeholder="Surname" value={surname} onChange={(e) => setSurname(e.target.value)} className="h-11 bg-black/40 border-white/5 rounded-xl text-xs" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input required placeholder="Cloud Username (App)" value={username} onChange={(e) => setUsername(e.target.value)} className="h-11 bg-black/40 border-white/5 rounded-xl text-xs text-purple-300 font-mono" />
                  <Input type="email" required placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 bg-black/40 border-white/5 rounded-xl text-xs font-mono" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input type="tel" required placeholder="Mobile (+91...)" value={mobile} onChange={(e) => setMobile(e.target.value)} className="h-11 bg-black/40 border-white/5 rounded-xl text-xs font-mono" />
                  <Input type="date" required value={dob} onChange={(e) => setDob(e.target.value)} className="h-11 bg-black/40 border-white/5 rounded-xl text-xs text-muted-foreground/80 font-mono" />
                </div>

                {/* TARGET TELEGRAM DECOUPLED INDICES */}
                <div className="space-y-1.5 border border-white/[0.03] bg-white/[0.01] p-3 rounded-xl">
                  <div className="grid grid-cols-2 gap-3">
                    <Input required type="text" pattern="[0-9]*" placeholder="Numerical Telegram ID" value={telegramId} onChange={(e) => setTelegramId(e.target.value)} className="h-11 bg-black/50 border-white/10 rounded-xl text-xs font-mono text-blue-400 placeholder:text-muted-foreground/30" />
                    <Input required placeholder="Telegram Username (@handle)" value={telegramUsername} onChange={(e) => setTelegramUsername(e.target.value)} className="h-11 bg-black/50 border-white/10 rounded-xl text-xs font-mono text-blue-400 placeholder:text-muted-foreground/30" />
                  </div>
                  <p className="text-[10px] font-mono text-muted-foreground/40 px-1 select-none leading-normal">
                    💡 Extract numerical credentials vector via <span className="text-purple-400/80 font-bold">@userinfobot</span> inside Telegram node grids.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 bg-black/40 border-white/5 rounded-xl text-xs" />
                  <Input type="password" required placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="h-11 bg-black/40 border-white/5 rounded-xl text-xs" />
                </div>
                
                {/* Avatar field configuration */}
                <div className="relative flex h-11 items-center rounded-xl border bg-black/40 px-3 text-xs border-white/5 group hover:border-purple-500/20 transition-all">
                  <FileUp className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none group-hover:text-purple-400" />
                  <input type="file" accept="image/*" onChange={(e) => e.target.files && setProfilePic(e.target.files[0])} className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10" />
                  <span className="ml-7 text-muted-foreground truncate font-mono max-w-[280px]">
                    {profilePic ? profilePic.name : "Upload Profile Picture (Optional)"}
                  </span>
                </div>
              </div>
            )}

            {/* INTERFACE SPLIT B: SECURITY OTP FORM BLOCK */}
            {mode === "verify" && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-1 rounded-xl bg-blue-500/5 border border-blue-500/10 text-center">
                  <Button 
                    type="button" 
                    disabled={triggerLoading || !username}
                    onClick={handleRequestTelegramOtp}
                    className="w-full bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 text-white font-mono text-xs font-bold h-10 rounded-lg shadow-md cursor-pointer"
                  >
                    {triggerLoading ? (
                      <><RefreshCw className="mr-2 h-3.5 w-3.5 animate-spin" /> VERIFYING SUBSCRIBER STATE...</>
                    ) : (
                      <><MessageSquareCode className="mr-2 h-4 w-4" /> Trigger Verification Signal OTP</>
                    )}
                  </Button>
                </div>
                <Input type="tel" required placeholder="Confirm Registered Mobile Code" value={mobile} onChange={(e) => setMobile(e.target.value)} className="h-11 bg-black/40 border-white/5 rounded-xl text-xs font-mono" />
                <Input type="text" required maxLength={6} placeholder="000000" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} className="h-12 bg-black/60 border-white/10 rounded-xl text-center text-xl font-bold font-mono tracking-[0.5em] text-purple-400 focus-visible:border-purple-500/40 focus-visible:ring-0" />
              </div>
            )}

            {/* INTERFACE SPLIT C: LOG IN INPUT NODES */}
            {mode === "signin" && (
              <div className="space-y-3.5 animate-fade-in">
                <Input type="text" required placeholder="Username string or Email vector" value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="h-11 bg-black/40 border-white/5 rounded-xl text-xs font-mono" />
                <Input type="password" required placeholder="Password credentials" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 bg-black/40 border-white/5 rounded-xl text-xs" />
              </div>
            )}

            {/* PIPELINE GENERAL TRIGGER HOOK EXECUTOR */}
            <Button type="submit" disabled={loading} className="h-11 w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-mono text-xs font-bold tracking-wider rounded-xl shadow-xl transition-all disabled:opacity-40 cursor-pointer">
              {loading ? (
                <><RefreshCw className="mr-2 h-3.5 w-3.5 animate-spin" /> PACKET VECTOR PIPELINE COMPILING...</>
              ) : mode === "verify" ? (
                <><ShieldCheck className="mr-2 h-4 w-4" /> Validate Security Signature</>
              ) : mode === "signup" ? (
                <><UserPlus className="mr-2 h-4 w-4" /> Deploy Active User Profile</>
              ) : (
                <><LogIn className="mr-2 h-4 w-4" /> Authenticate Cloud Session</>
              )}
            </Button>
          </form>

          {/* DYNAMIC SWAP MODAL CHANNELS LINKS FOOTER */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs font-mono text-muted-foreground border-t border-white/5 pt-4">
            <button type="button" onClick={() => { setErrorMsg(""); setSuccessMsg(""); setMode(mode === "signup" ? "signin" : "signup"); }} className="text-purple-400 hover:text-purple-300 font-bold transition-colors cursor-pointer">
              {mode === "signup" ? "Sign In Instead" : "Create Account Context Node"}
            </button>
            {mode === "signin" && (
              <>
                <span>•</span>
                <button type="button" onClick={() => { setErrorMsg(""); setSuccessMsg(""); setMode("verify"); }} className="hover:text-neutral-300 transition-colors cursor-pointer">
                  Direct 2FA OTP Gateway
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
