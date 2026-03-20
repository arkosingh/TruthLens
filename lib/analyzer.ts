export interface SentenceAnalysis {
  text: string;
  aiProbability: number;
  startIndex: number;
  endIndex: number;
}

export interface AnalysisResult {
  id: string;
  text: string;
  overallScore: number;
  sentences: SentenceAnalysis[];
  plagiarismScore: number;
  wordCount: number;
  characterCount: number;
  readingTime: string;
  scanDate: string;
  verdict: "human" | "mixed" | "ai";
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function splitIntoSentences(text: string): string[] {
  // Split on sentence endings, keeping the punctuation
  return text
    .replace(/([.!?]+)\s+/g, "$1|")
    .split("|")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function calculateAiProbability(sentence: string): number {
  let probability = 0.5; // Base probability

  // Factors that increase AI probability
  const formalIndicators = [
    "therefore",
    "furthermore",
    "consequently",
    "nevertheless",
    "additionally",
    "moreover",
    "significant",
    "demonstrate",
    "implement",
    "utilize",
    "optimize",
    "leverage",
  ];

  const aiPatterns = [
    /\b(in the realm of|in terms of|it is important to note|it should be noted)\b/gi,
    /\b(plays a crucial role|serves as|acts as a)\b/gi,
    /\b(not only.*but also|both.*and|either.*or)\b/gi,
  ];

  // Factors that decrease AI probability (human indicators)
  const humanIndicators = [
    "honestly",
    "literally",
    "like",
    "anyway",
    "so",
    "i mean",
    "you know",
    "kind of",
    "sort of",
    "tbh",
    "imo",
    "fr",
    "ngl",
  ];

  const casualPatterns = [
    /\b(i'm|i've|i'd|can't|won't|don't|isn't|aren't)\b/gi,
    /\?\s*\w+/g, // Questions followed by more text
    /[!]{2,}/g, // Multiple exclamation marks
  ];

  const lowerSentence = sentence.toLowerCase();

  // Check formal indicators
  formalIndicators.forEach((word) => {
    if (lowerSentence.includes(word)) {
      probability += 0.15;
    }
  });

  // Check AI patterns
  aiPatterns.forEach((pattern) => {
    if (pattern.test(sentence)) {
      probability += 0.2;
    }
  });

  // Check human indicators
  humanIndicators.forEach((word) => {
    if (lowerSentence.includes(word)) {
      probability -= 0.15;
    }
  });

  // Check casual patterns
  casualPatterns.forEach((pattern) => {
    if (pattern.test(sentence)) {
      probability -= 0.1;
    }
  });

  // Sentence length heuristic
  const wordCount = sentence.split(/\s+/).length;
  if (wordCount > 25) {
    probability += 0.1; // Longer sentences tend to be more AI-like
  } else if (wordCount < 8) {
    probability -= 0.1; // Short sentences tend to be more human
  }

  // Use hash for consistent randomness based on sentence content
  const sentenceHash = hashString(sentence);
  const randomFactor = (sentenceHash % 100) / 1000; // Small random variation
  probability += randomFactor - 0.05;

  // Clamp to 0-1 range
  return Math.max(0, Math.min(1, probability));
}

function calculateReadingTime(wordCount: number): string {
  const minutes = Math.ceil(wordCount / 200);
  if (minutes === 1) {
    return "1 min";
  }
  return `${minutes} mins`;
}

function determineVerdict(overallScore: number): "human" | "mixed" | "ai" {
  if (overallScore < 30) {
    return "human";
  } else if (overallScore < 70) {
    return "mixed";
  }
  return "ai";
}

export async function analyzeText(text: string): Promise<AnalysisResult> {
  // Simulate processing delay for realism
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const characterCount = text.length;
  const wordCount = text.trim().split(/\s+/).filter((w) => w.length > 0).length;
  const readingTime = calculateReadingTime(wordCount);

  const sentences = splitIntoSentences(text);
  let currentIndex = 0;

  const sentenceAnalyses: SentenceAnalysis[] = sentences.map((sentence) => {
    const startIndex = text.indexOf(sentence, currentIndex);
    const endIndex = startIndex + sentence.length;
    currentIndex = endIndex;

    return {
      text: sentence,
      aiProbability: calculateAiProbability(sentence),
      startIndex,
      endIndex,
    };
  });

  // Calculate overall score as weighted average
  const overallScore = Math.round(
    sentenceAnalyses.reduce((sum, s) => sum + s.aiProbability, 0) / sentenceAnalyses.length * 100
  );

  // Generate consistent plagiarism score based on text hash
  const textHash = hashString(text);
  const plagiarismScore = Math.round((textHash % 40) + 5); // 5-45% range

  return {
    id: generateId(),
    text,
    overallScore,
    sentences: sentenceAnalyses,
    plagiarismScore,
    wordCount,
    characterCount,
    readingTime,
    scanDate: new Date().toISOString(),
    verdict: determineVerdict(overallScore),
  };
}

export function getVerdictColor(verdict: "human" | "mixed" | "ai"): string {
  switch (verdict) {
    case "human":
      return "#10B981"; // emerald-500
    case "mixed":
      return "#F59E0B"; // amber-500
    case "ai":
      return "#EF4444"; // red-500
    default:
      return "#2563EB";
  }
}

export function getVerdictLabel(verdict: "human" | "mixed" | "ai"): string {
  switch (verdict) {
    case "human":
      return "Likely Human Written";
    case "mixed":
      return "Mixed AI & Human";
    case "ai":
      return "Likely AI Generated";
    default:
      return "Unknown";
  }
}

export function getProbabilityColor(probability: number): string {
  if (probability < 0.3) {
    return "#10B981"; // Low AI probability = human-like
  } else if (probability < 0.7) {
    return "#F59E0B"; // Medium
  }
  return "#EF4444"; // High AI probability
}

export function getProbabilityLabel(probability: number): string {
  const percentage = Math.round(probability * 100);
  if (probability < 0.3) {
    return `${percentage}% AI Probability`;
  } else if (probability < 0.7) {
    return `${percentage}% AI Probability`;
  }
  return `${percentage}% AI Probability`;
}
