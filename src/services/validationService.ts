import { Question } from "../types";

export class ValidationService {
  static validateQuestion(question: Partial<Question>): string | null {
    if (!question.text || question.text.trim() === "") {
      return "Question text is required";
    }

    if (question.type === "text" && question.text.length > 300) {
      return "Text questions must be under 300 characters";
    }

    if (question.type !== "text") {
      if (
        !question.options ||
        !Array.isArray(question.options) ||
        question.options.length < 2
      ) {
        return "At least 2 options are required for multiple choice questions";
      }

      if (!question.correctAnswer) {
        return "Correct answer is required";
      }

      if (
        question.options &&
        !question.options.includes(question.correctAnswer)
      ) {
        return "Correct answer must be one of the provided options";
      }

      // Validating unique options
      const uniqueOptions = new Set(question.options);
      if (uniqueOptions.size !== question.options.length) {
        return "Options must be unique";
      }
    }

    return null;
  }

  static validateAnswers(answers: any[], questions: Question[]): string | null {
    if (!Array.isArray(answers)) {
      return "Answers must be an array";
    }

    for (const answer of answers) {
      if (!answer.questionId || !answer.selectedOption) {
        return "Each answer must have questionId and selectedOption";
      }

      const question = questions.find((q) => q.id === answer.questionId);
      if (!question) {
        return `Question with id ${answer.questionId} not found`;
      }

      if (
        question.type !== "text" &&
        !question.options.includes(answer.selectedOption)
      ) {
        return `Selected option for question ${answer.questionId} is invalid`;
      }
    }

    return null;
  }
}
