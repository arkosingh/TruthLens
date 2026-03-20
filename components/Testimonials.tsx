"use client";

import { motion } from "framer-motion";
import { Quote, Star, Building2, GraduationCap, PenTool, Newspaper } from "lucide-react";
import { TiltCard } from "./TiltCard";

const testimonials = [
  {
    quote:
      "TruthLens has become an essential tool in our content moderation workflow. The sentence-level analysis helps us catch AI-generated submissions that other tools miss.",
    author: "Sarah Chen",
    role: "Editor-in-Chief",
    company: "TechDaily News",
    icon: Newspaper,
    rating: 5,
  },
  {
    quote:
      "As an educator, I need reliable tools to ensure academic integrity. TruthLens gives me confidence in my assessments with its detailed breakdowns.",
    author: "Dr. Michael Torres",
    role: "Professor of Literature",
    company: "State University",
    icon: GraduationCap,
    rating: 5,
  },
  {
    quote:
      "We've integrated TruthLens into our publishing pipeline. It's fast, accurate, and the reporting features are exactly what we needed.",
    author: "Emily Watson",
    role: "Content Director",
    company: "Creative Publishing Co.",
    icon: PenTool,
    rating: 5,
  },
];

const trustedBy = [
  { name: "Harvard University", icon: GraduationCap },
  { name: "TechCorp Inc.", icon: Building2 },
  { name: "Global Media", icon: Newspaper },
  { name: "Academic Press", icon: PenTool },
  { name: "Research Labs", icon: Building2 },
  { name: "Digital First", icon: Newspaper },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

export function Testimonials() {
  return (
    <section className="py-20 lg:py-32 bg-white dark:bg-slate-900 overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-full text-sm font-medium text-primary mb-4">
            <Star className="w-4 h-4 fill-current" />
            Trusted Worldwide
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Loved by{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Professionals
            </span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Join thousands of educators, publishers, and content creators who rely
            on TruthLens daily.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
        >
          {testimonials.map((testimonial) => (
            <motion.div key={testimonial.author} variants={itemVariants}>
              <TiltCard className="h-full" tiltMaxAngle={6} glareEnable={true}>
                <div className="relative h-full bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/70 dark:to-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-200 dark:border-slate-700/50 hover:border-primary/20 dark:hover:border-primary/30 hover:shadow-xl dark:hover:shadow-primary/5 transition-all duration-300">
                  <div className="absolute -top-4 left-8 w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                    <Quote className="w-4 h-4 text-white" />
                  </div>

                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>

                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                      <testimonial.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {testimonial.author}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-8">
            Trusted by leading institutions
          </p>

          <div className="relative overflow-hidden">
            <div className="flex gap-12 animate-marquee">
              {[...trustedBy, ...trustedBy].map((org, index) => (
                <div
                  key={`${org.name}-${index}`}
                  className="flex items-center gap-3 px-6 py-3 bg-slate-50 dark:bg-slate-800/70 rounded-lg flex-shrink-0 border border-transparent dark:border-slate-700/30"
                >
                  <org.icon className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                  <span className="text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">
                    {org.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
