"use client";

import { motion } from "framer-motion";
import { FileText, Cpu, FileCheck } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "Paste Your Text",
    description:
      "Copy and paste the content you want to analyse. Supports up to 200,000 characters per scan.",
    color:    "#3B82F6",
    glow:     "rgba(59,130,246,0.6)",
    gradient: "135deg, #1D4ED8, #3B82F6",
  },
  {
    number: "02",
    icon: Cpu,
    title: "Gemini Analyses",
    description:
      "Our Gemini-powered engine examines every sentence — patterns, vocabulary, structure, semantic flow.",
    color:    "#8B5CF6",
    glow:     "rgba(139,92,246,0.6)",
    gradient: "135deg, #6D28D9, #8B5CF6",
  },
  {
    number: "03",
    icon: FileCheck,
    title: "Get Results",
    description:
      "Receive detailed insights — overall AI probability, colour-coded sentence breakdown, and a downloadable report.",
    color:    "#06B6D4",
    glow:     "rgba(6,182,212,0.6)",
    gradient: "135deg, #0284C7, #06B6D4",
  },
];

const container = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const item = {
  hidden:  { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative py-24 lg:py-36 overflow-hidden"
      style={{ background: "#030712" }}
    >
      {/* bg accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 100%, rgba(139,92,246,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-24"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-sm font-medium text-violet-300 mb-5">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-5">
            How It{" "}
            <span className="shimmer-text">Works</span>
          </h2>
          <p className="text-lg text-slate-400">
            Accurate AI detection results in seconds with our streamlined three-step process.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="relative grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8"
        >
          {/* Animated connecting line (desktop) */}
          <div className="hidden lg:block absolute top-10 left-[calc(16.67%+32px)] right-[calc(16.67%+32px)] h-px z-0">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.6, ease: "easeInOut" }}
              className="h-full origin-left"
              style={{
                background: "linear-gradient(90deg, #3B82F6, #8B5CF6, #06B6D4)",
                boxShadow:  "0 0 12px rgba(139,92,246,0.6)",
              }}
            />
          </div>

          {steps.map((step, i) => (
            <motion.div key={step.number} variants={item} className="relative text-center group">
              {/* Large ghost number */}
              <div
                className="absolute -top-6 left-1/2 -translate-x-1/2 text-8xl font-black select-none pointer-events-none"
                style={{ color: step.color, opacity: 0.06, lineHeight: 1 }}
              >
                {step.number}
              </div>

              {/* Icon circle */}
              <div className="relative z-10 inline-flex flex-col items-center mb-8">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300"
                  style={{
                    background: `linear-gradient(${step.gradient})`,
                    boxShadow:  `0 0 30px ${step.glow}`,
                  }}
                >
                  <step.icon className="w-9 h-9 text-white" />
                </motion.div>
                <span
                  className="text-sm font-black tracking-widest uppercase"
                  style={{ color: step.color }}
                >
                  Step {step.number}
                </span>
              </div>

              {/* Content card */}
              <div
                className="relative rounded-2xl p-8 border transition-all duration-300 group-hover:border-opacity-60"
                style={{
                  background:    "rgba(15,23,42,0.7)",
                  borderColor:   step.color + "30",
                  backdropFilter: "blur(10px)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 40px ${step.glow.replace("0.6","0.2")}`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed">{step.description}</p>

                {/* step index badge */}
                <div
                  className="absolute -top-3 -right-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white"
                  style={{
                    background: `linear-gradient(${step.gradient})`,
                    boxShadow:  `0 0 12px ${step.glow}`,
                  }}
                >
                  {i + 1}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
