import app from "./app";
import { initDB } from "./models/database";

const PORT = 3000;

async function startServer() {
  try {
    await initDB(); 
    app.listen(PORT, () => {
      console.log(" Server running on http://localhost:3000");
      console.log(" Database connected!");
    });
  } catch (error) {
    console.error(" Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
