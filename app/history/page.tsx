"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { History, Trash2, Search, Clock } from "lucide-react";
import { getHistory, HistoryItem, deleteFromHistory, clearHistory } from "@/lib/storage";
import { HistoryList } from "@/components/HistoryList";
import { Modal } from "@/components/Modal";
import Link from "next/link";

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  useEffect(() => {
    const loaded = getHistory();
    setHistory(loaded);
    setIsLoading(false);
  }, []);

  const handleDelete = useCallback((id: string) => {
    deleteFromHistory(id);
    setHistory((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleClearAll = useCallback(() => {
    setIsClearModalOpen(true);
  }, []);

  const confirmClearAll = useCallback(() => {
    clearHistory();
    setHistory([]);
    setIsClearModalOpen(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-16 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const hasHistory = history.length > 0;

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-sky-50 to-blue-50/50 dark:from-slate-900 dark:to-slate-800 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-xl">
              <History className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              Scan History
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            Review and manage all your previous AI content analyses. Results are
            stored locally in your browser.
          </p>
        </motion.div>

        {hasHistory ? (
          <HistoryList
            history={history}
            onDelete={handleDelete}
            onClearAll={handleClearAll}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-lg"
          >
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-slate-400 dark:text-slate-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              No scans yet
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-md mx-auto">
              Start your first scan to detect AI-generated content. Your analysis
              history will appear here.
            </p>
            <Link
              href="/scan"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-full hover:shadow-lg hover:shadow-primary/30 transition-all"
            >
              <Clock className="w-5 h-5" />
              Start Your First Scan
            </Link>
          </motion.div>
        )}
      </div>

      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="Clear All History?"
        footer={
          <>
            <button
              onClick={() => setIsClearModalOpen(false)}
              className="px-4 py-2 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmClearAll}
              className="px-4 py-2 bg-danger text-white font-medium rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </>
        }
      >
        <p className="text-slate-600 dark:text-slate-300">
          This will permanently delete all {history.length} scans from your
          history. This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
