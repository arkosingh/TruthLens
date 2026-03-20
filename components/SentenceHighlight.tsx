"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SentenceAnalysis,
  getProbabilityColor,
  getProbabilityLabel,
} from "@/lib/analyzer";
import { truncateText } from "@/lib/utils";

interface SentenceHighlightProps {
  text: string;
  sentences: SentenceAnalysis[];
}

export function SentenceHighlight({ text, sentences }: SentenceHighlightProps) {
  const [hoveredSentence, setHoveredSentence] = useState<SentenceAnalysis | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const renderHighlightedText = () => {
    if (sentences.length === 0) {
      return <span className="text-slate-700 dark:text-slate-300">{text}</span>;
    }

    const elements: JSX.Element[] = [];
    let currentIndex = 0;

    sentences.forEach((sentence, index) => {
      if (sentence.startIndex > currentIndex) {
        elements.push(
          <span key={`before-${index}`} className="text-slate-700 dark:text-slate-300">
            {text.slice(currentIndex, sentence.startIndex)}
          </span>
        );
      }

      const color = getProbabilityColor(sentence.aiProbability);
      const opacity = Math.max(0.1, sentence.aiProbability * 0.3);

      elements.push(
        <motion.span
          key={`sentence-${index}`}
          initial={{ backgroundColor: "transparent" }}
          animate={{
            backgroundColor: color + Math.round(opacity * 255).toString(16).padStart(2, "0"),
          }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
          onMouseEnter={() => setHoveredSentence(sentence)}
          onMouseLeave={() => setHoveredSentence(null)}
          onMouseMove={handleMouseMove}
          className="cursor-pointer rounded px-0.5 transition-all duration-200 hover:ring-2 hover:ring-primary/30"
          style={{
            backgroundColor: color + Math.round(opacity * 255).toString(16).padStart(2, "0"),
          }}
        >
          {text.slice(sentence.startIndex, sentence.endIndex)}
        </motion.span>
      );

      currentIndex = sentence.endIndex;
    });

    if (currentIndex < text.length) {
      elements.push(
        <span key="after" className="text-slate-700 dark:text-slate-300">
          {text.slice(currentIndex)}
        </span>
      );
    }

    return elements;
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center gap-4 mb-4 p-4 bg-slate-50 dark:bg-slate-800/70 rounded-xl">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">AI Probability:</span>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-success/20 border border-success" />
          <span className="text-sm text-slate-600 dark:text-slate-400">Low (&lt;30%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-warning/20 border border-warning" />
          <span className="text-sm text-slate-600 dark:text-slate-400">Medium (30-70%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-danger/20 border border-danger" />
          <span className="text-sm text-slate-600 dark:text-slate-400">High (&gt;70%)</span>
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl leading-relaxed text-slate-800 dark:text-slate-200">
        {renderHighlightedText()}
      </div>

      <AnimatePresence>
        {hoveredSentence && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              position: "fixed",
              left: mousePos.x,
              top: mousePos.y - 60,
              transform: "translateX(-50%)",
              zIndex: 50,
            }}
            className="px-4 py-3 bg-slate-900 dark:bg-slate-700 text-white text-sm rounded-xl shadow-2xl max-w-xs pointer-events-none"
          >
            <div className="font-medium mb-1">
              {getProbabilityLabel(hoveredSentence.aiProbability)}
            </div>
            <div className="text-slate-300 dark:text-slate-400 text-xs">
              &ldquo;{truncateText(hoveredSentence.text, 60)}&rdquo;
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 dark:bg-slate-700 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
