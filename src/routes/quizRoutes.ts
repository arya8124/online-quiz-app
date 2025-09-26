import express from "express";
import {
  createQuiz,
  getAllQuizzes,
  getQuizQuestions,
  submitAnswers,
} from "../controllers/quizController";

const router = express.Router();

router.post("/", createQuiz);
router.get("/", getAllQuizzes);
router.get("/:quizId/questions", getQuizQuestions);
router.post("/:quizId/submit", submitAnswers);

export default router;
