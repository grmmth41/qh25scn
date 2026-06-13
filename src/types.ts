export interface Question {
  id: number;
  module: number;
  moduleName: string;
  difficulty: "Dễ" | "Trung bình" | "Khó";
  text: string;
  options: {
    key: string;
    text: string;
  }[];
  correctKey: string;
  explanation: string;
}

export interface SRSState {
  questionId: number;
  interval: number; // in days
  repetition: number; // consecutive correct answers
  efactor: number; // Easy Factor (default starting at 2.5)
  nextReviewDate: string; // ISO date string
}

export interface UserNote {
  questionId: number;
  content: string;
  format: "Standard" | "Cornell" | "Mnemonic" | "ActiveRecall";
  updatedAt: string;
}

export interface QuizSession {
  id: string; // unique ID
  date: string; // ISO string
  type: "Mock" | "Module" | "SRS";
  examId?: number; // 1 to 14 represent the specific fixed exam
  moduleName?: string; // name if practiced by module
  duration: number; // in seconds
  score: number; // e.g. 80 (%)
  correctCount: number;
  totalCount: number;
  answers: { [questionId: number]: string }; // Map of questionId -> userAnswer key
}

export interface LearningSolution {
  title: string;
  content: string;
  suggestions: string[];
}
