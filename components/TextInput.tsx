"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  X,
  FileText,
  AlertCircle,
  FileUp,
} from "lucide-react";
import { sampleTexts, getSampleById } from "@/lib/samples";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  disabled?: boolean;
}

const MAX_FILE_SIZE = 1024 * 1024;

export function TextInput({
  value,
  onChange,
  maxLength = 10000,
  disabled = false,
}: TextInputProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout>();

  const characterCount = value.length;
  const isOverLimit = characterCount > maxLength;

  const handleFileUpload = useCallback(
    (file: File) => {
      setUploadError(null);

      if (file.size > MAX_FILE_SIZE) {
        setUploadError("File too large. Max size is 1MB.");
        return;
      }

      if (!file.name.endsWith(".txt")) {
        setTooltipVisible(true);
        if (tooltipTimeoutRef.current) {
          clearTimeout(tooltipTimeoutRef.current);
        }
        tooltipTimeoutRef.current = setTimeout(() => {
          setTooltipVisible(false);
        }, 3000);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content) {
          onChange(content.slice(0, maxLength));
        }
      };
      reader.onerror = () => {
        setUploadError("Failed to read file. Please try again.");
      };
      reader.readAsText(file);
    },
    [maxLength, onChange]
  );

  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileUpload(file);
      }
    },
    [handleFileUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === "file") {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            handleFileUpload(file);
            return;
          }
        }
      }
    },
    [handleFileUpload]
  );

  const loadSample = (sampleId: string) => {
    const sample = getSampleById(sampleId);
    if (sample) {
      onChange(sample.text);
    }
  };

  const clearText = () => {
    onChange("");
    setUploadError(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-slate-500 dark:text-slate-400 mr-1">Try an example:</span>
        {sampleTexts.map((sample) => (
          <motion.button
            key={sample.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => loadSample(sample.id)}
            disabled={disabled}
            className="px-3 py-1.5 text-sm font-medium bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sample.label}
          </motion.button>
        ))}
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative group ${isDragging ? "ring-2 ring-primary" : ""}`}
      >
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 bg-primary/10 dark:bg-primary/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-dashed border-primary"
            >
              <div className="text-center">
                <Upload className="w-12 h-12 text-primary mx-auto mb-2" />
                <p className="text-lg font-medium text-primary">
                  Drop file here
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
          onPaste={handlePaste}
          disabled={disabled}
          placeholder="Paste your text here to check for AI-generated content..."
          className={`w-full min-h-[300px] p-6 bg-white dark:bg-slate-800 border rounded-2xl resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
            isOverLimit ? "border-danger focus:border-danger" : "border-slate-200 dark:border-slate-700"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        />

        <div className="absolute top-4 right-4 flex items-center gap-2">
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.pdf,.docx"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
                e.target.value = "";
              }}
              className="hidden"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="p-2 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors border border-slate-200 dark:border-slate-600 disabled:opacity-50"
            >
              <FileUp className="w-5 h-5" />
            </motion.button>

            <AnimatePresence>
              {tooltipVisible && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full right-0 mt-2 px-3 py-2 bg-slate-800 dark:bg-slate-700 text-white text-xs rounded-lg whitespace-nowrap z-20"
                >
                  .pdf & .docx coming soon!
                  <div className="absolute -top-1 right-3 w-2 h-2 bg-slate-800 dark:bg-slate-700 rotate-45" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearText}
              disabled={disabled}
              className="p-2 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-danger hover:bg-danger/10 transition-colors border border-slate-200 dark:border-slate-600 disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </motion.button>
          )}
        </div>

        <AnimatePresence>
          {uploadError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-4 left-4 right-20 flex items-center gap-2 px-3 py-2 bg-danger/10 text-danger text-sm rounded-lg"
            >
              <AlertCircle className="w-4 h-4" />
              {uploadError}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          <span className="text-slate-500 dark:text-slate-400">
            {characterCount.toLocaleString()} / {maxLength.toLocaleString()} characters
          </span>
        </div>
        {isOverLimit && (
          <span className="text-danger font-medium">
            Text exceeds maximum length
          </span>
        )}
      </div>
    </div>
  );
}
