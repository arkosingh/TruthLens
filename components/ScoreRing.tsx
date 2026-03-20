"use client";

import { motion } from "framer-motion";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  verdict: "human" | "mixed" | "ai";
}

export function ScoreRing({
  score,
  size = 180,
  strokeWidth = 12,
  verdict,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const getColor = () => {
    switch (verdict) {
      case "human":
        return "#10B981";
      case "mixed":
        return "#F59E0B";
      case "ai":
        return "#EF4444";
    }
  };

  const color = getColor();
  const shadowSize = Math.max(20, (score / 100) * 60);

  return (
    <motion.div
      className="relative"
      style={{ width: size, height: size, perspective: 800 }}
      initial={{ rotateY: -15 }}
      animate={{ rotateY: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div
        className="absolute rounded-full blur-2xl opacity-30 dark:opacity-40"
        style={{
          inset: `${30 - shadowSize / 4}%`,
          backgroundColor: color,
          transition: "all 0.5s ease",
        }}
      />

      <svg width={size} height={size} className="transform -rotate-90 relative z-10">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-200 dark:text-slate-700"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            filter: `drop-shadow(0 0 ${shadowSize / 4}px ${color}40)`,
          }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-4xl font-bold"
          style={{ color }}
        >
          {score}%
        </motion.span>
        <span className="text-xs text-slate-400 dark:text-slate-500 mt-1">AI Probability</span>
      </div>
    </motion.div>
  );
}
