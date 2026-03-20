"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Shield, Zap, BarChart3 } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";
import { FloatingShapes } from "./FloatingShapes";

const stats = [
  { value: 99, suffix: "%", label: "Accuracy" },
  { value: 50, suffix: "K+", label: "Scans" },
  { value: 1, suffix: "s", label: "Real-time Analysis" },
];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const orbScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <motion.div className="absolute inset-0 overflow-hidden" style={{ y: bgY }}>
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-blue-50/50 to-cyan-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800" />

        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/20 dark:bg-primary/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          style={{ scale: orbScale }}
          className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 dark:bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 6, repeat: Infinity, delay: 1 }}
          style={{ scale: orbScale }}
          className="absolute bottom-1/4 -right-32 w-80 h-80 bg-accent/20 dark:bg-accent/10 rounded-full blur-3xl"
        />
      </motion.div>

      <FloatingShapes />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <motion.div className="text-center max-w-4xl mx-auto" style={{ y: textY }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border border-primary/20 dark:border-primary/30 shadow-lg shadow-primary/10 mb-8"
          >
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Trusted by 50,000+ users worldwide
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="text-slate-900 dark:text-white">Preserve</span>{" "}
            <span className="bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">
              What&apos;s Human
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10"
          >
            AI content detection and plagiarism checking you can trust.
            Instantly analyze text to identify AI-generated content with
            sentence-level precision.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link
              href="/scan"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-full hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              Start Scanning — It&apos;s Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-full border border-slate-200 dark:border-slate-700 hover:border-primary/30 dark:hover:border-primary/30 hover:text-primary dark:hover:text-primary transition-all duration-300"
            >
              Learn More
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  {index === 0 && <BarChart3 className="w-4 h-4 text-primary" />}
                  {index === 1 && <Zap className="w-4 h-4 text-accent" />}
                  {index === 2 && <Shield className="w-4 h-4 text-success" />}
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-start justify-center p-1"
          >
            <motion.div className="w-1.5 h-3 bg-slate-400 dark:bg-slate-500 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
