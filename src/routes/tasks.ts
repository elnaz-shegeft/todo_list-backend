import express from "express";
import pool from "../db";

const router = express.Router();

router.post("/", async (req, res) => {
  const { title, dueDate, important, difficulty, label } = req.body;

  const result = await pool.query(
    "INSERT INTO tasks (title, due_date, important, difficulty, label) VALUES ($1, $2, $3, $4, $5) RETURNING *",
[title, dueDate, important, difficulty, label]
  );

  res.json(result.rows[0]);
});

router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM tasks");

  res.json(result.rows);
});

router.get ("/today", async (req, res) => {
const result = await pool.query (
  "SELECT * FROM tasks WHERE due_date = CURRENT_DATE AND completed = false"
);
res.json (result.rows);
});

router.get ("/upcoming", async (req, res) => {
  const result = await pool.query (
    "SELECT * FROM  tasks WHERE due_date > CURRENT_DATE AND completed = false"
  );
  res.json(result.rows);
});

router.get ("/completed", async (req, res) => {
  const result = await pool.query (
    "SELECT * FROM tasks WHERE completed = true"
  );
});

router.get ("/important", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM tasks WHERE important = true"
  );
  res.json(result.rows);
});

router.get ("/overdue", async (req, res) => {
const result = await pool.query(
  "SELECT * FROM tasks WHERE due_date < CURRENT_DATE AND completed = false"
);
res.json(result.rows);
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
  const result = await pool.query (
    "SELECT * FROM tasks WHERE label = 'work'"
  );
  res.json(result.rows);
});
router.get("/study", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM tasks WHERE label = 'study'"
  );

  res.json(result.rows);
});
router.get ("/personal", async (req, res) => {
  const result = await pool.query (
    "SELECT * FROM tasks WHERE label = 'personal'"
  );
  res.json(result.rows);
});
router.get ("/health", async (req, res) => {
  const result = await pool.query (
    "SELECT * FROM tasks WHERE label = 'health'"
  );
  res.json(result.rows);
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    "SELECT * FROM tasks WHERE id = $1",
    [id]
  );

  res.json(result.rows[0]);
});
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, dueDate, completed, important, difficulty, label } = req.body;

  const result = await pool.query(
"UPDATE tasks SET title = $1, due_date = $2, completed = $3, important = $4, difficulty = $5, label = $6 WHERE id = $7 RETURNING *",
[title, dueDate, completed, important, difficulty, label, id]
  );

  res.json(result.rows[0]);
});
router.delete("/:id", async(req, res) => {
  const { id } = req.params;
  const result = await pool.query (
    "DELETE FROM tasks WHERE id = $1 RETURNING *",
  [id]
  );
  res.json(result.rows[0]);
});


export default router;