"use client";

import { motion } from "framer-motion";
import { Brain, Search, History, Fingerprint, Lock, Gauge } from "lucide-react";
import { TiltCard } from "./TiltCard";

const features = [
  {
    icon: Brain,
    title: "AI Detection",
    description: "Advanced algorithms score every sentence for AI probability using Gemini's language understanding.",
    gradient: "135deg, #2563EB, #06B6D4",
    glow:     "rgba(37,99,235,0.5)",
    border:   "rgba(59,130,246,0.35)",
  },
  {
    icon: Fingerprint,
    title: "Sentence Analysis",
    description: "Every sentence colour-coded — green for human, red for AI. No guesswork, pure precision.",
    gradient: "135deg, #7C3AED, #8B5CF6",
    glow:     "rgba(139,92,246,0.5)",
    border:   "rgba(139,92,246,0.35)",
  },
  {
    icon: History,
    title: "Scan History",
    description: "Every analysis saved locally. Browse past scans, compare results, and download full PDF reports.",
    gradient: "135deg, #059669, #10B981",
    glow:     "rgba(16,185,129,0.5)",
    border:   "rgba(16,185,129,0.35)",
  },
  {
    icon: Gauge,
    title: "Instant Results",
    description: "Full analysis in under 2 seconds. No queues, no waits — real-time detection at any scale.",
    gradient: "135deg, #D97706, #F59E0B",
    glow:     "rgba(245,158,11,0.5)",
    border:   "rgba(245,158,11,0.35)",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "Your text never leaves your session without consent. Local storage keeps your data entirely yours.",
    gradient: "135deg, #DC2626, #EF4444",
    glow:     "rgba(239,68,68,0.5)",
    border:   "rgba(239,68,68,0.35)",
  },
  {
    icon: Search,
    title: "Deep Inspection",
    description: "Beyond surface patterns — vocabulary distribution, sentence rhythm, and semantic flow all examined.",
    gradient: "135deg, #0284C7, #06B6D4",
    glow:     "rgba(6,182,212,0.5)",
    border:   "rgba(6,182,212,0.35)",
  },
];

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export function Features() {
  return (
    <section
      className="relative py-24 lg:py-36 overflow-hidden"
      style={{ background: "#050A14" }}
    >
      {/* subtle bg glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(37,99,235,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-sm font-medium text-blue-300 mb-5">
            Powerful Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-5">
            Everything You Need to{" "}
            <span className="shimmer-text">Verify Content</span>
          </h2>
          <p className="text-lg text-slate-400">
            Our comprehensive toolkit helps educators, publishers, and content creators
            ensure authenticity in an AI-powered world.
          </p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((f) => (
            <motion.div key={f.title} variants={item}>
              <TiltCard tiltMaxAngle={8} glareEnable className="h-full">
                <div
                  className="neon-card relative h-full rounded-2xl p-8 border"
                  style={{
                    background: "rgba(15,23,42,0.85)",
                    borderColor: f.border,
                    backdropFilter: "blur(12px)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 40px ${f.glow}, inset 0 0 20px ${f.glow.replace("0.5", "0.07")}`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                    style={{ background: `linear-gradient(${f.gradient})`, boxShadow: `0 0 20px ${f.glow}` }}
                  >
                    <f.icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{f.description}</p>

                  {/* corner accent */}
                  <div
                    className="absolute top-0 right-0 w-20 h-20 rounded-tr-2xl rounded-bl-full opacity-30"
                    style={{ background: `linear-gradient(${f.gradient})`, filter: "blur(20px)" }}
                  />
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
