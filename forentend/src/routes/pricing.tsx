// src/routes/pricing.tsx

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, Sparkles, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Stardust } from "@/components/cosmos/Stardust";
import { SiteNav } from "@/components/cosmos/SiteNav";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    title: "Pricing Plans — Cosmos Media Cloud",
    meta: [
      { name: "description", content: "Flexible, transparent pricing specs. Check out our sub-orbital compute configurations." },
    ],
  }),
  component: Pricing,
});

// 🎨 COMPREHENSIVE PRODUCTION METADATA MATRIX (Loaded with all 6 metric dimensions)
const planVisualMetadata: Record<string, { desc: string; features: { label: string; val: string }[] }> = {
  free: {
    desc: "Baseline sandbox environment for testing core media routing vectors.",
    features: [
      { label: "Storage Limit", val: "500 MB Basic Storage" },
      { label: "Download Limit", val: "5 Total Conversion Hits" },
      { label: "Request Velocity", val: "60 Requests / hr Limit" },
      { label: "Device/Sign-in Limit", val: "1 Session Absolute Lock" },
      { label: "System Support", val: "Discord Public Community" },
      { label: "Extraction Priority", val: "Standard Unprioritized Pipe" },
    ]
  },
  test: {
    desc: "Active live simulation handshake node for verification tracking loops.",
    features: [
      { label: "Storage Limit", val: "100 MB Sandbox Space" },
      { label: "Download Limit", val: "15 Total Plan Downloads" },
      { label: "Request Velocity", val: "100 Inbound Requests / hr" },
      { label: "Device/Sign-in Limit", val: "1 Active Session Node" },
      { label: "System Support", val: "Standard Email Support" },
      { label: "Extraction Priority", val: "Low Priority Queues" },
    ]
  },
  weekly: {
    desc: "Short-term bursting pipeline resources for quick projects.",
    features: [
      { label: "Storage Limit", val: "10 GB High-Speed Pool" },
      { label: "Download Limit", val: "50 Downloads / Week" },
      { label: "Request Velocity", val: "Unlimited Inbound Links" },
      { label: "Device/Sign-in Limit", val: "2 Concurrent Devices" },
      { label: "System Support", val: "Standard Ticket Channel" },
      { label: "Extraction Priority", val: "Medium Cluster Routing" },
    ]
  },
  monthly: {
    desc: "High-throughput production engine for creators.",
    features: [
      { label: "Storage Limit", val: "50 GB Dedicated Pool" },
      { label: "Download Limit", val: "250 Downloads / Month" },
      { label: "Request Velocity", val: "Unlimited Inbound Links" },
      { label: "Device/Sign-in Limit", val: "3 Concurrent Devices" },
      { label: "System Support", val: "Priority Support Routing" },
      { label: "Extraction Priority", val: "High Priority Edge Scraping" },
    ]
  },
  twomonths: {
    desc: "Expanded resource envelope for accelerating storage scale.",
    features: [
      { label: "Storage Limit", val: "120 GB Massive Storage" },
      { label: "Download Limit", val: "600 Total Downloads" },
      { label: "Request Velocity", val: "Unlimited Inbound Links" },
      { label: "Device/Sign-in Limit", val: "5 Active Device Slots" },
      { label: "System Support", val: "Priority Support Routing" },
      { label: "Extraction Priority", val: "High Priority Edge Scraping" },
    ]
  },
  fourmonths: {
    desc: "Mid-tier powerhouse cluster built for heavy video upload channels.",
    features: [
      { label: "Storage Limit", val: "250 GB Dedicated Pool" },
      { label: "Download Limit", val: "1,500 Total Downloads" },
      { label: "Request Velocity", val: "Unlimited Inbound Links" },
      { label: "Device/Sign-in Limit", val: "8 Active Device Slots" },
      { label: "System Support", val: "24/7 Core Operations Line" },
      { label: "Extraction Priority", val: "Ultra-Fast Transcoding Nodes" },
    ]
  },
  sixmonths: {
    desc: "Ultimate semi-annual bandwidth matrix for full production teams.",
    features: [
      { label: "Storage Limit", val: "500 GB Ultra Cluster Vault" },
      { label: "Download Limit", val: "4,000 Total Downloads" },
      { label: "Request Velocity", val: "Unlimited Inbound Links" },
      { label: "Device/Sign-in Limit", val: "15 Active Device Slots" },
      { label: "System Support", val: "24/7 Dedicated Support Node" },
      { label: "Extraction Priority", val: "Max Priority Transcoding Engine" },
    ]
  },
  yearly: {
    desc: "Maximum stellar capability with total resource efficiency.",
    features: [
      { label: "Storage Limit", val: "1 TB Supreme Storage Vault" },
      { label: "Download Limit", val: "99,999 Downloads (Unlimited)" },
      { label: "Request Velocity", val: "Unlimited Inbound Links" },
      { label: "Device/Sign-in Limit", val: "Unlimited Device Sessions" },
      { label: "System Support", val: "24/7 VIP Kernel Priority Direct" },
      { label: "Extraction Priority", val: "Absolute Cluster Supremacy" },
    ]
  }
};

function Pricing() {
  const navigate = useNavigate();
  
  // 🔥 FIXED BRAND ROUTE ENGINE: Points safely to the primary brand domain
  const BACKEND_URL = "https://api.cosmostream.in";
  
  const [livePlans, setLivePlans] = useState<any[]>([]);
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [currentInterval, setCurrentInterval] = useState<string>("free");

  const syncClusterState = async () => {
    const secureToken = localStorage.getItem("cosmos_token");
    
    if (!secureToken) {
      const publicPlansFallback = [
        { interval: "free", name: "Free Tier", price: 0, storage_limit_mb: 500, is_current: true, allow_purchase: false, tier_type: "downgrade_free" },
        { interval: "test", name: "Spark", price: 1, storage_limit_mb: 100, is_current: false, allow_purchase: true, tier_type: "upgrade" },
        { interval: "weekly", name: "Orbit", price: 49, storage_limit_mb: 10240, is_current: false, allow_purchase: true, tier_type: "upgrade" },
        { interval: "monthly", name: "Nebula", price: 199, storage_limit_mb: 51200, is_current: false, allow_purchase: true, tier_type: "upgrade" },
        { interval: "twomonths", name: "Galaxy", price: 349, storage_limit_mb: 122880, is_current: false, allow_purchase: true, tier_type: "upgrade" },
        { interval: "fourmonths", name: "Quasar", price: 649, storage_limit_mb: 256000, is_current: false, allow_purchase: true, tier_type: "upgrade" },
        { interval: "sixmonths", name: "Supernova", price: 899, storage_limit_mb: 512000, is_current: false, allow_purchase: true, tier_type: "upgrade" },
        { interval: "yearly", name: "Infinity", price: 1999, storage_limit_mb: 1024000, is_current: false, allow_purchase: true, tier_type: "upgrade" }
      ];
      setLivePlans(publicPlansFallback);
      setCurrentInterval("free");
      setPageLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`${BACKEND_URL}/payments/plans`, {
        method: "GET",
        headers: {
          "X-API-Key": secureToken,
          "Authorization": `Bearer ${secureToken}`
        }
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setLivePlans(data.plans);
        setCurrentInterval(data.current_user_interval);
      }
    } catch (err) {
      console.error("Failed syncing cloud tier layout models.", err);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    syncClusterState();
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const handlePlanSubscription = async (intervalType: string) => {
    try {
      const secureToken = localStorage.getItem("cosmos_token");
      
      if (!secureToken) {
        toast.error("Pehle authentication cloud clear kijiye. Redirecting to login...");
        navigate({ to: "/auth" });
        return;
      }

      toast.loading("Deploying plan validation matrix...");

      const response = await fetch(`${BACKEND_URL}/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": secureToken,
          "Authorization": `Bearer ${secureToken}`
        },
        body: JSON.stringify({ interval: intervalType })
      });

      toast.dismiss();
      const orderData = await response.json();

      if (!response.ok || !orderData.success) {
        toast.error(orderData.detail || "Order initialization dropped by cloud server.");
        return;
      }

      if (orderData.order_id === null && orderData.interval === "free") {
        toast.success("🎉 Shifted back to Free Tier baseline parameters successfully!");
        setPageLoading(true);
        await syncClusterState(); 
        navigate({ to: "/dashboard" });
        return;
      }

      if (!(window as any).Razorpay) {
        toast.error("Razorpay network initialization failure.");
        return;
      }

      // 🛡️ RAZORPAY SECURITY INTERCEPT: Explicitly sanitize and force integers to prevent 400 bad request errors
      const options = {
        key: "rzp_live_T87WGgYpxA7kJ4",
        amount: Math.round(Number(orderData.amount)), 
        currency: orderData.currency,
        name: "Cosmos Media Cloud",
        description: `Activation parameters for interval: ${intervalType.toUpperCase()}`,
        order_id: orderData.order_id, 
        handler: async function (paymentResponse: any) {
          toast.loading("Verifying security authorization signatures...");
          
          const verifyRoute = await fetch(`${BACKEND_URL}/payments/verify-payment`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-API-Key": secureToken,
              "Authorization": `Bearer ${secureToken}`
            },
            body: JSON.stringify({
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
              interval: intervalType
            })
          });

          toast.dismiss();
          const verifyData = await verifyRoute.json();

          if (verifyRoute.ok && verifyData.success) {
            toast.success("🎉 Plan credentials activated inside database parameters!");
            navigate({ to: "/dashboard" });
          } else {
            toast.error(verifyData.detail || "Verification failed at cluster nodes.");
          }
        },
        theme: { color: "#a855f7" }
      };

      const checkoutGateway = new (window as any).Razorpay(options);
      checkoutGateway.open();

    } catch (err) {
      toast.dismiss();
      toast.error("Billing network matrix synchronization error.");
    }
  };

  return (
    <div className="relative min-h-screen text-white bg-[#06070a] font-sans selection:bg-purple-500/20 overflow-x-hidden">
      <Stardust />
      <SiteNav />

      <section className="relative mx-auto max-w-7xl px-8 pt-12 pb-6 text-center z-10">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/5 px-4 py-1.5 text-[11px] font-mono uppercase tracking-wider text-purple-400">
          <Sparkles className="h-3.5 w-3.5 text-purple-400 animate-pulse" /> Localized Inbound Settlement · Razorpay ₹ SECURE
        </div>
        <h1 className="mx-auto mt-4 max-w-4xl text-3xl font-black font-mono tracking-tight uppercase text-neutral-100 md:text-5xl leading-tight">
          Select Your Compute <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-500 bg-clip-text text-transparent">Subscription Orbit</span>
        </h1>
      </section>

      {pageLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-3 font-mono text-xs text-purple-400/70">
          <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
          <span>Synchronizing available cluster bandwidth maps...</span>
        </div>
      ) : (
        <section className="relative mx-auto grid max-w-[90rem] gap-4 px-4 pb-16 sm:px-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 z-10">
          
          {livePlans.map((t) => {
            const visual = planVisualMetadata[t.interval] || { desc: "Custom configuration node.", features: [] };
            const isBestChoice = t.interval === "sixmonths";

            return (
              <div
                key={t.interval}
                className={`bg-white/[0.01] border border-white/5 rounded-2xl p-5 shadow-2xl relative flex flex-col justify-between backdrop-blur-md transition-all duration-300 hover:-translate-y-1 ${
                  isBestChoice ? "border-purple-500/40 bg-gradient-to-b from-purple-950/[0.04] to-transparent shadow-purple-950/20" : ""
                } ${t.is_current ? "border-purple-500/30 bg-purple-950/[0.02]" : ""}`}
              >
                {isBestChoice && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-2.5 py-1 text-[8px] font-mono font-black uppercase tracking-widest text-white shadow-lg z-20">
                    ⭐ BEST CHOICE
                  </div>
                )}

                <div>
                  <div className={`font-mono text-[11px] font-black tracking-wider uppercase ${isBestChoice || t.is_current ? "text-purple-400" : "text-neutral-200"}`}>
                    {t.name} {t.is_current && " (Active)"}
                  </div>
                  <p className="mt-1.5 text-[10px] text-neutral-400/60 font-mono min-h-[40px]">{visual.desc}</p>
                  <div className="mt-3 flex items-baseline gap-1 border-b border-white/5 pb-3">
                    <span className="text-3xl font-black font-mono tracking-tight text-white">₹{t.price}</span>
                    <span className="text-[10px] font-mono text-neutral-400/50">
                      {t.interval === "free" ? "/ forever" : `/ ${t.interval}`}
                    </span>
                  </div>
                  
                  <ul className="mt-4 space-y-3 font-mono text-[10px]">
                    {visual.features.map((f, idx) => (
                      <li key={idx} className="border-b border-white/[0.02] last:border-none pb-1.5 last:pb-1 flex flex-col gap-0.5">
                        <span className="text-neutral-400/40 uppercase text-[8px] tracking-wide">{f.label}</span>
                        <span className="text-neutral-200 flex items-center gap-1">
                          <Check className="h-3 w-3 text-purple-400 shrink-0" /> {f.val}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  disabled={!t.allow_purchase}
                  onClick={() => handlePlanSubscription(t.interval)}
                  className={`mt-5 h-10 font-mono text-[11px] font-bold tracking-wide rounded-xl transition-all ${
                    t.is_current 
                      ? "bg-white/5 text-neutral-500 cursor-not-allowed" 
                      : isBestChoice 
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white cursor-pointer shadow-md shadow-purple-950" 
                        : "bg-white/5 text-white hover:bg-white/10 cursor-pointer"
                  }`}
                >
                  {t.is_current 
                    ? "Current Active Orbit" 
                    : t.interval === "free"
                      ? "Downgrade to Free"
                      : t.tier_type === "upgrade" 
                        ? "Upgrade Orbit" 
                        : "Switch Orbit"} 
                  <ArrowRight className="ml-1 h-3 w-3 opacity-70" />
                </Button>
              </div>
            );
          })}
        </section>
      )}

      {/* FOOTER ASSURANCE SECURITY SIGNATURE */}
      <div className="text-center pb-8 z-10 relative">
        <div className="inline-flex items-center gap-1.5 text-[10px] text-neutral-400/30 font-mono uppercase tracking-wide">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Multi-Cluster Resource parameters locked down via strict hardware virtualization wrappers.
        </div>
      </div>
    </div>
  );
}
