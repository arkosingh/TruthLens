"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, LogIn, UserPlus, AlertCircle } from "lucide-react";
import { useAuth } from "./AuthContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    if (isSignUp) {
      const { error } = await signUpWithEmail(email, password);
      if (error) {
        setError(error);
      } else {
        setSuccessMessage("Account created! Check your email for a confirmation link.");
        setEmail("");
        setPassword("");
      }
    } else {
      const { error } = await signInWithEmail(email, password);
      if (error) {
        setError(error);
      } else {
        onClose();
      }
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    const { error } = await signInWithGoogle();
    if (error) {
      setError(error);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {isSignUp ? "Create Account" : "Sign In"}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Sign in to analyze large documents (500+ words or 5MB+)
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Google Sign In */}
              <button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white dark:bg-slate-800 text-slate-400">
                    or
                  </span>
                </div>
              </div>

              {/* Email/Password Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl text-sm text-red-600 dark:text-red-400"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {error}
                    </motion.div>
                  )}
                  {successMessage && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 rounded-xl text-sm text-green-600 dark:text-green-400"
                    >
                      {successMessage}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary to-primary-dark text-white font-medium rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : isSignUp ? (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Create Account
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      Sign In
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                {isSignUp ? (
                  <button
                    onClick={() => {
                      setIsSignUp(false);
                      resetForm();
                    }}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in
                  </button>
                ) : (
                  <Link
                    href="/signup"
                    onClick={onClose}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign up
                  </Link>
                )}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
