import express from "express";
import cors from "cors";
import quizRoutes from "./routes/quizRoutes";
import questionRoutes from "./routes/questionRoutes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/quizzes", quizRoutes);
app.use("/api/questions", questionRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Online Quiz API is running!",
    endpoints: {
      createQuiz: "POST /api/quizzes",
      getQuizzes: "GET /api/quizzes",
      getQuizQuestions: "GET /api/quizzes/:quizId/questions",
      submitAnswers: "POST /api/quizzes/:quizId/submit",
      addQuestion: "POST /api/questions/:quizId",
    },
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

export default app;
