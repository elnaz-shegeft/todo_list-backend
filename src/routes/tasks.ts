import express from "express";
import pool from "../db";
import { Task } from "../entities/task";
import { AppDataSource } from "../data-source";
import { Raw } from "typeorm";

const router = express.Router();

const taskRepository = AppDataSource.getRepository(Task);

router.post("/", async (req, res) => {
  const { title, dueDate, important, difficulty, label } = req.body;

  const task = taskRepository.create({
    title,
    dueDate,
    important,
    difficulty,
    label,
  });

  const savedTask = await taskRepository.save(task);

  res.json(savedTask);
});

router.get("/", async (req, res) => {
  const tasks = await taskRepository.find();

  res.json(tasks);
});

router.get("/today", async (req, res) => {
  const tasks = await taskRepository.find({
    where: {
      dueDate: Raw((alias) => `${alias} = CURRENT_DATE`),
      completed: false,
    },
  });

  res.json(tasks);
});

router.get ("/upcoming", async (req, res) => {
  const tasks = await taskRepository.find({
    where: {
      dueDate: Raw((alias) => `${alias} > CURRENT_DATE`),
      completed: false,
    },
  });

  res.json(tasks);
});

router.get ("/completed", async (req, res) => {
  const tasks = await taskRepository.find({
    where: {
      completed: true,
    },
  });

  res.json(tasks);
});
   

router.get ("/important", async (req, res) => {
  const tasks = await taskRepository.find({
    where: {
      important: true,
    },
  });
    
  res.json(tasks);
});

router.get ("/overdue", async (req, res) => {
const tasks = await taskRepository.find({
  where: {
    dueDate: Raw((alias)=> `${alias} < CURRENT_DATE`),
    completed: false,
  },
});

res.json(tasks);
});

router.get("/labels", async (req, res) => {
  res.json([
    "work",
    "study",
    "personal",
    "health",
    "others"
  ]);
});
router.get ("/work", async (req, res) => {
 const tasks = await taskRepository.find({
    where: {
      label: "work",
    },
});

  res.json(tasks);
});

router.get("/study", async (req, res) => {
  const tasks = await taskRepository.find({
    where: {
      label: "study",
    },
  });

  res.json(tasks);
});

router.get ("/personal", async (req, res) => {
  const tasks = await taskRepository.find({
    where: {
      label: "personal",
    },
});

  res.json(tasks);
});
router.get ("/health", async (req, res) => {
  const tasks = await taskRepository.find({
    where: {
      label: "health",
    },
  });

  res.json(tasks);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const task = await taskRepository.findOne({
    where: {
      id: Number(id),
    },
  });

  res.json(task);
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  
  const task = await taskRepository.findOne({
    where: {
      id: Number(id),
    },
  });
  if (!task) {
  return res.status(404).json({
    message: "Task not found",
  });
}
  const { title, dueDate, completed, important, difficulty, label } = req.body;
  task.title = title;
task.dueDate = dueDate;
task.completed = completed;
task.important = important;
task.difficulty = difficulty;
task.label = label;
const updatedTask = await taskRepository.save(task);

res.json(updatedTask);
});
router.delete("/:id", async(req, res) => {
  const { id } = req.params;
  const task = await taskRepository.findOne({
    where: {
      id: Number(id),
    },
  });
 if (!task) {
  return res.status(404).json({
    message: "Task not found",
  });
}

await taskRepository.remove(task);

res.json({
  message: "Task deleted",
});
});

export default router;