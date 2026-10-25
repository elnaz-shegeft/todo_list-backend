import "reflect-metadata";
import { DataSource } from "typeorm";
import { Task } from "./entities/task";
import { User } from "./entities/user";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER ?? "postgres",
  password: process.env.DB_PASSWORD ?? "123456",
  database: process.env.DB_NAME ?? "todo",
  entities: [Task, User],
  synchronize: true,
});
