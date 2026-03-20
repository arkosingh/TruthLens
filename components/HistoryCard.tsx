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
import { TiltCard } from "./TiltCard";

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
    <TiltCard tiltMaxAngle={4} glareEnable={!isExpanded}>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden hover:shadow-lg dark:hover:shadow-slate-900/30 transition-shadow"
      >
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-6 cursor-pointer"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
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

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: verdictColor + "20",
                    color: verdictColor,
                  }}
                >
                  {item.verdict === "human" && <CheckCircle className="w-3 h-3" />}
                  {item.verdict === "mixed" && <AlertTriangle className="w-3 h-3" />}
                  {item.verdict === "ai" && <XCircle className="w-3 h-3" />}
                  {verdictLabel}
                </span>

                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {formatDateTime(item.scanDate)}
                </span>
              </div>

              <p className="text-slate-700 dark:text-slate-300 truncate">
                {truncateText(item.text, 100)}
              </p>

              <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 dark:text-slate-400">
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

            <div className="flex items-center gap-2">
              <button
                onClick={handleDelete}
                className="p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:text-danger hover:bg-danger/10 transition-colors"
                aria-label="Delete scan"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <div className="p-2 rounded-lg text-slate-400 dark:text-slate-500">
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-slate-100 dark:border-slate-700"
            >
              <div className="p-6 pt-4 space-y-6">
                <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {item.plagiarismScore}%
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Plagiarism Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {item.characterCount.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Characters</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {item.sentences.length}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Sentences</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
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
    </TiltCard>
  );
}
