import { Quiz } from "../types";
import { db } from "./database";

export class QuizModel {
  static async create(title: string): Promise<Quiz> {
    return await db.createQuiz(title);
  }

  static async findAll(): Promise<Quiz[]> {
    return await db.getQuizzes();
  }

  static async findById(id: number): Promise<Quiz | null> {
    return await db.getQuiz(id);
  }
}
