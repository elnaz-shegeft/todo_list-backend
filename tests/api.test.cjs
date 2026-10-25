const { test } = require("node:test");
const assert = require("node:assert/strict");
const express = require("express");

process.env.JWT_SECRET = "integration-test-secret-32-characters-long";
const { AppDataSource } = require("../dist/data-source");
const authRouter = require("../dist/routes/auth").default;
const tasksRouter = require("../dist/routes/tasks").default;
const { User } = require("../dist/entities/user");
const { Task } = require("../dist/entities/task");

test("auth, owner isolation, CRUD, filters and pagination", async () => {
  await AppDataSource.initialize();
  const app = express();
  app.use(express.json());
  app.use("/auth", authRouter);
  app.use("/tasks", tasksRouter);
  const server = await new Promise(resolve => {
    const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
  });
  const base = "http://127.0.0.1:" + server.address().port;
  const userIds = [];
  async function request(method, path, token, body) {
    const response = await fetch(base + path, {
      method,
      headers: {
        ...(token ? { Authorization: "Bearer " + token } : {}),
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    return { status: response.status, body: response.status === 204 ? null : await response.json() };
  }
  try {
    const suffix = Date.now() + "-" + Math.random().toString(36).slice(2);
    const first = await request("POST", "/auth/register", null, { email: "first-" + suffix + "@example.test", password: "secure-password-1" });
    const second = await request("POST", "/auth/register", null, { email: "second-" + suffix + "@example.test", password: "secure-password-2" });
    assert.equal(first.status, 201);
    assert.equal(second.status, 201);
    userIds.push(first.body.user.id, second.body.user.id);
    const tokenA = first.body.token, tokenB = second.body.token;
    assert.equal((await request("GET", "/tasks")).status, 401);
    assert.equal((await request("GET", "/tasks", "invalid-token")).status, 401);
    assert.equal((await request("POST", "/auth/register", null, { email: first.body.user.email, password: "secure-password-1" })).status, 409);
    assert.equal((await request("POST", "/auth/login", null, { email: first.body.user.email, password: "wrong-password" })).status, 401);
    assert.equal((await request("POST", "/auth/login", null, { email: first.body.user.email, password: "secure-password-1" })).status, 200);
    const one = await request("POST", "/tasks", tokenA, { title: "Alpha", label: "work", completed: true, dueDate: "2026-10-25" });
    const two = await request("POST", "/tasks", tokenA, { title: "Beta", label: "work", important: true, dueDate: "2026-10-26" });
    assert.equal(one.status, 201);
    assert.equal(two.status, 201);
    assert.equal((await request("GET", "/tasks/" + one.body.id, tokenB)).status, 404);
    assert.equal((await request("PATCH", "/tasks/" + one.body.id, tokenB, { title: "stolen" })).status, 404);
    assert.equal((await request("DELETE", "/tasks/" + one.body.id, tokenB)).status, 404);
    assert.equal((await request("GET", "/tasks", tokenB)).body.pagination.total, 0);
    const page = await request("GET", "/tasks?label=work&page=1&limit=1", tokenA);
    assert.equal(page.status, 200);
    assert.deepEqual(page.body.pagination, { page: 1, limit: 1, total: 2, totalPages: 2 });
    assert.equal(page.body.data[0].id, two.body.id);
    assert.equal((await request("GET", "/tasks?page=2&limit=1", tokenA)).body.data[0].id, one.body.id);
    assert.equal((await request("GET", "/tasks/work?limit=1", tokenA)).body.pagination.total, 2);
    const filtered = await request("GET", "/tasks?completed=true&search=alp&dueFrom=2026-10-25&dueTo=2026-10-25", tokenA);
    assert.deepEqual(filtered.body.data.map(task => task.id), [one.body.id]);
    assert.equal((await request("GET", "/tasks?page=0", tokenA)).status, 400);
    assert.equal((await request("PATCH", "/tasks/" + two.body.id, tokenA, { completed: true })).body.completed, true);
    assert.equal((await request("DELETE", "/tasks/" + one.body.id, tokenA)).status, 204);
    assert.equal((await request("GET", "/tasks/" + one.body.id, tokenA)).status, 404);
  } finally {
    if (userIds.length) {
      await AppDataSource.getRepository(Task).delete(userIds.map(ownerId => ({ ownerId })));
      await AppDataSource.getRepository(User).delete(userIds);
    }
    await new Promise(resolve => server.close(resolve));
    await AppDataSource.destroy();
  }
});
