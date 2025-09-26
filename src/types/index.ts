export interface Quiz {
  id: number;
  title: string;
  questions: Question[];
  createdAt: Date;
}

export interface Question {
  id: number;
  quizId: number;
  text: string;
  options: string[];
  correctAnswer: string;
  type: string;
  createdAt: Date;
}

export interface Answer {
  questionId: number;
  selectedOption: string;
}

export interface QuizResult {
  score: number;
  total: number;
  percentage: string;
}
