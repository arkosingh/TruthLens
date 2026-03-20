"use client";

import { motion } from "framer-motion";
import { FileText, Cpu, FileCheck } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "Paste Your Text",
    description:
      "Simply copy and paste the content you want to analyze. Supports up to 10,000 characters per scan for comprehensive analysis.",
  },
  {
    number: "02",
    icon: Cpu,
    title: "AI Analyzes",
    description:
      "Our advanced algorithms examine each sentence, checking patterns, vocabulary, and structure against AI language models.",
  },
  {
    number: "03",
    icon: FileCheck,
    title: "Get Results",
    description:
      "Receive detailed insights including overall AI probability, sentence-by-sentence breakdown, and actionable recommendations.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
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

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            How It{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-lg text-slate-600">
            Get accurate AI detection results in seconds with our streamlined
            three-step process.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative"
        >
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-24 left-[16.67%] right-[16.67%] h-0.5">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-primary via-accent to-primary origin-left"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step) => (
              <motion.div
                key={step.number}
                variants={itemVariants}
                className="relative text-center"
              >
                {/* Number Circle */}
                <div className="relative inline-flex items-center justify-center w-16 h-16 mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full opacity-20" />
                  <div className="relative z-10 w-14 h-14 bg-white rounded-full shadow-lg shadow-primary/20 flex items-center justify-center border-2 border-primary">
                    <span className="text-lg font-bold text-primary">
                      {step.number}
                    </span>
                  </div>
                  {/* Icon Badge */}
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
                    <step.icon className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-600 leading-relaxed max-w-sm mx-auto">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
