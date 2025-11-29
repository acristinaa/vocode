export interface ExamTopic {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Message {
  id: string;
  type: "agent" | "user";
  text: string;
  timestamp: Date;
}

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

export interface SessionRecord {
  id: string;
  topic: string;
  questions: number;
  timestamp: Date;
  duration: number;
  feedback?: string;
}

export interface ExamConfig {
  topic: ExamTopic;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number;
  language: string;
}
