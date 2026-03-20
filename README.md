# TruthLens — AI Content Detector

TruthLens is a Next.js application that detects AI-generated content with sentence-level precision. It uses [Sapling AI](https://sapling.ai) for real detection, with a built-in demo mode when no API key is configured.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Setting Up Real AI Detection

TruthLens uses [Sapling AI](https://sapling.ai) for real AI content detection. Without an API key, the app runs in **demo mode** with simulated results.

### Get Your Free API Key

1. Go to [sapling.ai](https://sapling.ai) and create a free account
2. Navigate to your dashboard → API Keys
3. Copy your API key

### Configure

1. Copy the example env file:
   ```bash
   cp .env.local.example .env.local
   ```
2. Add your key to `.env.local`:
   ```
   SAPLING_API_KEY=your_key_here
   ```
3. Restart the dev server:
   ```bash
   npm run dev
   ```

### Free Tier Limits

- The free tier includes a generous monthly quota
- If no API key is configured, TruthLens runs in demo mode with simulated results
- Max input per request: 200,000 characters

### Deploy on Vercel

Add `SAPLING_API_KEY` as an environment variable in your Vercel project settings.

## Tech Stack

- [Next.js](https://nextjs.org) (App Router)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Sapling AI API](https://sapling.ai/docs) for AI detection

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Sapling AI Documentation](https://sapling.ai/docs)
