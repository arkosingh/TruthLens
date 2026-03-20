"use client";

import { motion } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";

interface ScanButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
}

export function ScanButton({ onClick, disabled, isLoading }: ScanButtonProps) {
  return (
    <div style={{ perspective: 600 }}>
      <motion.button
        whileHover={
          !disabled && !isLoading
            ? { scale: 1.02, translateZ: 4 }
            : {}
        }
        whileTap={
          !disabled && !isLoading
            ? { scale: 0.98, translateZ: -4 }
            : {}
        }
        onClick={onClick}
        disabled={disabled || isLoading}
        className={`relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 font-semibold rounded-full transition-all duration-300 overflow-hidden ${
          disabled && !isLoading
            ? "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
            : "bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-xl hover:shadow-primary/30"
        }`}
        style={{ transformStyle: "preserve-3d" }}
      >
        {!disabled && !isLoading && (
          <span className="absolute inset-0 overflow-hidden rounded-full">
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none shine-sweep" />
          </span>
        )}
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Analyzing your text...</span>
          </>
        ) : (
          <>
            <span>Scan Text</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
        <style jsx>{`
          .shine-sweep {
            animation: shine 3s ease-in-out infinite;
          }
          @keyframes shine {
            0% { transform: translateX(-100%); }
            50%, 100% { transform: translateX(100%); }
          }
        `}</style>
      </motion.button>
    </div>
  );
}
