import "reflect-metadata";
import { DataSource } from "typeorm";
import { Task } from "./entities/task";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "el",
  password: "jooje_toosi",
  database: "todo_list",
  entities: [Task],
  synchronize: true,
});
AppDataSource.initialize()
  .then(() => {
    console.log("TypeORM connected");
  })
  .catch((error) => {
    console.error("TypeORM connection failed:", error);
  });