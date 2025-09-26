import mysql from "mysql2/promise";
import { Quiz, Question } from "../types";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "quiz_app",
  connectionLimit: 10,
});

// table creation
export const initDB = async () => {
  const connection = await pool.getConnection();

  await connection.execute(`
        CREATE TABLE IF NOT EXISTS quizzes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

  await connection.execute(`
        CREATE TABLE IF NOT EXISTS questions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            quiz_id INT NOT NULL,
            text TEXT NOT NULL,
            options JSON,
            correct_answer VARCHAR(255),
            type VARCHAR(20) DEFAULT 'single-choice',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
        )
    `);

  connection.release();
  console.log("Database ready!");
};

export const db = {
  // Quiz methods
  createQuiz: async (title: string): Promise<Quiz> => {
    const [result] = await pool.execute(
      "INSERT INTO quizzes (title) VALUES (?)",
      [title]
    );
    const id = (result as any).insertId;
    return { id, title, questions: [], createdAt: new Date() };
  },

  getQuizzes: async (): Promise<Quiz[]> => {
    const [rows] = await pool.execute(
      "SELECT * FROM quizzes ORDER BY created_at DESC"
    );
    return rows as Quiz[];
  },

  getQuiz: async (id: number): Promise<Quiz | null> => {
    const [rows] = await pool.execute("SELECT * FROM quizzes WHERE id = ?", [
      id,
    ]);
    const quizzes = rows as Quiz[];
    return quizzes[0] || null;
  },

  // Question methods
  addQuestion: async (
    quizId: number,
    data: Partial<Question>
  ): Promise<Question> => {
    const { text, options, correctAnswer, type } = data;
    const [result] = await pool.execute(
      "INSERT INTO questions (quiz_id, text, options, correct_answer, type) VALUES (?, ?, ?, ?, ?)",
      [quizId, text, JSON.stringify(options || []), correctAnswer, type]
    );

    const id = (result as any).insertId;
    return {
      id,
      quizId,
      text: text || "",
      options: options || [],
      correctAnswer: correctAnswer || "",
      type: type || "single-choice",
      createdAt: new Date(),
    };
  },

  getQuestions: async (
    quizId: number,
    includeAnswers = false
  ): Promise<Question[]> => {
    const columns = includeAnswers
      ? "*"
      : "id, quiz_id, text, options, type, created_at";
    const [rows] = await pool.execute(
      `SELECT ${columns} FROM questions WHERE quiz_id = ?`,
      [quizId]
    );

    const questions = rows as any[];
    return questions.map((q) => ({
      ...q,
      options: q.options ? JSON.parse(q.options) : [],
    }));
  },
};

export default pool;
