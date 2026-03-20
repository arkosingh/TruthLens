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
    <motion.button
      whileHover={!disabled && !isLoading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 font-semibold rounded-full transition-all duration-300 ${
        disabled && !isLoading
          ? "bg-slate-200 text-slate-400 cursor-not-allowed"
          : "bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-xl hover:shadow-primary/30"
      }`}
    >
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
    </motion.button>
  );
}
