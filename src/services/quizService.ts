import { Question, Answer, QuizResult } from "../types";

export class QuizService {
  static calculateScore(answers: Answer[], questions: Question[]): QuizResult {
    let score = 0;

    answers.forEach((answer: Answer) => {
      const question = questions.find((q) => q.id === answer.questionId);
      if (question && question.correctAnswer === answer.selectedOption) {
        score++;
      }
    });

    return {
      score,
      total: questions.length,
      percentage:
        questions.length > 0
          ? ((score / questions.length) * 100).toFixed(2)
          : "0.00",
    };
  }

  static filterOutCorrectAnswers(questions: Question[]): Question[] {
    return questions.map((question) => ({
      ...question,
      correctAnswer: "", // Remove correct answer from response
    }));
  }

  static validateQuizCompletion(
    quizId: number,
    questions: Question[]
  ): string | null {
    if (questions.length === 0) {
      return "Quiz has no questions";
    }

    const quizQuestions = questions.filter((q) => q.quizId === quizId);
    if (quizQuestions.length === 0) {
      return "No questions found for this quiz";
    }

    return null;
  }
}
