// src/routes/profile.tsx

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { 
  User, 
  Phone, 
  UploadCloud, 
  ShieldCheck, 
  Sparkles, 
  Trash2, 
  UserPlus, 
  AlertTriangle, 
  Mail, 
  Calendar, 
  CreditCard,
  Fingerprint
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({
    title: "Profile Management — Cosmos Media Cloud",
    meta: [
      { name: "description", content: "Manage your user profile parameters, date of birth verification, and account security." },
    ],
  }),
  component: UserProfileComponent,
});

function UserProfileComponent() {
  const navigate = useNavigate();
  const BACKEND_URL = "https://shadowapiweb.onrender.com";
  const secureToken = localStorage.getItem("cosmos_token");

  // 🔐 CORE DATA MATRIX STATES
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState(""); // YYYY-MM-DD tracking string
  const [gmail, setGmail] = useState(""); // Read-only auth token identification
  const [activePlan, setActivePlan] = useState("Pulsar Free"); // Meta telemetry parameter
  
  const [avatarUrl, setAvatarUrl] = useState("🪐"); 
  const [savingInfo, setSavingInfo] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [purgingAccount, setPurgingAccount] = useState(false);

  // Sync state profiles right out of database runtime parameters on mount hooks
  useEffect(() => {
    const fetchCurrentSessionMetadata = async () => {
      if (!secureToken) return;
      try {
        const res = await fetch(`${BACKEND_URL}/user/dashboard-telemetry`, {
          headers: { 
            "X-API-Key": secureToken,
            "Authorization": `Bearer ${secureToken}`
          }
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setFullName(data.user_profile?.name || "");
          setUsername(data.user_profile?.username || "");
          setMobile(data.user_profile?.mobile || ""); 
          setDob(data.user_profile?.dob || "");
          setGmail(data.user_profile?.email || data.user_profile?.gmail || "Not Synced");
          setActivePlan(data.telemetry?.plan_name || "Pulsar Free");
          
          if (data.user_profile?.avatar_url) setAvatarUrl(data.user_profile.avatar_url);
        }
      } catch (err) {
        console.error("Failed loading base node profile states.");
      }
    };
    fetchCurrentSessionMetadata();
  }, [secureToken]);

  // 📝 ACTION 1: Commit Profile Updates (With New Parameters Included)
  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingInfo(true);
    try {
      const response = await fetch(`${BACKEND_URL}/profile/update-info`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": secureToken || "",
          "Authorization": `Bearer ${secureToken}`
        },
        body: JSON.stringify({ 
          name: fullName,
          username: username, 
          mobile: mobile,
          dob: dob 
        })
      });
      const resData = await response.json();
      if (response.ok && resData.success) {
        toast.success("🎉 Profile parameters successfully synchronized across database nodes!");
        if (username) localStorage.setItem("cosmos_username", username);
      } else {
        toast.error(resData.detail || "Server rejected profile parameters patch sequence.");
      }
    } catch (err) {
      toast.error("Network synchronization link failure.");
    } finally {
      setSavingInfo(false);
    }
  };

  // 🖼️ ACTION 2: Upload Dynamic Profile Picture (Avatar)
  const handleAvatarFileSelection = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const activeFile = e.target.files?.[0];
    if (!activeFile) return;

    const dataFormPayload = new FormData();
    dataFormPayload.append("file", activeFile);

    setUploadingImg(true);
    toast.loading("Uploading visual avatar asset downstream...");

    try {
      const uploadRequest = await fetch(`${BACKEND_URL}/profile/update-avatar`, {
        method: "POST",
        headers: {
          "X-API-Key": secureToken || "",
          "Authorization": `Bearer ${secureToken}`
        },
        body: dataFormPayload
      });

      toast.dismiss();
      const uploadResult = await uploadRequest.json();

      if (uploadRequest.ok && uploadResult.success) {
        setAvatarUrl(uploadResult.avatar_url);
        toast.success("✨ Avatar asset updated successfully!");
      } else {
        toast.error(uploadResult.detail || "Image structure validation failure.");
      }
    } catch (err) {
      toast.dismiss();
      toast.error("Failed uploading profile asset vector.");
    } finally {
      setUploadingImg(false);
    }
  };

  // 💥 ACTION 3: Cascading Atomic Account Purge (Permanent Deletion)
  const handlePermanentAccountPurge = async () => {
    const doubleConfirm = window.confirm(
      "⚠️ WARNING: Are you absolutely sure you want to permanently delete your account and all encrypted files? This action is irreversible and data cannot be recovered!"
    );
    if (!doubleConfirm) return;

    setPurgingAccount(true);
    toast.loading("Initiating cascading cluster data erasure sequence...");

    try {
      const response = await fetch(`${BACKEND_URL}/profile/purge-account`, {
        method: "DELETE",
        headers: {
          "X-API-Key": secureToken || "",
          "Authorization": `Bearer ${secureToken}`
        }
      });
      const resData = await response.json();

      toast.dismiss();
      if (response.ok && resData.success) {
        toast.success("💥 Your account matrix profile and data logs have been permanently purged.");
        localStorage.clear();
        navigate({ to: "/auth" });
      } else {
        toast.error(resData.detail || "Purge sequence rejected by security gate.");
      }
    } catch (err) {
      toast.dismiss();
      toast.error("Account destruction engine timeout error.");
    } finally {
      setPurgingAccount(false);
    }
  };

  // ➕ ACTION 4: Add New Account
  const handleAddNewAccountRoute = () => {
    const confirmSwitch = window.confirm(
      "Registering or adding a new account will terminate your current active session. Do you want to proceed?"
    );
    if (!confirmSwitch) return;
    
    localStorage.clear();
    navigate({ to: "/auth" });
    toast.info("Active session released. Redirecting to signup gateway node.");
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 font-mono text-xs p-4 text-white">
      {/* HEADER NAVIGATION ACTION PANEL */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2 text-purple-400 font-bold uppercase tracking-widest text-[11px]">
          <Sparkles className="h-4 w-4 animate-pulse" /> Identity Management Matrix Hub
        </div>
        
        <Button 
          type="button"
          onClick={handleAddNewAccountRoute}
          className="h-8 bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 text-[10px] font-bold rounded-xl flex items-center gap-1 cursor-pointer"
        >
          <UserPlus className="h-3 w-3 text-indigo-400" /> Add New Account
        </Button>
      </div>

      {/* METRIC BADGE SECTION: TELEMETRY & ACCOUNT META */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/[0.01] border border-white/5 rounded-xl p-3 flex items-center gap-3">
          <Mail className="h-4 w-4 text-neutral-500" />
          <div className="truncate">
            <p className="text-[8px] uppercase font-bold text-muted-foreground/50">Primary Auth Gateway</p>
            <p className="text-[11px] font-bold text-neutral-300 truncate" title={gmail}>{gmail}</p>
          </div>
        </div>
        <div className="bg-white/[0.01] border border-purple-500/10 rounded-xl p-3 flex items-center gap-3 bg-purple-950/[0.01]">
          <CreditCard className="h-4 w-4 text-purple-400" />
          <div>
            <p className="text-[8px] uppercase font-bold text-purple-400/50">Active Subscription Orbit</p>
            <p className="text-[11px] font-bold text-purple-300">{activePlan}</p>
          </div>
        </div>
      </div>

      {/* AVATAR ASSET CONTROL BLOCK FRAME */}
      <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 backdrop-blur-md flex flex-col items-center space-y-4 text-center">
        <div className="relative group cursor-pointer h-24 w-24 rounded-full overflow-hidden border border-white/10 flex items-center justify-center text-3xl bg-neutral-900 shadow-2xl">
          {avatarUrl.startsWith("http") ? (
            <img src={avatarUrl} alt="User Avatar" className="h-full w-full object-cover" />
          ) : (
            <span>{avatarUrl}</span>
          )}
          <label className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[10px] text-purple-300 font-bold cursor-pointer">
            <UploadCloud className="h-4 w-4 mb-1" /> Change Node
            <input type="file" accept="image/*" onChange={handleAvatarFileSelection} className="hidden" disabled={uploadingImg} />
          </label>
        </div>
        <p className="text-muted-foreground/60 text-[10px]">Click avatar circle core boundary to upload a custom graphic asset.</p>
      </div>

      {/* PARAMETERS UPDATE FORM FIELD */}
      <form onSubmit={handleUpdateInfo} className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 space-y-4 backdrop-blur-md">
        
        {/* FIELD 1: Full Name */}
        <div className="space-y-1.5">
          <label className="text-muted-foreground font-bold tracking-wide flex items-center gap-1.5 uppercase text-[10px]">
            <Fingerprint className="h-3.5 w-3.5 text-purple-400" /> Legal Identity Matrix (Full Name)
          </label>
          <input 
            type="text" 
            value={fullName} 
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-black/40 border border-white/5 rounded-xl h-10 px-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors text-xs"
            placeholder="Enter your legal name string"
          />
        </div>

        {/* FIELD 2: Username */}
        <div className="space-y-1.5">
          <label className="text-muted-foreground font-bold tracking-wide flex items-center gap-1.5 uppercase text-[10px]">
            <User className="h-3.5 w-3.5 text-purple-400" /> Cloud Identity Identifier (Username)
          </label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-black/40 border border-white/5 rounded-xl h-10 px-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors text-xs"
            placeholder="Enter username string allocation"
            required
          />
        </div>

        {/* FIELD 3: Date of Birth */}
        <div className="space-y-1.5">
          <label className="text-muted-foreground font-bold tracking-wide flex items-center gap-1.5 uppercase text-[10px]">
            <Calendar className="h-3.5 w-3.5 text-purple-400" /> Age-Gate Verification Token (DOB)
          </label>
          <input 
            type="date" 
            value={dob} 
            onChange={(e) => setDob(e.target.value)}
            className="w-full bg-black/40 border border-white/5 rounded-xl h-10 px-3 text-purple-300 focus:outline-none focus:border-purple-500/50 transition-colors text-xs scheme-dark"
            required
          />
        </div>

        {/* FIELD 4: Mobile Number */}
        <div className="space-y-1.5">
          <label className="text-muted-foreground font-bold tracking-wide flex items-center gap-1.5 uppercase text-[10px]">
            <Phone className="h-3.5 w-3.5 text-purple-400" /> Secure Mobile Routing Vector
          </label>
          <input 
            type="text" 
            value={mobile} 
            onChange={(e) => setMobile(e.target.value)}
            className="w-full bg-black/40 border border-white/5 rounded-xl h-10 px-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors text-xs"
            placeholder="e.g. +919876543210"
          />
        </div>

        <Button 
          type="submit" 
          disabled={savingInfo}
          className="w-full h-10 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-xl transition-all cursor-pointer text-[11px]"
        >
          {savingInfo ? "Synchronizing Cloud Memory..." : "Commit Configuration Updates"}
        </Button>
      </form>

      {/* 🚨 THE DANGER ZONE */}
      <div className="bg-red-950/[0.05] border border-red-500/20 rounded-2xl p-5 space-y-3 backdrop-blur-md">
        <div className="flex items-center gap-1.5 text-red-400 font-bold uppercase tracking-wider text-[10px]">
          <AlertTriangle className="h-4 w-4 animate-bounce text-red-500" /> Critical System Danger Zone
        </div>
        <p className="text-muted-foreground/60 text-[10px] leading-relaxed">
          Purging your account will immediately erase your profile data structure, dynamic token hashes, and all encrypted cloud file assets mapped across our clusters and storage engines permanently.
        </p>
        <Button
          type="button"
          disabled={purgingAccount}
          onClick={handlePermanentAccountPurge}
          className="w-full h-10 bg-red-950/40 hover:bg-red-900/40 border border-red-500/30 text-red-400 font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 text-[11px]"
        >
          <Trash2 className="h-4 w-4" /> {purgingAccount ? "Executing Matrix Purge Sequence..." : "Purge Entire Account Node"}
        </Button>
      </div>

      <div className="flex items-center gap-1.5 justify-center text-[10px] text-muted-foreground/50 text-center uppercase tracking-wider font-bold pt-2">
        <ShieldCheck className="h-4 w-4 text-emerald-400" /> Data integrity parameters secured via matrix gateway.
      </div>
    </div>
  );
}
