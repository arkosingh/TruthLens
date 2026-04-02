"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ScanSearch,
  Sparkles,
  Info,
  Wand2,
  Copy,
  CheckCheck,
  RotateCcw,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { TextInput } from "@/components/TextInput";
import { ScanButton } from "@/components/ScanButton";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { LoginModal } from "@/components/LoginModal";
import { useAuth } from "@/components/AuthContext";
import { AnalysisResult, analyzeText } from "@/lib/analyzer";

const CHAR_LIMIT_FOR_LOGIN = 500; // characters
const FILE_SIZE_LIMIT_FOR_LOGIN = 5 * 1024 * 1024; // 5MB

type Mode = "detect" | "humanize";

export default function ScanPage() {
  const [mode, setMode] = useState<Mode>("detect");
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [uploadedFileSize, setUploadedFileSize] = useState(0);

  // Humanizer state
  const [isHumanizing, setIsHumanizing] = useState(false);
  const [humanizedText, setHumanizedText] = useState<string | null>(null);
  const [humanizeError, setHumanizeError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const inputRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const requiresAuth = useCallback(
    (currentText: string) => {
      if (user) return false;
      const charCount = currentText.length;
      if (charCount > CHAR_LIMIT_FOR_LOGIN) return true;
      if (uploadedFileSize > FILE_SIZE_LIMIT_FOR_LOGIN) return true;
      return false;
    },
    [user, uploadedFileSize]
  );

  const handleScan = useCallback(async () => {
    if (!text.trim()) return;

    if (requiresAuth(text)) {
      setShowLoginModal(true);
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await analyzeText(text.trim());
      setResult(analysisResult);
      setIsDemo(analysisResult.isDemo);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "An error occurred during analysis. Please try again.";
      setError(message);
      console.error("Analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [text, requiresAuth]);

  const handleHumanize = useCallback(async () => {
    if (!text.trim()) return;

    if (requiresAuth(text)) {
      setShowLoginModal(true);
      return;
    }

    setIsHumanizing(true);
    setHumanizeError(null);
    setHumanizedText(null);

    try {
      const response = await fetch("/api/humanize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to humanize text.");
      }

      const data = await response.json();
      setHumanizedText(data.humanizedText);
    } catch (err) {
      setHumanizeError(
        err instanceof Error ? err.message : "An error occurred."
      );
    } finally {
      setIsHumanizing(false);
    }
  }, [text, requiresAuth]);

  const handleCopyHumanized = useCallback(async () => {
    if (!humanizedText) return;
    try {
      await navigator.clipboard.writeText(humanizedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access denied
    }
  }, [humanizedText]);

  const handleNewScan = useCallback(() => {
    setResult(null);
    setError(null);
    setIsDemo(false);
    setText("");
    setUploadedFileSize(0);
    setHumanizedText(null);
    setHumanizeError(null);
    inputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleTextChange = useCallback((newText: string) => {
    setText(newText);
  }, []);

  const handleFileSize = useCallback((size: number) => {
    setUploadedFileSize(size);
  }, []);

  const handleModeSwitch = useCallback(
    (newMode: Mode) => {
      if (newMode === mode) return;
      setMode(newMode);
      setError(null);
      setResult(null);
      setIsDemo(false);
      setHumanizedText(null);
      setHumanizeError(null);
    },
    [mode]
  );

  const isTextEmpty = text.trim().length === 0;
  const isTextTooLong = text.length > 200000;

  const charCount = text.length;
  const showLoginHint = !user && charCount > CHAR_LIMIT_FOR_LOGIN;

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-sky-50 to-blue-50/50 dark:from-slate-900 dark:to-slate-800 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-100 dark:border-slate-700 mb-6">
            {mode === "detect" ? (
              <ScanSearch className="w-4 h-4 text-primary" />
            ) : (
              <Wand2 className="w-4 h-4 text-violet-500" />
            )}
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              {mode === "detect" ? "AI Content Scanner" : "AI Text Humanizer"}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            {mode === "detect"
              ? "Detect AI-Generated Content"
              : "Humanize AI-Generated Text"}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            {mode === "detect"
              ? "Paste your text below and our advanced algorithms will analyze it for AI-generated patterns with sentence-level precision."
              : "Paste your AI-generated text below and we\u2019ll rewrite it to sound naturally human-written while preserving the meaning."}
          </p>
        </motion.div>

        {/* Mode Toggle Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-full p-1.5 border border-slate-200 dark:border-slate-700 shadow-sm">
            <button
              onClick={() => handleModeSwitch("detect")}
              className={`relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                mode === "detect"
                  ? "text-white"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              {mode === "detect" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <ScanSearch className="w-4 h-4 relative z-10" />
              <span className="relative z-10">AI Detector</span>
            </button>
            <button
              onClick={() => handleModeSwitch("humanize")}
              className={`relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                mode === "humanize"
                  ? "text-white"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              {mode === "humanize" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Wand2 className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Humanizer</span>
            </button>
          </div>
        </motion.div>

        {/* Input Card */}
        <motion.div
          ref={inputRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-white/20 dark:border-slate-700/50"
        >
          <TextInput
            value={text}
            onChange={handleTextChange}
            onFileSize={handleFileSize}
            maxLength={200000}
            disabled={isAnalyzing || isHumanizing}
          />

          <AnimatePresence>
            {(error || humanizeError) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-danger/10 text-danger rounded-xl text-sm"
              >
                {error || humanizeError}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isDemo && !result && mode === "detect" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-xl text-sm flex items-start gap-2"
              >
                <Info className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-amber-700 dark:text-amber-300">
                  Running in demo mode with simulated results.{" "}
                  <a
                    href="https://sapling.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-amber-900 dark:hover:text-amber-100"
                  >
                    Get a free Sapling API key
                  </a>{" "}
                  for real AI detection.
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showLoginHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 rounded-xl text-sm flex items-start gap-2"
              >
                <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span className="text-blue-700 dark:text-blue-300">
                  Your text exceeds 500 characters. You&apos;ll need to{" "}
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="underline font-medium hover:text-blue-900 dark:hover:text-blue-100"
                  >
                    sign in
                  </button>{" "}
                  to {mode === "detect" ? "analyze" : "humanize"} it.
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>
                {mode === "detect"
                  ? "Analysis takes a few seconds"
                  : "Humanization takes a few seconds"}
              </span>
            </div>

            {mode === "detect" ? (
              <ScanButton
                onClick={handleScan}
                disabled={isTextEmpty || isTextTooLong || isAnalyzing}
                isLoading={isAnalyzing}
              />
            ) : (
              <div style={{ perspective: 600 }}>
                <motion.button
                  whileHover={
                    !isTextEmpty && !isHumanizing
                      ? { scale: 1.02, translateZ: 4 }
                      : {}
                  }
                  whileTap={
                    !isTextEmpty && !isHumanizing
                      ? { scale: 0.98, translateZ: -4 }
                      : {}
                  }
                  onClick={handleHumanize}
                  disabled={isTextEmpty || isTextTooLong || isHumanizing}
                  className={`relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 font-semibold rounded-full transition-all duration-300 overflow-hidden ${
                    isTextEmpty || isTextTooLong
                      ? "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:shadow-xl hover:shadow-violet-500/30"
                  }`}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {isHumanizing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Humanizing your text...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      <span>Humanize Text</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Detect mode results */}
        <AnimatePresence mode="wait">
          {mode === "detect" && result && !isAnalyzing && (
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

        {/* Humanize mode results */}
        <AnimatePresence mode="wait">
          {mode === "humanize" && humanizedText && !isHumanizing && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5 }}
              className="mt-8"
            >
              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/20 dark:border-slate-700/50 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500">
                    <Wand2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      Humanized Result
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Your text has been rewritten to sound more naturally human
                    </p>
                  </div>
                </div>

                <div className="p-5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl max-h-[500px] overflow-y-auto">
                  <p className="text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {humanizedText}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-5">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopyHumanized}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium rounded-full hover:shadow-lg hover:shadow-violet-500/30 transition-all"
                  >
                    {copied ? (
                      <>
                        <CheckCheck className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Text
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setHumanizedText(null);
                      handleHumanize();
                    }}
                    disabled={isHumanizing}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-full hover:border-violet-400 hover:text-violet-500 transition-all disabled:opacity-50"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Regenerate
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNewScan}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-full hover:border-slate-400 transition-all"
                  >
                    Start Over
                  </motion.button>
                </div>

                <div className="mt-5 text-center">
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border"
                    style={{
                      backgroundColor: "#8B5CF610",
                      borderColor: "#8B5CF630",
                      color: "#8B5CF6",
                    }}
                  >
                    <Sparkles className="w-3 h-3" />
                    Powered by Gemini AI
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}
