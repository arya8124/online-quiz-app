import { Request, Response } from "express";
import { QuestionModel } from "../models/question";
import { QuizModel } from "../models/quiz";

const handleError = (res: Response, error: any) => {
  console.error(error);
  res.status(500).json({ error: "Something went wrong" });
};

// Adding question to quiz
export const addQuestionToQuiz = async (req: Request, res: Response) => {
  try {
    const { quizId } = req.params;
    const { text, options, correctAnswer, type = "single-choice" } = req.body;

    // Validation
    if (!text?.trim())
      return res.status(400).json({ error: "Question text is required" });
    if (type !== "text" && (!options?.length || !correctAnswer)) {
      return res
        .status(400)
        .json({ error: "Options and correct answer are required" });
    }
    if (type === "text" && text.length > 300) {
      return res
        .status(400)
        .json({ error: "Text questions must be under 300 characters" });
    }

    const quiz = await QuizModel.findById(Number(quizId));
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    const question = await QuestionModel.create(
      Number(quizId),
      text,
      options || [],
      correctAnswer || "",
      type
    );
    res.status(201).json(question);
  } catch (error) {
    handleError(res, error);
  }
};
