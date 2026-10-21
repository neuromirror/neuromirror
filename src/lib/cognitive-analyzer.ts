import { htmlToText } from "./text";

export interface CognitiveAnalysisResult {
  summary: string;
  trend?: { label: string; summary: string };
  observations: {
    area: string;
    finding: string;
    evidence: string;
    caveat: string;
  }[];
  reflectionQuestions: string[];
  disclaimer: string;
}

const HESITATION_WORDS = ["maybe", "perhaps", "i guess", "i think", "might", "possibly", "wonder if", "unsure", "not sure", "confused"];
const REFLECTIVE_WORDS = ["realized", "learned", "noticed", "felt", "remember", "discovered", "grateful", "understand", "meaning", "perspective"];
const EMOTIONAL_WORDS: Record<string, string[]> = {
  calm: ["peaceful", "quiet", "rested", "content", "still", "breathe", "slow", "serene"],
  optimistic: ["excited", "happy", "great", "forward", "hopeful", "progress", "proud", "good", "win"],
  stressed: ["busy", "overwhelmed", "rushed", "deadline", "tired", "pressure", "anxious", "worry", "stress"],
};

export function analyzeWritingLocally(title: string, rawContent: string): CognitiveAnalysisResult {
  const text = htmlToText(rawContent).trim();
  const words = text.toLowerCase().match(/\b[a-z'-]+\b/g) || [];
  const totalWords = words.length;
  const uniqueWords = new Set(words).size;

  const sentences = text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const totalSentences = Math.max(sentences.length, 1);
  const avgSentenceLength = totalWords / totalSentences;

  // Lexical diversity (Type-Token Ratio)
  const lexicalDiversity = totalWords > 0 ? (uniqueWords / totalWords) * 100 : 0;

  // Emotional themes
  let detectedMood = "neutral";
  let maxMoodCount = 0;
  for (const [mood, keywords] of Object.entries(EMOTIONAL_WORDS)) {
    const count = words.filter((w) => keywords.includes(w)).length;
    if (count > maxMoodCount) {
      maxMoodCount = count;
      detectedMood = mood;
    }
  }

  // Hesitation analysis
  const lowerText = text.toLowerCase();
  const hesitationCount = HESITATION_WORDS.filter((phrase) => lowerText.includes(phrase)).length;

  // Reflective phrasing
  const reflectiveCount = REFLECTIVE_WORDS.filter((phrase) => lowerText.includes(phrase)).length;

  const observations: CognitiveAnalysisResult["observations"] = [];

  // Observation 1: Structure & Cadence
  if (avgSentenceLength > 18) {
    observations.push({
      area: "Sentence Complexity",
      finding: "Elaborated, multi-clause thoughts with continuous flow",
      evidence: sentences[0]?.slice(0, 60) || "",
      caveat: "Complex structure often reflects deep introspective deliberation or stream-of-consciousness writing.",
    });
  } else if (avgSentenceLength < 9) {
    observations.push({
      area: "Pacing & Clarity",
      finding: "Direct, concise statements with rapid transitions",
      evidence: sentences[0]?.slice(0, 40) || "",
      caveat: "Shorter sentences often emerge during decisive recording or quick situational notes.",
    });
  } else {
    observations.push({
      area: "Rhythm & Balance",
      finding: "Balanced sentence structure with natural readability",
      evidence: sentences[0]?.slice(0, 50) || "",
      caveat: "A standard rhythm suggests ease of expression and steady cognitive pacing.",
    });
  }

  // Observation 2: Vocabulary & Variety
  if (lexicalDiversity > 70) {
    observations.push({
      area: "Lexical Diversity",
      finding: "High vocabulary breadth with rich situational descriptors",
      evidence: "",
      caveat: "Varied vocabulary reflects diverse semantic connections across different contexts.",
    });
  } else {
    observations.push({
      area: "Thematic Consistency",
      finding: "Focused recurring key concepts throughout the text",
      evidence: "",
      caveat: "Repeating foundational words often indicates strong topical focus on a specific subject.",
    });
  }

  // Observation 3: Reflection & Markers
  if (reflectiveCount > 0) {
    observations.push({
      area: "Self-Reflection Language",
      finding: "Active introspective markers indicating internal processing",
      evidence: "",
      caveat: "Noted use of words related to discovery, feeling, and situational awareness.",
    });
  } else if (hesitationCount > 0) {
    observations.push({
      area: "Exploratory Language",
      finding: "Use of open-ended and tentative phrasing",
      evidence: "",
      caveat: "Tentative phrasing often indicates exploratory problem-solving or weighing choices.",
    });
  } else {
    observations.push({
      area: "Narrative Certainty",
      finding: "Direct declarative narration of events or ideas",
      evidence: "",
      caveat: "Direct narrative framing highlights events as clear, matter-of-fact observations.",
    });
  }

  // Summary
  const summary = `This entry (${totalWords} words) explores ${
    title ? `"${title}"` : "the day's events"
  } with ${
    detectedMood !== "neutral" ? `a predominantly ${detectedMood} tone and ` : ""
  }an average sentence length of ${Math.round(avgSentenceLength)} words across ${totalSentences} sentence${
    totalSentences === 1 ? "" : "s"
  }.`;

  // Reflection questions
  const reflectionQuestions = [
    "What stood out most to you as you wrote or spoke these thoughts?",
    "If you revisit this experience a month from now, what lesson would you want to remember?",
    reflectiveCount > 0
      ? "What deeper insight emerged from exploring this moment?"
      : "What felt easiest to express, and what was left unspoken?",
  ];

  return {
    summary,
    trend: {
      label: "Linguistic Overview",
      summary: `Writing reflects ${detectedMood} thematic presence with ${Math.round(lexicalDiversity)}% vocabulary diversity.`,
    },
    observations,
    reflectionQuestions,
    disclaimer:
      "Informational writing observations only. This is not a cognitive assessment or diagnosis; language patterns reflect situational context and style, not health status.",
  };
}
