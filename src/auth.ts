import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "./data-source";
import { User } from "./entities/user";

const secret = process.env.JWT_SECRET;
if (!secret || secret.length < 32) {
  throw new Error("JWT_SECRET must be set to a random value of at least 32 characters");
}

export function issueToken(userId: number): string {
  return jwt.sign({}, secret!, { subject: String(userId), expiresIn: "1d" });
}

export const requireAuth: RequestHandler = async (req, res, next) => {
  const match = /^Bearer (\S+)$/i.exec(req.get("authorization") ?? "");
  if (!match) {
    res.status(401).json({ message: "Bearer token required" });
    return;
  }
  let userId: number;
  try {
    const payload = jwt.verify(match[1]!, secret!, { algorithms: ["HS256"] });
    if (typeof payload === "string" || !/^[1-9]\d*$/.test(payload.sub ?? "")) {
      throw new Error("Invalid subject");
    }
    userId = Number(payload.sub);
    if (!Number.isSafeInteger(userId)) throw new Error("Invalid subject");
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }
  if (!(await AppDataSource.getRepository(User).existsBy({ id: userId }))) {
    res.status(401).json({ message: "Account no longer exists" });
    return;
  }
  res.locals.userId = userId;
  next();
};
