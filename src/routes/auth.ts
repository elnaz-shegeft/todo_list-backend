import { Router } from "express";
import bcrypt from "bcryptjs";
import { AppDataSource } from "../data-source";
import { User } from "../entities/user";
import { issueToken, requireAuth } from "../auth";

const router = Router();
const users = AppDataSource.getRepository(User);

router.post("/register", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (typeof email !== "string" || email.trim().length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      typeof password !== "string" || Buffer.byteLength(password, "utf8") < 8 || Buffer.byteLength(password, "utf8") > 72) {
    res.status(400).json({ message: "Valid email and password (8-72 UTF-8 bytes) required" });
    return;
  }
  const normalizedEmail = email.trim().toLowerCase();
  if (await users.existsBy({ email: normalizedEmail })) {
    res.status(409).json({ message: "Email already registered" });
    return;
  }
  try {
    const user = await users.save(users.create({
      email: normalizedEmail,
      passwordHash: await bcrypt.hash(password, 12),
    }));
    res.status(201).json({ user: { id: user.id, email: user.email }, token: issueToken(user.id) });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "23505") {
      res.status(409).json({ message: "Email already registered" });
      return;
    }
    throw error;
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (typeof email !== "string" || typeof password !== "string") {
    res.status(400).json({ message: "Email and password required" });
    return;
  }
  const user = await users.createQueryBuilder("user")
    .addSelect("user.passwordHash")
    .where("user.email = :email", { email: email.trim().toLowerCase() })
    .getOne();
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }
  res.json({ user: { id: user.id, email: user.email }, token: issueToken(user.id) });
});

router.get("/me", requireAuth, async (_req, res) => {
  const user = await users.findOneBy({ id: res.locals.userId as number });
  if (!user) {
    res.status(401).json({ message: "Account no longer exists" });
    return;
  }
  res.json({ id: user.id, email: user.email });
});

export default router;
