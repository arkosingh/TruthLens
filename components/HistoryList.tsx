"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X } from "lucide-react";
import { HistoryItem, searchHistory } from "@/lib/storage";
import { HistoryCard } from "./HistoryCard";

interface HistoryListProps {
  history: HistoryItem[];
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export function HistoryList({ history, onDelete, onClearAll }: HistoryListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVerdict, setFilterVerdict] = useState<"all" | "human" | "mixed" | "ai">("all");

  const filteredHistory = useMemo(() => {
    let result = searchQuery ? searchHistory(searchQuery) : history;

    if (filterVerdict !== "all") {
      result = result.filter((item) => item.verdict === filterVerdict);
    }

    return result;
  }, [history, searchQuery, filterVerdict]);

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-4 border border-white/20 dark:border-slate-700/50 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by text, verdict, or date..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <select
              value={filterVerdict}
              onChange={(e) => setFilterVerdict(e.target.value as typeof filterVerdict)}
              className="pl-9 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Verdicts</option>
              <option value="human">Human Written</option>
              <option value="mixed">Mixed</option>
              <option value="ai">AI Generated</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          <button
            onClick={onClearAll}
            className="px-4 py-2.5 text-sm font-medium text-danger hover:bg-danger/10 rounded-xl transition-colors"
          >
            Clear All
          </button>
        </div>

        <div className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Showing {filteredHistory.length} of {history.length} scans
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {filteredHistory.length > 0 ? (
          <div className="space-y-4">
            {filteredHistory.map((item) => (
              <HistoryCard key={item.id} item={item} onDelete={onDelete} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50"
          >
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No results found
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              {searchQuery || filterVerdict !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No scans in your history yet"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
