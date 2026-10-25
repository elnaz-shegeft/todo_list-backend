"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const task_1 = require("./entities/task");
const user_1 = require("./entities/user");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USER ?? "postgres",
    password: process.env.DB_PASSWORD ?? "123456",
    database: process.env.DB_NAME ?? "todo",
    entities: [task_1.Task, user_1.User],
    synchronize: true,
});
//# sourceMappingURL=data-source.js.map