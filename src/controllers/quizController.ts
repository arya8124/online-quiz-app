import { Request, Response } from "express";
import { QuizModel } from "../models/quiz";
import { QuestionModel } from "../models/question";

// Helper function for error handling
const handleError = (res: Response, error: any) => {
  console.error(error);
  res.status(500).json({ error: "Something went wrong" });
};

// Creating a new quiz
export const createQuiz = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ error: "Quiz title is required" });
    }

    const quiz = await QuizModel.create(title.trim());
    res.status(201).json(quiz);
  } catch (error) {
    handleError(res, error);
  }
};

// Getting all quizzes
export const getAllQuizzes = async (req: Request, res: Response) => {
  try {
    const quizzes = await QuizModel.findAll();
    res.json(quizzes);
  } catch (error) {
    handleError(res, error);
  }
};

// Getting quiz questions (without answers)
export const getQuizQuestions = async (req: Request, res: Response) => {
  try {
    const { quizId } = req.params;
    const quiz = await QuizModel.findById(Number(quizId));

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    const questions = await QuestionModel.findByQuizId(Number(quizId));
    res.json(questions);
  } catch (error) {
    handleError(res, error);
  }
};

// Submitting answers and get score
export const submitAnswers = async (req: Request, res: Response) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({ error: "Answers should be an array" });
    }

    const quiz = await QuizModel.findById(Number(quizId));
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    const questions = await QuestionModel.findWithAnswers(Number(quizId));
    const score = answers.reduce((total, answer) => {
      const question = questions.find((q) => q.id === answer.questionId);
      return (
        total + (question?.correctAnswer === answer.selectedOption ? 1 : 0)
      );
    }, 0);

    res.json({
      score,
      total: questions.length,
      percentage: ((score / questions.length) * 100).toFixed(2),
    });
  } catch (error) {
    handleError(res, error);
  }
};
