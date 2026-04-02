"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  RotateCcw,
  FileText,
  Clock,
  AlignLeft,
  AlertTriangle,
  CheckCircle,
  FileSearch,
  XCircle,
  Sparkles,
  FlaskConical,
  Wand2,
  Copy,
  CheckCheck,
} from "lucide-react";
import { AnalysisResult, getVerdictLabel, getVerdictColor } from "@/lib/analyzer";
import { saveToHistory, generateReport } from "@/lib/storage";
import { ScoreRing } from "./ScoreRing";
import { SentenceHighlight } from "./SentenceHighlight";
import { TiltCard } from "./TiltCard";

interface ResultsDisplayProps {
  result: AnalysisResult;
  onNewScan: () => void;
}

export function ResultsDisplay({ result, onNewScan }: ResultsDisplayProps) {
  const resultsRef = useRef<HTMLDivElement>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isHumanizing, setIsHumanizing] = useState(false);
  const [humanizedText, setHumanizedText] = useState<string | null>(null);
  const [humanizeError, setHumanizeError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleHumanize = useCallback(async () => {
    setIsHumanizing(true);
    setHumanizeError(null);

    try {
      const response = await fetch("/api/humanize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: result.text }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to humanize text.");
      }

      const data = await response.json();
      setHumanizedText(data.humanizedText);
    } catch (err) {
      setHumanizeError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setIsHumanizing(false);
    }
  }, [result.text]);

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

  useEffect(() => {
    saveToHistory(result);
    setIsSaved(true);
  }, [result]);

  useEffect(() => {
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleDownloadReport = () => {
    const report = generateReport(result);
    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `truthlens-report-${result.id.slice(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const distribution = {
    low: result.sentences.filter((s) => s.aiProbability < 0.3).length,
    medium: result.sentences.filter((s) => s.aiProbability >= 0.3 && s.aiProbability < 0.7).length,
    high: result.sentences.filter((s) => s.aiProbability >= 0.7).length,
  };

  const totalSentences = result.sentences.length || 1;
  const distributionPercentages = {
    low: Math.round((distribution.low / totalSentences) * 100),
    medium: Math.round((distribution.medium / totalSentences) * 100),
    high: Math.round((distribution.high / totalSentences) * 100),
  };

  const verdictColor = getVerdictColor(result.verdict);
  const verdictLabel = getVerdictLabel(result.verdict);

  return (
    <motion.div
      ref={resultsRef}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4"
          style={{
            backgroundColor: verdictColor + "20",
            color: verdictColor,
          }}
        >
          {result.verdict === "human" && <CheckCircle className="w-4 h-4" />}
          {result.verdict === "mixed" && <AlertTriangle className="w-4 h-4" />}
          {result.verdict === "ai" && <XCircle className="w-4 h-4" />}
          Analysis Complete
        </motion.div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Your Results Are Ready
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <TiltCard tiltMaxAngle={5} glareEnable={true}>
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-slate-700/50 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50">
              <div className="flex flex-col items-center">
                <ScoreRing score={result.overallScore} verdict={result.verdict} />

                <div className="mt-6 text-center">
                  <h3
                    className="text-xl font-bold mb-1"
                    style={{ color: verdictColor }}
                  >
                    {verdictLabel}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400">
                    {result.overallScore}% AI probability detected
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-100 dark:border-slate-700">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-slate-400 dark:text-slate-500 mb-1">
                    <FileText className="w-4 h-4" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {result.wordCount.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Words</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-slate-400 dark:text-slate-500 mb-1">
                    <Clock className="w-4 h-4" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {result.readingTime}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Reading Time</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-slate-400 dark:text-slate-500 mb-1">
                    <AlignLeft className="w-4 h-4" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {result.sentences.length}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Sentences</p>
                </div>
              </div>
            </div>
          </TiltCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-slate-700/50 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50"
        >
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
            Detailed Breakdown
          </h3>

          <div className="space-y-4 mb-8">
            <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
              Sentence Distribution by AI Probability
            </h4>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600 dark:text-slate-400">Low (&lt;30%)</span>
                <span className="font-medium text-success">
                  {distributionPercentages.low}%
                </span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${distributionPercentages.low}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-success rounded-full"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600 dark:text-slate-400">Medium (30-70%)</span>
                <span className="font-medium text-warning">
                  {distributionPercentages.medium}%
                </span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${distributionPercentages.medium}%` }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="h-full bg-warning rounded-full"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600 dark:text-slate-400">High (&gt;70%)</span>
                <span className="font-medium text-danger">
                  {distributionPercentages.high}%
                </span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${distributionPercentages.high}%` }}
                  transition={{ duration: 1, delay: 0.7 }}
                  className="h-full bg-danger rounded-full"
                />
              </div>
            </div>
          </div>

          {result.plagiarismScore > 0 ? (
            <div className="pt-6 border-t border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <FileSearch className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Plagiarism Check
                </h4>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.plagiarismScore}%` }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className={`h-full rounded-full ${
                      result.plagiarismScore < 20
                        ? "bg-success"
                        : result.plagiarismScore < 50
                        ? "bg-warning"
                        : "bg-danger"
                    }`}
                  />
                </div>
                <span className="text-lg font-bold text-slate-900 dark:text-white min-w-[3rem]">
                  {result.plagiarismScore}%
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                {result.plagiarismScore < 20
                  ? "Low plagiarism risk — content appears original"
                  : result.plagiarismScore < 50
                  ? "Moderate similarity — review recommended"
                  : "High similarity detected — significant overlap with known sources"}
              </p>
            </div>
          ) : (
            <div className="pt-6 border-t border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <FileSearch className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Plagiarism Check
                </h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Plagiarism checking is not available with the current detection engine.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          Sentence-by-Sentence Analysis
        </h3>
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          Hover over highlighted sentences to see their individual AI probability scores.
        </p>
        <SentenceHighlight text={result.text} sentences={result.sentences} />
      </motion.div>

      {/* Humanizer Section — shown when AI content is detected */}
      {(result.verdict === "ai" || result.verdict === "mixed") && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/20 dark:border-slate-700/50 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500">
                <Wand2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  AI Text Humanizer
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Rewrite AI-detected text to sound more naturally human
                </p>
              </div>
            </div>
            {!humanizedText && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleHumanize}
                disabled={isHumanizing}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium rounded-full hover:shadow-lg hover:shadow-violet-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isHumanizing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Humanizing...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Humanize Text
                  </>
                )}
              </motion.button>
            )}
          </div>

          <AnimatePresence>
            {humanizeError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl text-sm text-red-600 dark:text-red-400 mb-4"
              >
                {humanizeError}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {humanizedText && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="relative mt-2">
                  <div className="p-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl max-h-[400px] overflow-y-auto">
                    <p className="text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                      {humanizedText}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCopyHumanized}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-full hover:border-violet-400 hover:text-violet-500 transition-all text-sm"
                    >
                      {copied ? (
                        <>
                          <CheckCheck className="w-4 h-4 text-green-500" />
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
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-full hover:border-violet-400 hover:text-violet-500 transition-all text-sm disabled:opacity-50"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Regenerate
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-wrap gap-4 justify-center"
      >
        <button
          onClick={handleDownloadReport}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-full hover:border-primary hover:text-primary transition-all"
        >
          <Download className="w-5 h-5" />
          Download Report
        </button>

        <button
          onClick={onNewScan}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white font-medium rounded-full hover:shadow-lg hover:shadow-primary/30 transition-all"
        >
          <RotateCcw className="w-5 h-5" />
          Scan New Text
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center space-y-2"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border" style={{
          backgroundColor: result.isDemo ? '#F59E0B10' : '#10B98110',
          borderColor: result.isDemo ? '#F59E0B30' : '#10B98130',
          color: result.isDemo ? '#F59E0B' : '#10B981',
        }}>
          {result.isDemo ? (
            <><FlaskConical className="w-3 h-3" /> Demo Mode</>
          ) : (
            <><Sparkles className="w-3 h-3" /> Powered by Gemini AI</>
          )}
        </div>
        {isSaved && (
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Result automatically saved to{" "}
            <a href="/history" className="text-primary hover:underline">
              your history
            </a>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
