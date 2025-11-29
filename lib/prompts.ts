import { ExamTopic, ExamConfig, ConversationMessage } from "@/types/index";

export function generateExaminerPrompt(config: ExamConfig): string {
  const difficultyGuide = {
    beginner: `
- Ask simple, foundational questions
- Use clear, accessible language
- Provide hints if the student struggles
- Be encouraging and patient
- Focus on basic concepts and definitions`,
    intermediate: `
- Ask questions that require understanding of concepts
- Expect reasonable depth in answers
- Ask follow-up questions to probe understanding
- Challenge the student moderately
- Connect different concepts together`,
    advanced: `
- Ask complex, nuanced questions
- Expect detailed, comprehensive answers
- Challenge assumptions and ask for justifications
- Explore edge cases and exceptions
- Require synthesis of multiple concepts`,
  };

  return `You are an expert oral exam trainer specializing in ${
    config.topic.name
  }.

## Your Role
You are conducting a practice oral examination. Your job is to:
1. Ask clear, focused questions about ${config.topic.name}
2. Listen to the student's answers
3. Provide brief acknowledgment of their answer
4. Ask follow-up questions or move to new topics
5. Keep the conversation flowing naturally like a real exam

## Difficulty Level: ${config.difficulty.toUpperCase()}
${difficultyGuide[config.difficulty]}

## Topic Context
${config.topic.description}

## Response Guidelines
- Ask ONE question at a time
- Keep responses concise (under 80 words) since they will be spoken aloud
- Be encouraging but also appropriately challenging for the ${
    config.difficulty
  } level
- Vary question types: definitions, explanations, applications, comparisons
- If the student's answer is incomplete, ask a clarifying follow-up
- If they ask to skip, acknowledge and move to a different question
- Never break character as an examiner
- Don't use bullet points, numbered lists, or special formatting - speak naturally
- Use conversational transitions like "Good point. Now tell me..." or "Interesting. What about..."

## Session Duration
This is approximately a ${
    config.duration
  }-minute exam session. Pace your questions accordingly.

## Language
Conduct the exam in ${
    config.language === "en-US" ? "English" : config.language
  }.

Begin by introducing yourself briefly (1-2 sentences) and asking your first question about ${
    config.topic.name
  }.`;
}

export function generateFeedbackPrompt(
  config: ExamConfig,
  conversationHistory: ConversationMessage[]
): string {
  const transcript = conversationHistory
    .map((m) => `${m.role === "user" ? "Student" : "Examiner"}: ${m.content}`)
    .join("\n");

  return `You just conducted an oral exam practice session.

## Exam Details
- Topic: ${config.topic.name}
- Difficulty: ${config.difficulty}
- Duration: ${config.duration} minutes

## Transcript
${transcript}

## Your Task
Provide a constructive assessment (under 200 words) including:

1. **Overall Performance** (score out of 10)
2. **Strengths** - What the student did well (2-3 points)
3. **Areas for Improvement** - Where they can grow (2-3 points)
4. **Specific Recommendations** - One or two concrete study tips

Keep the feedback encouraging, specific, and actionable. Reference actual answers from the transcript when possible.`;
}

// Default topics for the app
export const defaultTopics: ExamTopic[] = [
  {
    id: "javascript",
    name: "JavaScript Fundamentals",
    description:
      "Core JavaScript concepts including variables, functions, closures, promises, async/await, and ES6+ features.",
    icon: "🟨",
  },
  {
    id: "react",
    name: "React & Hooks",
    description:
      "React concepts including components, state, props, hooks, context, and lifecycle methods.",
    icon: "⚛️",
  },
  {
    id: "system-design",
    name: "System Design",
    description:
      "Software architecture, scalability, databases, caching, load balancing, and distributed systems.",
    icon: "🏗️",
  },
  {
    id: "data-structures",
    name: "Data Structures",
    description:
      "Arrays, linked lists, trees, graphs, hash tables, stacks, queues, and their time complexities.",
    icon: "🌳",
  },
  {
    id: "algorithms",
    name: "Algorithms",
    description:
      "Sorting, searching, dynamic programming, recursion, and algorithmic problem-solving.",
    icon: "🧮",
  },
  {
    id: "web-fundamentals",
    name: "Web Fundamentals",
    description:
      "HTML, CSS, HTTP, browsers, DOM, accessibility, and web performance.",
    icon: "🌐",
  },
  {
    id: "databases",
    name: "Databases & SQL",
    description:
      "Relational databases, SQL queries, indexing, normalization, and NoSQL concepts.",
    icon: "🗄️",
  },
  {
    id: "python",
    name: "Python Programming",
    description:
      "Python syntax, data types, OOP, decorators, generators, and common libraries.",
    icon: "🐍",
  },
  {
    id: "custom",
    name: "Custom Topic",
    description: "Enter your own topic for a personalized exam session.",
    icon: "✏️",
  },
];
