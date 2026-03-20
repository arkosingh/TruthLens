export interface SampleText {
  id: string;
  label: string;
  text: string;
}

export const sampleTexts: SampleText[] = [
  {
    id: "chatgpt",
    label: "ChatGPT Sample",
    text: `Artificial intelligence has emerged as one of the most transformative technologies of the 21st century. Machine learning algorithms, particularly deep learning neural networks, have demonstrated remarkable capabilities in pattern recognition, natural language processing, and decision-making tasks. The integration of AI systems across various industries has led to significant improvements in efficiency, accuracy, and scalability. However, these advancements also raise important ethical considerations regarding privacy, bias, and the future of human employment. Organizations must develop comprehensive frameworks to ensure responsible AI deployment while maximizing the benefits of this powerful technology.`,
  },
  {
    id: "human",
    label: "Human Written",
    text: `So, I finally tried that new coffee shop downtown yesterday—honestly? I'm still thinking about it. The barista, Marcus, took like five whole minutes just chatting with me about beans and roasting. I mean, who does that anymore? Everyone's always rushing. Anyway, I got this oat milk latte with a hint of lavender (sounds weird, I know) and it was... chef's kiss. I'm not usually into those fancy drinks, but this one hit different. The vibe was cozy too—exposed brick, mismatched chairs, some indie playlist in the background. I'm definitely going back next week. Maybe even tomorrow. Who am I kidding?`,
  },
  {
    id: "mixed",
    label: "Mixed Content",
    text: `Climate change represents one of the most pressing challenges facing humanity today. Rising global temperatures have resulted in increasingly severe weather patterns, including more frequent hurricanes, prolonged droughts, and devastating wildfires. Scientific consensus indicates that human activities, particularly the burning of fossil fuels, are the primary drivers of this phenomenon.

But here's the thing—I grew up in a small coastal town, right? And I've watched my favorite beach erode year after year. It's not just stats on a page; it's the place where I learned to surf, where my grandparents took their honeymoon. Last summer, my mom sent me photos of our old pier—half of it's underwater now. It's heartbreaking, honestly. We need to do better, not just for the graphs and the headlines, but for all these little places that mean everything to someone.`,
  },
];

export function getSampleById(id: string): SampleText | undefined {
  return sampleTexts.find((sample) => sample.id === id);
}
