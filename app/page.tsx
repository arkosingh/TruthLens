import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { Testimonials } from "@/components/Testimonials";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TruthLens — Preserve What's Human",
  description:
    "AI content detection and plagiarism checking you can trust. Detect AI-generated text with 99% accuracy using our advanced analysis tools.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
    </>
  );
}
