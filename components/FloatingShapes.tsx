"use client";

import { motion } from "framer-motion";

const shapes = [
  {
    type: "cube",
    size: 60,
    position: { top: "15%", left: "8%" },
    duration: 20,
    delay: 0,
    color: "from-blue-500/25 to-cyan-500/25",
    darkGlow: "0 0 40px rgba(59,130,246,0.3)",
  },
  {
    type: "sphere",
    size: 80,
    position: { top: "25%", right: "12%" },
    duration: 18,
    delay: 2,
    color: "from-cyan-500/20 to-blue-500/20",
    darkGlow: "0 0 50px rgba(6,182,212,0.3)",
  },
  {
    type: "octahedron",
    size: 50,
    position: { bottom: "30%", left: "15%" },
    duration: 22,
    delay: 1,
    color: "from-blue-400/20 to-indigo-500/20",
    darkGlow: "0 0 35px rgba(99,102,241,0.3)",
  },
  {
    type: "torus",
    size: 70,
    position: { top: "60%", right: "8%" },
    duration: 25,
    delay: 3,
    color: "from-violet-500/20 to-blue-500/20",
    darkGlow: "0 0 45px rgba(139,92,246,0.3)",
  },
  {
    type: "cube",
    size: 45,
    position: { top: "75%", left: "25%" },
    duration: 19,
    delay: 4,
    color: "from-cyan-400/25 to-emerald-500/25",
    darkGlow: "0 0 30px rgba(6,182,212,0.3)",
  },
  {
    type: "sphere",
    size: 55,
    position: { top: "10%", left: "45%" },
    duration: 16,
    delay: 1.5,
    color: "from-blue-500/15 to-cyan-500/15",
    darkGlow: "0 0 35px rgba(59,130,246,0.25)",
  },
  {
    type: "octahedron",
    size: 40,
    position: { top: "45%", left: "5%" },
    duration: 21,
    delay: 2.5,
    color: "from-indigo-500/20 to-violet-500/20",
    darkGlow: "0 0 30px rgba(99,102,241,0.25)",
  },
];

function ShapeRenderer({ type, size }: { type: string; size: number }) {
  if (type === "cube") {
    const half = size / 2;
    return (
      <div
        className="relative"
        style={{
          width: size,
          height: size,
          transformStyle: "preserve-3d",
        }}
      >
        {[
          { transform: `translateZ(${half}px)` },
          { transform: `rotateY(180deg) translateZ(${half}px)` },
          { transform: `rotateY(90deg) translateZ(${half}px)` },
          { transform: `rotateY(-90deg) translateZ(${half}px)` },
          { transform: `rotateX(90deg) translateZ(${half}px)` },
          { transform: `rotateX(-90deg) translateZ(${half}px)` },
        ].map((style, i) => (
          <div
            key={i}
            className="absolute inset-0 border border-blue-400/30 dark:border-blue-400/40 bg-blue-500/5 dark:bg-blue-400/10 backdrop-blur-[2px]"
            style={style}
          />
        ))}
      </div>
    );
  }

  if (type === "sphere") {
    return (
      <div
        className="rounded-full bg-gradient-to-br from-blue-400/15 to-cyan-400/15 dark:from-blue-400/20 dark:to-cyan-400/20 border border-white/20 dark:border-blue-400/30 backdrop-blur-[2px]"
        style={{ width: size, height: size }}
      />
    );
  }

  if (type === "torus") {
    return (
      <div
        className="rounded-full border-[6px] border-violet-400/25 dark:border-violet-400/35"
        style={{ width: size, height: size }}
      />
    );
  }

  // octahedron — diamond shape
  return (
    <div style={{ width: size, height: size }} className="relative">
      <div
        className="absolute inset-[15%] border border-indigo-400/30 dark:border-indigo-400/40 bg-indigo-500/5 dark:bg-indigo-400/10 backdrop-blur-[2px]"
        style={{ transform: "rotate(45deg)" }}
      />
    </div>
  );
}

export function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ perspective: 800 }}>
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            ...shape.position,
            transformStyle: "preserve-3d",
          }}
          animate={{
            rotateX: [0, 360],
            rotateY: [0, 360],
            y: [0, -20, 0],
          }}
          transition={{
            rotateX: { duration: shape.duration, repeat: Infinity, ease: "linear" },
            rotateY: { duration: shape.duration * 0.7, repeat: Infinity, ease: "linear" },
            y: { duration: shape.duration * 0.3, repeat: Infinity, ease: "easeInOut", delay: shape.delay },
          }}
        >
          <div className="dark:drop-shadow-[var(--glow)]" style={{ "--glow": shape.darkGlow } as React.CSSProperties}>
            <ShapeRenderer type={shape.type} size={shape.size} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
