import { Router, type Request, type Response } from "express";
import { AppDataSource } from "../data-source";
import { Task } from "../entities/task";
import { requireAuth } from "../auth";

const router = Router();
const tasks = AppDataSource.getRepository(Task);
router.use(requireAuth);
const labels = ["work", "study", "personal", "health", "others"];
const fields = ["title", "dueDate", "completed", "important", "difficulty", "label"] as const;

function validDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + "T00:00:00Z");
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function parseTask(body: unknown, partial: boolean): Partial<Task> | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const input = body as Record<string, unknown>;
  if (Object.keys(input).some(key => !fields.includes(key as typeof fields[number]))) return null;
  if ((!partial && !("title" in input)) || (partial && !Object.keys(input).length)) return null;
  if ("title" in input && (typeof input.title !== "string" || !input.title.trim() || input.title.length > 255)) return null;
  if ("dueDate" in input && input.dueDate !== null && !validDate(input.dueDate)) return null;
  if ("completed" in input && typeof input.completed !== "boolean") return null;
  if ("important" in input && typeof input.important !== "boolean") return null;
  for (const key of ["difficulty", "label"] as const) {
    if (key in input && input[key] !== null && (typeof input[key] !== "string" || input[key].length > 100)) return null;
  }
  const result: Partial<Task> = {};
  if ("title" in input) result.title = (input.title as string).trim();
  if ("dueDate" in input) result.dueDate = input.dueDate as string | null;
  if ("completed" in input) result.completed = input.completed as boolean;
  if ("important" in input) result.important = input.important as boolean;
  if ("difficulty" in input) result.difficulty = input.difficulty as string | null;
  if ("label" in input) result.label = input.label as string | null;
  return result;
}

function taskId(req: Request): number | null {
  const raw = req.params.id;
  if (typeof raw !== "string" || !/^[1-9]\d*$/.test(raw)) return null;
  const id = Number(raw);
  return Number.isSafeInteger(id) ? id : null;
}

async function list(req: Request, res: Response, preset: Record<string, string> = {}) {
  const allowed = new Set(["page", "limit", "completed", "important", "label", "difficulty", "search", "dueFrom", "dueTo"]);
  if (Object.keys(req.query).some(key => !allowed.has(key))) {
    res.status(400).json({ message: "Unknown query parameter" }); return;
  }
  const get = (key: string) => preset[key] ?? req.query[key];
  const pageRaw = get("page") ?? "1", limitRaw = get("limit") ?? "20";
  if (typeof pageRaw !== "string" || !/^[1-9]\d*$/.test(pageRaw) ||
      typeof limitRaw !== "string" || !/^[1-9]\d*$/.test(limitRaw)) {
    res.status(400).json({ message: "page and limit must be positive integers" }); return;
  }
  const page = Number(pageRaw), limit = Number(limitRaw);
  if (!Number.isSafeInteger(page) || !Number.isSafeInteger(limit) || limit > 100 || !Number.isSafeInteger((page - 1) * limit)) {
    res.status(400).json({ message: "Invalid pagination (limit must be at most 100)" }); return;
  }
  const completed = get("completed"), important = get("important");
  const label = get("label"), difficulty = get("difficulty"), search = get("search");
  const dueFrom = get("dueFrom"), dueTo = get("dueTo");
  if ([completed, important].some(v => v !== undefined && v !== "true" && v !== "false") ||
      [label, difficulty, search].some(v => v !== undefined && (typeof v !== "string" || !v.trim() || v.length > 100)) ||
      [dueFrom, dueTo].some(v => v !== undefined && !validDate(v)) ||
      (typeof dueFrom === "string" && typeof dueTo === "string" && dueFrom > dueTo)) {
    res.status(400).json({ message: "Invalid task filter" }); return;
  }
  const qb = tasks.createQueryBuilder("task").where("task.ownerId = :ownerId", { ownerId: res.locals.userId });
  if (completed !== undefined) qb.andWhere("task.completed = :completed", { completed: completed === "true" });
  if (important !== undefined) qb.andWhere("task.important = :important", { important: important === "true" });
  if (label !== undefined) qb.andWhere("task.label = :label", { label });
  if (difficulty !== undefined) qb.andWhere("task.difficulty = :difficulty", { difficulty });
  if (search !== undefined) qb.andWhere("task.title ILIKE :search", { search: "%" + String(search).replace(/[\\%_]/g, "\\$&") + "%" });
  if (dueFrom !== undefined) qb.andWhere("task.dueDate >= :dueFrom", { dueFrom });
  if (dueTo !== undefined) qb.andWhere("task.dueDate <= :dueTo", { dueTo });
  if (preset.due === "today") qb.andWhere("task.dueDate = CURRENT_DATE");
  if (preset.due === "upcoming") qb.andWhere("task.dueDate > CURRENT_DATE");
  if (preset.due === "overdue") qb.andWhere("task.dueDate < CURRENT_DATE");
  const [data, total] = await qb.orderBy("task.id", "DESC").skip((page - 1) * limit).take(limit).getManyAndCount();
  res.json({ data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
}

router.post("/", async (req, res) => {
  const input = parseTask(req.body, false);
  if (!input) { res.status(400).json({ message: "Invalid task data" }); return; }
  const task = await tasks.save(tasks.create({ ...input, ownerId: res.locals.userId as number }));
  res.status(201).json(task);
});
router.get("/", async (req, res) => list(req, res));
router.get("/labels", (_req, res) => { res.json(labels); });
router.get("/today", async (req, res) => list(req, res, { completed: "false", due: "today" }));
router.get("/upcoming", async (req, res) => list(req, res, { completed: "false", due: "upcoming" }));
router.get("/completed", async (req, res) => list(req, res, { completed: "true" }));
router.get("/important", async (req, res) => list(req, res, { important: "true" }));
router.get("/overdue", async (req, res) => list(req, res, { completed: "false", due: "overdue" }));
for (const label of labels) router.get("/" + label, async (req, res) => list(req, res, { label }));

router.get("/:id", async (req, res) => {
  const id = taskId(req);
  if (id === null) { res.status(400).json({ message: "Invalid task id" }); return; }
  const task = await tasks.findOneBy({ id, ownerId: res.locals.userId as number });
  if (!task) { res.status(404).json({ message: "Task not found" }); return; }
  res.json(task);
});
router.patch("/:id", async (req, res) => {
  const id = taskId(req);
  if (id === null) { res.status(400).json({ message: "Invalid task id" }); return; }
  const input = parseTask(req.body, true);
  if (!input) { res.status(400).json({ message: "Invalid task data" }); return; }
  const task = await tasks.findOneBy({ id, ownerId: res.locals.userId as number });
  if (!task) { res.status(404).json({ message: "Task not found" }); return; }
  Object.assign(task, input);
  res.json(await tasks.save(task));
});
router.delete("/:id", async (req, res) => {
  const id = taskId(req);
  if (id === null) { res.status(400).json({ message: "Invalid task id" }); return; }
  const result = await tasks.delete({ id, ownerId: res.locals.userId as number });
  if (!result.affected) { res.status(404).json({ message: "Task not found" }); return; }
  res.status(204).send();
});

export default router;
