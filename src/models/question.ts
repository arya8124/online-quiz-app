import { Question } from "../types";
import { db } from "./database";

export class QuestionModel {
  static async create(
    quizId: number,
    text: string,
    options: string[],
    correctAnswer: string,
    type: "single-choice" | "multiple-choice" | "text" = "single-choice"
  ): Promise<Question> {
    return await db.addQuestion(quizId, { text, options, correctAnswer, type });
  }

  static async findByQuizId(quizId: number): Promise<Question[]> {
    return await db.getQuestions(quizId, false);
  }

  static async findWithAnswers(quizId: number): Promise<Question[]> {
    return await db.getQuestions(quizId, true);
  }
}
