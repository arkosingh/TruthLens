# TruthLens — AI Content Detector

TruthLens is a Next.js web app that detects AI-generated text with sentence-level precision, powered by Google Gemini. Each sentence is individually scored and colour-highlighted so you can see exactly which parts of a document were written by AI.

## Features

- Sentence-level AI probability scoring
- Overall AI confidence score with a visual ring
- Colour-highlighted text (green → human, red → AI)
- Scan history saved locally in the browser
- Downloadable analysis report
- Demo mode when no API key is configured

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

TruthLens uses the [Google Gemini API](https://ai.google.dev) for AI detection. Without an API key it runs in **demo mode** with simulated results.

### Get a free API key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Click **Create API key**
3. Copy the key

### Set up locally

```bash
cp .env.local.example .env.local
```

Add your key to `.env.local`:

```
GEMINI_API_KEY=your_key_here
```

Restart the dev server:

```bash
npm run dev
```

### Deploy on Vercel

Add `GEMINI_API_KEY` as an environment variable in your Vercel project **Settings → Environment Variables**, then redeploy.

## Tech Stack

- [Next.js 14](https://nextjs.org) (App Router)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Google Gemini API](https://ai.google.dev/docs)
- [Lucide React](https://lucide.dev)

## License

MIT — see [LICENSE](LICENSE)
