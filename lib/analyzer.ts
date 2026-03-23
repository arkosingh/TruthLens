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
  isDemo: boolean;
}

interface SentenceScore {
  score: number;
  sentence: string;
}

interface GeminiResponse {
  score: number;
  sentence_scores: SentenceScore[];
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
  return text
    .replace(/([.!?]+)\s+/g, "$1|")
    .split("|")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function calculateAiProbability(sentence: string): number {
  let probability = 0.5;

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
    /\?\s*\w+/g,
    /[!]{2,}/g,
  ];

  const lowerSentence = sentence.toLowerCase();

  formalIndicators.forEach((word) => {
    if (lowerSentence.includes(word)) {
      probability += 0.15;
    }
  });

  aiPatterns.forEach((pattern) => {
    if (pattern.test(sentence)) {
      probability += 0.2;
    }
  });

  humanIndicators.forEach((word) => {
    if (lowerSentence.includes(word)) {
      probability -= 0.15;
    }
  });

  casualPatterns.forEach((pattern) => {
    if (pattern.test(sentence)) {
      probability -= 0.1;
    }
  });

  const wordCount = sentence.split(/\s+/).length;
  if (wordCount > 25) {
    probability += 0.1;
  } else if (wordCount < 8) {
    probability -= 0.1;
  }

  const sentenceHash = hashString(sentence);
  const randomFactor = (sentenceHash % 100) / 1000;
  probability += randomFactor - 0.05;

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

function mapGeminiResponse(
  data: GeminiResponse,
  originalText: string,
  wordCount: number,
  characterCount: number,
  readingTime: string
): AnalysisResult {
  const overallScore = Math.round(data.score * 100);

  let currentIndex = 0;
  const sentences: SentenceAnalysis[] = (data.sentence_scores || []).map((ss) => {
    const startIndex = originalText.indexOf(ss.sentence, currentIndex);
    const endIndex = startIndex >= 0 ? startIndex + ss.sentence.length : currentIndex + ss.sentence.length;
    currentIndex = Math.max(currentIndex, endIndex);

    return {
      text: ss.sentence,
      aiProbability: ss.score,
      startIndex: startIndex >= 0 ? startIndex : 0,
      endIndex,
    };
  });

  return {
    id: generateId(),
    text: originalText,
    overallScore,
    sentences,
    plagiarismScore: 0,
    wordCount,
    characterCount,
    readingTime,
    scanDate: new Date().toISOString(),
    verdict: determineVerdict(overallScore),
    isDemo: false,
  };
}

function mockAnalyzeText(
  text: string,
  wordCount: number,
  characterCount: number,
  readingTime: string
): AnalysisResult {
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

  const overallScore = Math.round(
    sentenceAnalyses.reduce((sum, s) => sum + s.aiProbability, 0) / sentenceAnalyses.length * 100
  );

  const textHash = hashString(text);
  const plagiarismScore = Math.round((textHash % 40) + 5);

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
    isDemo: true,
  };
}

let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 5000;

export async function analyzeText(text: string): Promise<AnalysisResult> {
  const characterCount = text.length;
  const wordCount = text.trim().split(/\s+/).filter((w) => w.length > 0).length;
  const readingTime = calculateReadingTime(wordCount);

  const now = Date.now();
  if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
    const waitTime = Math.ceil((MIN_REQUEST_INTERVAL - (now - lastRequestTime)) / 1000);
    throw new Error(`Please wait ${waitTime} seconds before scanning again.`);
  }

  if (characterCount > 200000) {
    throw new Error("Text exceeds the maximum length of 200,000 characters.");
  }

  try {
    lastRequestTime = now;
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (response.ok) {
      const data: GeminiResponse = await response.json();
      return mapGeminiResponse(data, text, wordCount, characterCount, readingTime);
    }

    const errorData = await response.json().catch(() => null);

    if (errorData?.code === "NO_API_KEY") {
      console.warn("No API key configured, using demo mode");
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return mockAnalyzeText(text, wordCount, characterCount, readingTime);
    }

    throw new Error(errorData?.error || `API error (${response.status}). Please try again.`);
  } catch (err) {
    if (err instanceof Error && err.message.includes("Please wait")) {
      throw err;
    }
    throw err;
  }
}

export function getVerdictColor(verdict: "human" | "mixed" | "ai"): string {
  switch (verdict) {
    case "human":
      return "#10B981";
    case "mixed":
      return "#F59E0B";
    case "ai":
      return "#EF4444";
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
    return "#10B981";
  } else if (probability < 0.7) {
    return "#F59E0B";
  }
  return "#EF4444";
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
