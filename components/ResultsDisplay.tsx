"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { AnalysisResult, getVerdictLabel, getVerdictColor } from "@/lib/analyzer";
import { saveToHistory, generateReport } from "@/lib/storage";
import { ScoreRing } from "./ScoreRing";
import { SentenceHighlight } from "./SentenceHighlight";

interface ResultsDisplayProps {
  result: AnalysisResult;
  onNewScan: () => void;
}

export function ResultsDisplay({ result, onNewScan }: ResultsDisplayProps) {
  const resultsRef = useRef<HTMLDivElement>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Auto-save to history
  useEffect(() => {
    saveToHistory(result);
    setIsSaved(true);
  }, [result]);

  // Scroll to results on mount
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

  // Calculate sentence distribution
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
      {/* Results Header */}
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
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Your Results Are Ready
        </h2>
      </div>

      {/* Main Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Overall Score Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg shadow-slate-200/50"
        >
          <div className="flex flex-col items-center">
            <ScoreRing score={result.overallScore} verdict={result.verdict} />

            <div className="mt-6 text-center">
              <h3
                className="text-xl font-bold mb-1"
                style={{ color: verdictColor }}
              >
                {verdictLabel}
              </h3>
              <p className="text-slate-500">
                {result.overallScore}% AI probability detected
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-100">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                <FileText className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {result.wordCount.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500">Words</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                <Clock className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {result.readingTime}
              </p>
              <p className="text-xs text-slate-500">Reading Time</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                <AlignLeft className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {result.sentences.length}
              </p>
              <p className="text-xs text-slate-500">Sentences</p>
            </div>
          </div>
        </motion.div>

        {/* Detailed Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg shadow-slate-200/50"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-6">
            Detailed Breakdown
          </h3>

          {/* Sentence Distribution */}
          <div className="space-y-4 mb-8">
            <h4 className="text-sm font-medium text-slate-600 mb-3">
              Sentence Distribution by AI Probability
            </h4>

            {/* Low */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">Low (&lt;30%)</span>
                <span className="font-medium text-success">
                  {distributionPercentages.low}%
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${distributionPercentages.low}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-success rounded-full"
                />
              </div>
            </div>

            {/* Medium */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">Medium (30-70%)</span>
                <span className="font-medium text-warning">
                  {distributionPercentages.medium}%
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${distributionPercentages.medium}%` }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="h-full bg-warning rounded-full"
                />
              </div>
            </div>

            {/* High */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">High (&gt;70%)</span>
                <span className="font-medium text-danger">
                  {distributionPercentages.high}%
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${distributionPercentages.high}%` }}
                  transition={{ duration: 1, delay: 0.7 }}
                  className="h-full bg-danger rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Plagiarism Score */}
          <div className="pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <FileSearch className="w-5 h-5 text-slate-400" />
              <h4 className="text-sm font-medium text-slate-600">
                Plagiarism Check
              </h4>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
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
              <span className="text-lg font-bold text-slate-900 min-w-[3rem]">
                {result.plagiarismScore}%
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {result.plagiarismScore < 20
                ? "Low plagiarism risk — content appears original"
                : result.plagiarismScore < 50
                ? "Moderate similarity — review recommended"
                : "High similarity detected — significant overlap with known sources"}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Sentence Highlighting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          Sentence-by-Sentence Analysis
        </h3>
        <p className="text-slate-600 mb-4">
          Hover over highlighted sentences to see their individual AI probability scores.
        </p>
        <SentenceHighlight text={result.text} sentences={result.sentences} />
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-wrap gap-4 justify-center"
      >
        <button
          onClick={handleDownloadReport}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-medium rounded-full hover:border-primary hover:text-primary transition-all"
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

      {/* Saved Indicator */}
      {isSaved && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-slate-500"
        >
          Result automatically saved to{" "}
          <a href="/history" className="text-primary hover:underline">
            your history
          </a>
        </motion.div>
      )}
    </motion.div>
  );
}
