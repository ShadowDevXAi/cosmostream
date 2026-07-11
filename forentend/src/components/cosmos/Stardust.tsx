import { useMemo } from "react";

/** Animated hardware-accelerated starfield background — pure CSS orchestration. */
export function Stardust() {
  const stars = useMemo(
    () =>
      Array.from({ length: 80 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        delay: Math.random() * 6,
        duration: Math.random() * 4 + 3,
      })),
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#06070a] select-none">
      
      {/* 🌌 HARDWARE-ACCELERATED DYNAMIC PULSING STARS CORES */}
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white will-change-[opacity,transform] transform-gpu translate-z-0 backface-hidden opacity-60"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animation: `pulse-glow ${s.duration}s ease-in-out ${s.delay}s infinite`,
            boxShadow: `0 0 ${s.size * 4}px rgba(168, 85, 247, 0.6)`,
          }}
        />
      ))}

      {/* 🔮 SYSTEM NEBULA AMBIENT GLOW MATRICES (OKLCH Smooth Intermixing Spaces) */}
      <div
        className="absolute -top-40 left-1/4 h-[600px] w-[600px] rounded-full opacity-25 blur-3xl will-change-transform transform-gpu pointer-events-none select-none"
        style={{ background: "radial-gradient(circle, oklch(0.72 0.21 285), transparent 75%)" }}
      />
      <div
        className="absolute top-1/3 right-0 h-[500px] w-[500px] rounded-full opacity-15 blur-3xl will-change-transform transform-gpu pointer-events-none select-none"
        style={{ background: "radial-gradient(circle, oklch(0.74 0.18 240), transparent 75%)" }}
      />
      <div
        className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full opacity-15 blur-3xl will-change-transform transform-gpu pointer-events-none select-none"
        style={{ background: "radial-gradient(circle, oklch(0.65 0.25 320), transparent 75%)" }}
      />
      
    </div>
  );
}
