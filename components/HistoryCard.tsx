"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Trash2,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { HistoryItem } from "@/lib/storage";
import { getVerdictColor, getVerdictLabel } from "@/lib/analyzer";
import { formatDateTime, truncateText } from "@/lib/utils";
import { SentenceHighlight } from "./SentenceHighlight";

interface HistoryCardProps {
  item: HistoryItem;
  onDelete: (id: string) => void;
}

export function HistoryCard({ item, onDelete }: HistoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const verdictColor = getVerdictColor(item.verdict);
  const verdictLabel = getVerdictLabel(item.verdict);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(item.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Card Header - Always Visible */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-6 cursor-pointer"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Score Badge */}
          <div
            className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: verdictColor + "20" }}
          >
            <span
              className="text-xl font-bold"
              style={{ color: verdictColor }}
            >
              {item.overallScore}%
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {/* Verdict Badge */}
              <span
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: verdictColor + "20",
                  color: verdictColor,
                }}
              >
                {item.verdict === "human" && <CheckCircle className="w-3 h-3" />}
                {item.verdict === "mixed" && (
                  <AlertTriangle className="w-3 h-3" />
                )}
                {item.verdict === "ai" && <XCircle className="w-3 h-3" />}
                {verdictLabel}
              </span>

              {/* Date */}
              <span className="text-sm text-slate-500">
                {formatDateTime(item.scanDate)}
              </span>
            </div>

            {/* Text Preview */}
            <p className="text-slate-700 truncate">
              {truncateText(item.text, 100)}
            </p>

            {/* Quick Stats */}
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                {item.wordCount} words
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {item.readingTime}
              </span>
              <span>{item.sentences.length} sentences</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              className="p-2 rounded-lg text-slate-400 hover:text-danger hover:bg-danger/10 transition-colors"
              aria-label="Delete scan"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <div className="p-2 rounded-lg text-slate-400">
              {isExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-slate-100"
          >
            <div className="p-6 pt-4 space-y-6">
              {/* Detailed Stats */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900">
                    {item.plagiarismScore}%
                  </p>
                  <p className="text-xs text-slate-500">Plagiarism Score</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900">
                    {item.characterCount.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500">Characters</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900">
                    {item.sentences.length}
                  </p>
                  <p className="text-xs text-slate-500">Sentences</p>
                </div>
              </div>

              {/* Sentence Highlighting */}
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3">
                  Analyzed Text with Sentence Highlighting
                </h4>
                <SentenceHighlight
                  text={item.text}
                  sentences={item.sentences}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
