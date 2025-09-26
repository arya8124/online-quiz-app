import { Request, Response, NextFunction } from "express";
import { ValidationService } from "../services/validationService";

export const validateQuizCreation = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { title } = req.body;

  if (!title || title.trim() === "") {
    res.status(400).json({ error: "Quiz title is required" });
    return;
  }

  if (title.length > 100) {
    res
      .status(400)
      .json({ error: "Quiz title must be less than 100 characters" });
    return;
  }

  next();
};

export const validateQuestion = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { text, options, correctAnswer, type } = req.body;

  const error = ValidationService.validateQuestion({
    text,
    options,
    correctAnswer,
    type,
  });

  if (error) {
    res.status(400).json({ error });
    return;
  }

  next();
};

export const validateAnswerSubmission = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { answers } = req.body;

  if (!Array.isArray(answers) || answers.length === 0) {
    res
      .status(400)
      .json({ error: "Answers array is required and cannot be empty" });
    return;
  }

  next();
};
