import request from "supertest";
import app from "../app";
import { QuizModel } from "../models/quiz";
import { QuestionModel } from "../models/question";

describe("Quiz API Tests", () => {
  beforeEach(() => {
    // Clearing data before each test
    const { quizzes, questions } = require("../models/database");
    quizzes.length = 0;
    questions.length = 0;
  });

  describe("POST /api/quizzes", () => {
    it("should create a new quiz", async () => {
      const response = await request(app)
        .post("/api/quizzes")
        .send({ title: "Science Quiz" })
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body.title).toBe("Science Quiz");
      expect(response.body).toHaveProperty("createdAt");
    });

    it("should return 400 if title is missing", async () => {
      const response = await request(app)
        .post("/api/quizzes")
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("GET /api/quizzes", () => {
    it("should get all quizzes", async () => {
      // Creating a quiz first
      await request(app).post("/api/quizzes").send({ title: "Math Quiz" });

      const response = await request(app).get("/api/quizzes").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].title).toBe("Math Quiz");
    });
  });

  describe("POST /api/quizzes/:quizId/submit", () => {
    it("should submit answers and return score", async () => {
      // Creating quiz and question
      const quiz = await request(app)
        .post("/api/quizzes")
        .send({ title: "Test Quiz" });

      const quizId = quiz.body.id;

      await request(app)
        .post(`/api/questions/${quizId}`)
        .send({
          text: "What is 2+2?",
          options: ["3", "4", "5"],
          correctAnswer: "4",
          type: "single-choice",
        });

      const response = await request(app)
        .post(`/api/quizzes/${quizId}/submit`)
        .send({
          answers: [{ questionId: 1, selectedOption: "4" }],
        })
        .expect(200);

      expect(response.body).toHaveProperty("score", 1);
      expect(response.body).toHaveProperty("total", 1);
      expect(response.body).toHaveProperty("percentage", "100.00");
    });
  });
});
