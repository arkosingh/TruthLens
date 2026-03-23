"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, ChevronLeft, ChevronRight, GraduationCap, PenTool, Newspaper, Building2 } from "lucide-react";

const testimonials = [
  {
    quote:
      "TruthLens has become essential in our content moderation workflow. The sentence-level analysis catches AI-generated submissions that every other tool misses.",
    author:  "Sarah Chen",
    role:    "Editor-in-Chief",
    company: "TechDaily News",
    icon:    Newspaper,
    color:   "#3B82F6",
    rating:  5,
  },
  {
    quote:
      "As an educator, I need reliable tools to ensure academic integrity. TruthLens gives me confidence with its detailed sentence-by-sentence breakdowns.",
    author:  "Dr. Michael Torres",
    role:    "Professor of Literature",
    company: "State University",
    icon:    GraduationCap,
    color:   "#8B5CF6",
    rating:  5,
  },
  {
    quote:
      "We integrated TruthLens into our publishing pipeline and never looked back. Fast, accurate, and the Gemini-powered analysis is genuinely impressive.",
    author:  "Emily Watson",
    role:    "Content Director",
    company: "Creative Publishing Co.",
    icon:    PenTool,
    color:   "#06B6D4",
    rating:  5,
  },
];

const trustedBy = [
  { name: "Harvard University",  icon: GraduationCap },
  { name: "TechCorp Inc.",        icon: Building2 },
  { name: "Global Media",         icon: Newspaper },
  { name: "Academic Press",       icon: PenTool },
  { name: "Research Labs",        icon: Building2 },
  { name: "Digital First",        icon: Newspaper },
];

const slideVariants = {
  enter: (d: number) => ({ x: d > 0 ? 500 : -500, opacity: 0, scale: 0.9 }),
  center: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
  exit:  (d: number) => ({ x: d > 0 ? -500 : 500, opacity: 0, scale: 0.9, transition: { duration: 0.4, ease: "easeIn" as const } }),
};

export function Testimonials() {
  const [current,   setCurrent]   = useState(0);
  const [direction, setDirection] = useState(0);

  const go = useCallback((idx: number) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  }, [current]);

  const next = useCallback(() => go((current + 1) % testimonials.length), [current, go]);
  const prev = useCallback(() => go((current - 1 + testimonials.length) % testimonials.length), [current, go]);

  // auto-play
  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next]);

  const t = testimonials[current];

  return (
    <section
      className="relative py-24 lg:py-36 overflow-hidden"
      style={{ background: "#050A14" }}
    >
      {/* bg orb */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(37,99,235,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-sm font-medium text-blue-300 mb-5">
            <Star className="w-4 h-4 fill-current" />
            Trusted Worldwide
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-5">
            Loved by{" "}
            <span className="shimmer-text">Professionals</span>
          </h2>
          <p className="text-lg text-slate-400">
            Join thousands of educators, publishers, and content creators who rely on TruthLens daily.
          </p>
        </motion.div>

        {/* ── Carousel ──────────────────────────────────── */}
        <div className="relative max-w-3xl mx-auto mb-20">
          {/* Card area */}
          <div className="relative h-[320px] sm:h-[270px] overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0"
              >
                <div
                  className="h-full rounded-3xl border p-8 sm:p-10 flex flex-col justify-between"
                  style={{
                    background:     "rgba(15,23,42,0.9)",
                    borderColor:    t.color + "30",
                    backdropFilter: "blur(16px)",
                    boxShadow:      `0 0 60px ${t.color}18`,
                  }}
                >
                  {/* top row */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      {/* Stars */}
                      <div className="flex gap-1">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      {/* Quote icon */}
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}88)`, boxShadow: `0 0 16px ${t.color}60` }}
                      >
                        <Quote className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <p className="text-slate-300 text-lg leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-4 mt-6">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${t.color}30, ${t.color}15)`, border: `1px solid ${t.color}40` }}
                    >
                      <t.icon className="w-6 h-6" style={{ color: t.color }} />
                    </div>
                    <div>
                      <p className="font-bold text-white">{t.author}</p>
                      <p className="text-sm text-slate-500">{t.role}, {t.company}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-6">
            {/* Prev */}
            <button
              onClick={prev}
              className="p-3 rounded-full border border-white/10 bg-white/5 text-slate-400 hover:border-blue-500/50 hover:text-white hover:bg-blue-500/10 transition-all duration-200"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  className="transition-all duration-300"
                  aria-label={`Go to slide ${i + 1}`}
                >
                  <div
                    className="rounded-full transition-all duration-300"
                    style={{
                      width:   i === current ? 24 : 8,
                      height:  8,
                      background: i === current ? testimonials[i].color : "rgba(255,255,255,0.2)",
                      boxShadow:  i === current ? `0 0 8px ${testimonials[i].color}` : "none",
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Next */}
            <button
              onClick={next}
              className="p-3 rounded-full border border-white/10 bg-white/5 text-slate-400 hover:border-blue-500/50 hover:text-white hover:bg-blue-500/10 transition-all duration-200"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Trusted by marquee ────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-center text-xs font-semibold text-slate-600 uppercase tracking-widest mb-8">
            Trusted by leading institutions
          </p>
          <div className="relative overflow-hidden">
            {/* fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
              style={{ background: "linear-gradient(to right, #050A14, transparent)" }} />
            <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
              style={{ background: "linear-gradient(to left, #050A14, transparent)" }} />

            <div className="flex gap-8 animate-marquee">
              {[...trustedBy, ...trustedBy].map((org, i) => (
                <div
                  key={`${org.name}-${i}`}
                  className="flex items-center gap-3 px-5 py-3 rounded-xl border border-white/8 bg-white/3 flex-shrink-0"
                >
                  <org.icon className="w-4 h-4 text-slate-600" />
                  <span className="text-slate-500 font-medium whitespace-nowrap text-sm">{org.name}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee 28s linear infinite; }
      `}</style>
    </section>
  );
}
