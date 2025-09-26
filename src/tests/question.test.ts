import request from "supertest";
import app from "../app";

describe("Question API Tests", () => {
  beforeEach(() => {
    const { quizzes, questions } = require("../models/database");
    quizzes.length = 0;
    questions.length = 0;
  });

  describe("POST /api/questions/:quizId", () => {
    it("should add question to quiz", async () => {
      const quiz = await request(app)
        .post("/api/quizzes")
        .send({ title: "Geography Quiz" });

      const quizId = quiz.body.id;

      const response = await request(app)
        .post(`/api/questions/${quizId}`)
        .send({
          text: "What is the capital of France?",
          options: ["London", "Paris", "Berlin"],
          correctAnswer: "Paris",
          type: "single-choice",
        })
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body.text).toBe("What is the capital of France?");
      expect(response.body.quizId).toBe(quizId);
    });

    it("should validate question text length for text questions", async () => {
      const quiz = await request(app)
        .post("/api/quizzes")
        .send({ title: "Essay Quiz" });

      const quizId = quiz.body.id;

      const longText = "a".repeat(301);
      const response = await request(app)
        .post(`/api/questions/${quizId}`)
        .send({
          text: longText,
          type: "text",
        })
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });
  });
});
