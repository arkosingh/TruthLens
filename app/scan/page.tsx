"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScanSearch, Sparkles } from "lucide-react";
import { TextInput } from "@/components/TextInput";
import { ScanButton } from "@/components/ScanButton";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { AnalysisResult, analyzeText } from "@/lib/analyzer";

export default function ScanPage() {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  const handleScan = useCallback(async () => {
    if (!text.trim()) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await analyzeText(text.trim());
      setResult(analysisResult);
    } catch (err) {
      setError("An error occurred during analysis. Please try again.");
      console.error("Analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [text]);

  const handleNewScan = useCallback(() => {
    setResult(null);
    setError(null);
    setText("");
    inputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const isTextEmpty = text.trim().length === 0;
  const isTextTooLong = text.length > 10000;

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-sky-50 to-blue-50/50 dark:from-slate-900 dark:to-slate-800 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-100 dark:border-slate-700 mb-6">
            <ScanSearch className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              AI Content Scanner
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Detect AI-Generated Content
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Paste your text below and our advanced algorithms will analyze it for
            AI-generated patterns with sentence-level precision.
          </p>
        </motion.div>

        <motion.div
          ref={inputRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-white/20 dark:border-slate-700/50"
        >
          <TextInput
            value={text}
            onChange={setText}
            maxLength={10000}
            disabled={isAnalyzing}
          />

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-danger/10 text-danger rounded-xl text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Analysis takes ~2 seconds</span>
            </div>
            <ScanButton
              onClick={handleScan}
              disabled={isTextEmpty || isTextTooLong || isAnalyzing}
              isLoading={isAnalyzing}
            />
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {result && !isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-8"
            >
              <ResultsDisplay result={result} onNewScan={handleNewScan} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
