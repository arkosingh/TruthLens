"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Shield, Zap, BarChart3, Sparkles } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";
import { FloatingShapes } from "./FloatingShapes";

const stats = [
  { value: 99, suffix: "%", label: "Accuracy",      icon: BarChart3, color: "#3B82F6" },
  { value: 50, suffix: "K+", label: "Scans Done",   icon: Zap,       color: "#06B6D4" },
  { value: 1,  suffix: "s",  label: "Analysis Time", icon: Shield,    color: "#8B5CF6" },
];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const textY   = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const gridY   = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const orbScale = useTransform(scrollYProgress, [0, 1], [1, 1.4]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
      style={{ background: "#030712" }}
    >
      {/* ── Radial orbs ─────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          style={{ scale: orbScale }}
          animate={{ opacity: [0.5, 0.75, 0.5] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-52 -right-52 w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)" }}
        />
        <motion.div
          style={{ scale: orbScale }}
          animate={{ opacity: [0.3, 0.55, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-72 -left-52 w-[900px] h-[900px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%)" }}
        />
        <motion.div
          animate={{ opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 7, repeat: Infinity, delay: 4 }}
          className="absolute top-1/3 left-1/3 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)" }}
        />
      </div>

      {/* ── 3-D grid floor ──────────────────────────────── */}
      <motion.div
        style={{ y: gridY }}
        className="absolute bottom-0 left-0 right-0 h-80 pointer-events-none"
      >
        <div style={{ perspective: "500px", height: "100%", overflow: "hidden" }}>
          <div className="perspective-grid" />
        </div>
        {/* fade into the bg */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#030712]/70 to-transparent pointer-events-none" />
      </motion.div>

      {/* ── Floating 3-D shapes ──────────────────────────── */}
      <FloatingShapes />

      {/* ── Particle field ──────────────────────────────── */}
      {Array.from({ length: 22 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width:  i % 3 === 0 ? 3 : 2,
            height: i % 3 === 0 ? 3 : 2,
            left:   `${(i * 17 + 5) % 95}%`,
            top:    `${(i * 11 + 8) % 82}%`,
            background: i % 3 === 0 ? "#3B82F6" : i % 3 === 1 ? "#06B6D4" : "#8B5CF6",
          }}
          animate={{
            y:       [0, -(15 + (i % 25)), 0],
            opacity: [0.15, 0.6, 0.15],
          }}
          transition={{
            duration: 3 + (i % 4),
            repeat: Infinity,
            delay:  (i * 0.22) % 3,
          }}
        />
      ))}

      {/* ── Main content ────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <motion.div className="text-center max-w-5xl mx-auto" style={{ y: textY }}>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur text-sm font-medium text-blue-300 mb-8"
          >
            <Sparkles className="w-4 h-4" />
            Powered by Gemini AI
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-8xl font-black tracking-tight leading-none mb-6"
          >
            <span className="block text-white drop-shadow-[0_0_30px_rgba(59,130,246,0.4)]">
              Preserve
            </span>
            <span className="block shimmer-text">
              What&apos;s Human
            </span>
          </motion.h1>

          {/* Sub-heading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.25 }}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Detect AI-generated content with sentence-level precision.
            Know exactly which words were written by a machine — instantly.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-20"
          >
            <Link
              href="/scan"
              className="group relative inline-flex items-center justify-center gap-2 px-9 py-4 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105"
              style={{
                background:  "linear-gradient(135deg,#2563EB 0%,#06B6D4 100%)",
                boxShadow:   "0 0 35px rgba(37,99,235,0.5), 0 0 70px rgba(6,182,212,0.2)",
              }}
            >
              Start Scanning — It&apos;s Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center px-9 py-4 rounded-full font-semibold text-slate-300 border border-white/15 hover:border-blue-400/50 hover:text-white hover:bg-blue-500/10 transition-all duration-300 backdrop-blur-sm"
            >
              See How It Works
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.5 }}
            className="grid grid-cols-3 gap-4 max-w-sm mx-auto"
          >
            {stats.map((s, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm text-center"
                style={{ boxShadow: `0 0 20px ${s.color}20` }}
              >
                <s.icon className="w-5 h-5 mx-auto mb-2" style={{ color: s.color }} />
                <div className="text-2xl font-black" style={{ color: s.color }}>
                  <AnimatedCounter target={s.value} suffix={s.suffix} />
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ── Scroll cue ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-3 rounded-full bg-blue-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}
