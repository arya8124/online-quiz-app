import express from "express";
import { addQuestionToQuiz } from "../controllers/questionController";

const router = express.Router();

router.post("/:quizId", addQuestionToQuiz);

export default router;
