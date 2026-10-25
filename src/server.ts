import express from "express";
import swaggerUi from "swagger-ui-express";

import tasksRouter from "./routes/tasks";
import authRouter from "./routes/auth";
import { AppDataSource } from "./data-source";
import { swaggerDocument } from "./swagger";

async function main() {
  const app = express();
  await AppDataSource.initialize();

  app.use(express.json());
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} (${req.ip})`);
    next();
  });
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use("/api-json", (req, res) => {
    res.status(200).json(swaggerDocument);
  });

  app.use("/tasks", tasksRouter);
  app.use("/auth", authRouter);
  app.get("/", (req, res) => {
    res.status(200).json({
      message: "API is running",
      docs: "/api-docs",
    });
  });
  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  });
  app.listen(3000, '0.0.0.0', () => {
    console.log("server is listening on port 3000");
    console.log("swagger docs are available at http://localhost:3000/api-docs");
  });
}

console.clear();
main().catch((error) => {
  console.error("failed to start server", error);
  process.exit(1);
});
