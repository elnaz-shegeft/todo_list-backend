import express from "express";
import pool from "./db";
import tasksRouter from "./routes/tasks";
import { AppDataSource } from "./data-source";
import { Task } from "./entities/task";
const app = express ();

app.use(express.json());
app.use("/tasks", tasksRouter);

pool.query("SELECT NOW()")
.then(() => {
    console.log ("database is connected");
})
.catch((error:unknown) => {
    console.error("failed connection to database", error);
});

app.get ("/", (req, res) => {
    res.send ("API is running");
});
AppDataSource.initialize()
  .then(() => {
    console.log("TypeORM connected");
     const taskRepository = AppDataSource.getRepository(Task);

  })
  .catch((error) => {
    console.error("TypeORM connection failed:", error);
  });
app.listen(3000, () =>{

    console.log("server is listening on port 3000");

})