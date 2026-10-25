"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerDocument = void 0;
const task = {
    type: "object",
    properties: {
        id: { type: "integer" }, ownerId: { type: "integer" },
        title: { type: "string" }, dueDate: { type: "string", format: "date", nullable: true },
        completed: { type: "boolean" }, important: { type: "boolean" },
        difficulty: { type: "string", nullable: true }, label: { type: "string", nullable: true },
    },
};
const taskInput = {
    type: "object",
    required: ["title"],
    properties: {
        title: { type: "string", example: "Buy groceries" },
        dueDate: { type: "string", format: "date", nullable: true },
        completed: { type: "boolean" }, important: { type: "boolean" },
        difficulty: { type: "string", nullable: true }, label: { type: "string", nullable: true },
    },
};
const taskResponse = { description: "Task", content: { "application/json": { schema: { $ref: "#/components/schemas/Task" } } } };
const errorResponse = { description: "Error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } };
const auth = [{ bearerAuth: [] }];
const id = { name: "id", in: "path", required: true, schema: { type: "integer", minimum: 1 } };
const body = (schema) => ({ required: true, content: { "application/json": { schema } } });
const listResponse = {
    description: "Owner's tasks, newest ID first",
    content: { "application/json": { schema: { $ref: "#/components/schemas/TaskPage" } } },
};
const listParameters = [
    { name: "page", in: "query", description: "Page number, starting at 1", schema: { type: "integer", minimum: 1, default: 1 } },
    { name: "limit", in: "query", description: "Tasks per page", schema: { type: "integer", minimum: 1, maximum: 100, default: 20 } },
    ...["completed", "important"].map(name => ({ name, in: "query", description: "Exact true or false value", schema: { type: "boolean" } })),
    { name: "label", in: "query", description: "Exact label match", schema: { type: "string", maxLength: 100 } },
    { name: "difficulty", in: "query", description: "Exact difficulty match", schema: { type: "string", maxLength: 100 } },
    { name: "search", in: "query", description: "Case-insensitive title substring", schema: { type: "string", maxLength: 100 } },
    ...["dueFrom", "dueTo"].map(name => ({ name, in: "query", description: name === "dueFrom" ? "Inclusive lower due-date bound" : "Inclusive upper due-date bound", schema: { type: "string", format: "date" } })),
];
const listOperation = (summary, preset = "") => ({
    tags: ["Tasks"], summary, security: auth, parameters: listParameters,
    description: "Returns only the authenticated user's tasks, ordered by descending task ID. " +
        (preset ? preset + " This condition takes precedence over a conflicting query parameter. " : "") +
        "Example: /tasks?completed=false&label=work&page=2&limit=10.",
    responses: { "200": listResponse, "400": errorResponse, "401": errorResponse },
});
exports.swaggerDocument = {
    openapi: "3.0.3",
    info: { title: "Todo List API", version: "2.0.0", description: "Register or log in, then send the token as Authorization: Bearer <token>. Tasks are private to each account. Existing tasks without an owner are inaccessible." },
    servers: [{ url: "http://localhost:3000" }],
    tags: [{ name: "Auth" }, { name: "Tasks" }],
    components: {
        securitySchemes: { bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" } },
        schemas: {
            Task: task,
            TaskInput: taskInput,
            TaskUpdate: { type: "object", minProperties: 1, properties: taskInput.properties },
            TaskPage: { type: "object", properties: {
                    data: { type: "array", items: { $ref: "#/components/schemas/Task" } },
                    pagination: { type: "object", properties: {
                            page: { type: "integer" }, limit: { type: "integer" },
                            total: { type: "integer" }, totalPages: { type: "integer" },
                        } },
                } },
            Credentials: { type: "object", required: ["email", "password"], properties: {
                    email: { type: "string", format: "email" }, password: { type: "string", format: "password", minLength: 8, maxLength: 72 },
                } },
            AuthResult: { type: "object", properties: {
                    user: { type: "object", properties: { id: { type: "integer" }, email: { type: "string" } } },
                    token: { type: "string", description: "Expires after one day" },
                } },
            Error: { type: "object", properties: { message: { type: "string" } } },
        },
    },
    paths: {
        "/": { get: { summary: "Health check", responses: { "200": { description: "API is running" } } } },
        "/auth/register": { post: { tags: ["Auth"], summary: "Create account", requestBody: body({ $ref: "#/components/schemas/Credentials" }), responses: {
                    "201": { description: "Account and token", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResult" } } } },
                    "400": errorResponse, "409": errorResponse,
                } } },
        "/auth/login": { post: { tags: ["Auth"], summary: "Log in", requestBody: body({ $ref: "#/components/schemas/Credentials" }), responses: {
                    "200": { description: "Account and token", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResult" } } } },
                    "400": errorResponse, "401": errorResponse,
                } } },
        "/auth/me": { get: { tags: ["Auth"], summary: "Current account", security: auth, responses: { "200": { description: "Current account" }, "401": errorResponse } } },
        "/tasks": {
            get: listOperation("List and filter my tasks"),
            post: { tags: ["Tasks"], summary: "Create my task", security: auth, requestBody: body({ $ref: "#/components/schemas/TaskInput" }), responses: {
                    "201": taskResponse, "400": errorResponse, "401": errorResponse,
                } },
        },
        "/tasks/{id}": {
            get: { tags: ["Tasks"], summary: "Get my task", security: auth, parameters: [id], responses: { "200": taskResponse, "400": errorResponse, "401": errorResponse, "404": errorResponse } },
            patch: { tags: ["Tasks"], summary: "Update fields on my task", security: auth, parameters: [id], requestBody: body({ $ref: "#/components/schemas/TaskUpdate" }), responses: { "200": taskResponse, "400": errorResponse, "401": errorResponse, "404": errorResponse } },
            delete: { tags: ["Tasks"], summary: "Delete my task", security: auth, parameters: [id], responses: { "204": { description: "Deleted" }, "400": errorResponse, "401": errorResponse, "404": errorResponse } },
        },
        "/tasks/labels": { get: { tags: ["Tasks"], summary: "Available labels", security: auth, responses: { "200": { description: "Label names" }, "401": errorResponse } } },
        "/tasks/today": { get: listOperation("Incomplete tasks due today", "Applies completed=false and dueDate=CURRENT_DATE.") },
        "/tasks/upcoming": { get: listOperation("Incomplete future tasks", "Applies completed=false and dueDate>CURRENT_DATE.") },
        "/tasks/overdue": { get: listOperation("Incomplete overdue tasks", "Applies completed=false and dueDate<CURRENT_DATE.") },
        "/tasks/completed": { get: listOperation("Completed tasks", "Applies completed=true.") },
        "/tasks/important": { get: listOperation("Important tasks", "Applies important=true.") },
        ...Object.fromEntries(["work", "study", "personal", "health", "others"].map(label => [
            "/tasks/" + label, { get: listOperation("Tasks labeled " + label, "Applies label=" + label + ".") },
        ])),
    },
};
//# sourceMappingURL=swagger.js.map