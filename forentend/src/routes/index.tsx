import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, Zap, Link2, Scissors, Code2, BarChart3, ArrowRight, Wand2 } from "lucide-react";
import { Stardust } from "@/components/cosmos/Stardust";
import { SiteNav } from "@/components/cosmos/SiteNav";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cosmos Media Cloud — Convert, host & stream media at light-speed" },
      {
        name: "description",
        content:
          "Cosmos Media Cloud: convert video, generate permanent streaming links, edit in-browser, and ship with a developer-friendly API. Deep-space speed for modern media.",
      },
      { property: "og:title", content: "Cosmos Media Cloud" },
      {
        property: "og:description",
        content: "Convert, host, edit and stream any media at light-speed with a single API.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: Wand2,
    title: "Media Converter Ingest",
    desc: "Video → GIF, image → WebP transcode matrices. Direct cluster pipeline uploads with zero data truncation.",
  },
  {
    icon: Link2,
    title: "Triple-Layer Failover Links",
    desc: "Assets are redundant-mirrored across three distinct isolated private data backup cloud channels instantly.",
  },
  {
    icon: Scissors,
    title: "In-Browser Editing Suite",
    desc: "Trim clips, split frames client-side inside browser memory loops via ffmpeg.wasm. Zero network overhead latency.",
  },
  {
    icon: Code2,
    title: "Developer Integration Hub",
    desc: "Generate production API keys and system credentials. Simply pass X-API-Key header to route stream nodes.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Telemetry Logs",
    desc: "Live aggregated dashboards for tracking storage constraints, lifetime request hits, and egress bandwidth logs.",
  },
  {
    icon: Zap,
    title: "Stardust Network Mesh",
    desc: "Globally provisioned proxy routes optimized for sub-50ms streaming video packet transfers anywhere.",
  },
];

function Landing() {
  const BACKEND_URL = "https://shadowapiweb.onrender.com";

  return (
    <div className="relative min-h-screen text-white bg-[#06070a] font-sans selection:bg-purple-500/20 overflow-x-hidden">
      <Stardust />
      <SiteNav />

      {/* HERO SECTION BLOCK */}
      <section className="relative mx-auto max-w-7xl px-6 pt-24 pb-32 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/5 px-4 py-1.5 text-[11px] font-mono uppercase tracking-wider text-purple-400"
        >
          <Sparkles className="h-3.5 w-3.5 text-purple-400 animate-pulse" />
          <span>Platform Live Production Beta Node Available</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mx-auto mt-8 max-w-5xl text-5xl font-black leading-[1.05] tracking-tight md:text-7xl uppercase font-mono"
        >
          Your cloud media,{" "}
          <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-500 bg-clip-text text-transparent">
            at the speed of light.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-xs md:text-sm text-muted-foreground/90 font-mono leading-relaxed"
        >
          A high-performance unified multi-tenant architecture for mapping, processing, and streaming large scale asset bundles. Powered by developer-first deployment environments.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-mono text-xs font-bold tracking-wider rounded-xl h-12 px-6 shadow-xl shadow-purple-950/20">
            <Link to="/dashboard">
              Launch Control Console <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white/5 bg-white/[0.01] hover:bg-white/[0.04] text-white font-mono text-xs h-12 px-6 rounded-xl">
            <Link to="/pricing">Review Matrix Tiers</Link>
          </Button>
        </motion.div>

        {/* FLOATING SYSTEM TERMINAL WIDGET */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="relative mx-auto mt-20 max-w-4xl shadow-2xl rounded-2xl"
        >
          <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-2 backdrop-blur-md">
            <div className="rounded-xl border border-white/5 bg-black/60 p-6 text-left font-mono text-xs relative overflow-hidden">
              <div className="mb-4 flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/40" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/40" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/40" />
              </div>
              <pre className="overflow-x-auto text-[11px] leading-relaxed text-neutral-300">
{`$ curl ${BACKEND_URL}/upload \\
    -H `}<span className="text-purple-400 font-bold">{`"X-API-Key: cosmos_sk_live_9b2f...4a7c"`}</span>{` \\
    -F "file=@nebula.mp4" \\
    -F "to=webp"

`}<span className="text-emerald-400">{`{ 
  "success": true,
  "url": "${BACKEND_URL}/f/cosmos_asset_9b2f4a7c",
  "size_mb": 2.14, 
  "redundancy_layers": "Triple-Failover Active" 
}`}</span>
              </pre>
            </div>
          </div>
        </motion.div>
      </section>

      {/* HARDWARE UTILITIES METRICS GRID */}
      <section className="mx-auto max-w-7xl px-8 pb-32 relative z-10">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-black font-mono tracking-tight md:text-5xl uppercase">
            One Unified Interface for <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Every Frame Node</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-xs md:text-sm font-mono text-muted-foreground/80 leading-relaxed">
            From an automated curl upload request block to decentralized asset caching arrays — data pipelines run fully automated.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/20 group hover:shadow-2xl relative overflow-hidden"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/10 group-hover:scale-105 transition-transform">
                <f.icon className="h-5 w-5 stroke-[1.5]" />
              </div>
              <h3 className="text-base font-bold font-mono tracking-wide text-neutral-200 group-hover:text-purple-300 transition-colors uppercase">{f.title}</h3>
              <p className="mt-2 text-xs font-mono text-muted-foreground/70 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PIPELINE FINALIZE WORKSPACE CTA SECTION */}
      <section className="mx-auto max-w-5xl px-8 pb-32 relative z-10">
        <div className="bg-white/[0.01] border border-white/5 relative overflow-hidden rounded-3xl p-12 text-center backdrop-blur-md">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-purple-600/5 via-indigo-600/5 to-transparent opacity-40" />
          <h2 className="text-3xl font-black font-mono tracking-wider uppercase text-neutral-100 md:text-4xl">
            Initialize Space Allocations
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-xs md:text-sm font-mono text-muted-foreground/80 leading-relaxed">
            Spin up a secure custom account node partition in micro-seconds. Zero transaction footprint. 500 MB storage delta free vector.
          </p>
          <Button asChild size="lg" className="mt-8 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-mono text-xs font-bold tracking-wider rounded-xl h-12 px-6 shadow-xl">
            <Link to="/dashboard">Open Management Console <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-white/5 py-10 text-center font-mono text-[11px] text-muted-foreground/60 relative z-10">
        © {new Date().getFullYear()} Cosmos Media Cloud Architecture Cluster · Synchronized Systems.
      </footer>
    </div>
  );
}
