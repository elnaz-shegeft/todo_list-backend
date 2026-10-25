# Todo List API

Express 5, TypeScript, TypeORM, and PostgreSQL. Each account has private tasks.

## Run

```sh
npm install
export JWT_SECRET="$(openssl rand -hex 32)"
# Set DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, and DB_NAME if they differ
# from the local development defaults in src/data-source.ts.
npm run dev
```

The API listens on port 3000. Interactive documentation is at `/api-docs` and
the OpenAPI document is at `/api-json`. `JWT_SECRET` is required and must be
at least 32 characters. Use the same secret across restarts if existing tokens
should remain valid.

## API endpoints

All paths below are relative to `http://localhost:3000`. Send JSON request
bodies with `Content-Type: application/json`. Every `/tasks` endpoint and
`GET /auth/me` requires `Authorization: Bearer <token>`.

| Method | Path | Purpose | Success |
| --- | --- | --- | --- |
| GET | `/` | Health check | 200 |
| POST | `/auth/register` | Create an account and issue a token | 201 |
| POST | `/auth/login` | Log in and issue a token | 200 |
| GET | `/auth/me` | Read the signed-in account | 200 |
| POST | `/tasks` | Create a task | 201 |
| GET | `/tasks` | List, filter, and paginate your tasks | 200 |
| GET | `/tasks/:id` | Read one of your tasks | 200 |
| PATCH | `/tasks/:id` | Update fields on one of your tasks | 200 |
| DELETE | `/tasks/:id` | Delete one of your tasks; empty body | 204 |
| GET | `/tasks/labels` | List suggested labels | 200 |
| GET | `/tasks/today` | List incomplete tasks due today | 200 |
| GET | `/tasks/upcoming` | List incomplete future tasks | 200 |
| GET | `/tasks/overdue` | List incomplete overdue tasks | 200 |
| GET | `/tasks/completed` | List completed tasks | 200 |
| GET | `/tasks/important` | List important tasks | 200 |
| GET | `/tasks/work`, `/tasks/study`, `/tasks/personal`, `/tasks/health`, `/tasks/others` | List tasks with that label | 200 |
| GET | `/api-docs` | Interactive Swagger UI | 200 |
| GET | `/api-json` | OpenAPI JSON document | 200 |

### Authentication

Registration and login accept an `email` and `password`:

```json
{"email":"you@example.com","password":"at-least-8-bytes"}
```

Passwords must be 8–72 UTF-8 bytes. Registration normalizes email to lowercase
and returns 409 if it is already registered. A successful registration or login
returns `{"user":{"id":1,"email":"you@example.com"},"token":"..."}`.
Tokens expire after one day. `GET /auth/me` returns the `user` object.

### Task body and response

`POST /tasks` requires a nonempty `title` of at most 255 characters.
`PATCH /tasks/:id` accepts any nonempty subset of the same fields:

| Field | Type | Notes |
| --- | --- | --- |
| `title` | string | Required on create |
| `dueDate` | date string or null | `YYYY-MM-DD` |
| `completed` | boolean | Defaults to `false` |
| `important` | boolean | Defaults to `false` |
| `difficulty` | string or null | At most 100 characters |
| `label` | string or null | At most 100 characters |

A task response includes these fields plus `id` and `ownerId`. Another
account's task ID returns 404 for read, update, and delete.

### List filters and pagination

`GET /tasks` accepts these optional query parameters. Combine them as needed:

| Parameter | Meaning |
| --- | --- |
| `completed` | Exact boolean: `true` or `false` |
| `important` | Exact boolean: `true` or `false` |
| `label` | Exact label match |
| `difficulty` | Exact difficulty match |
| `search` | Case-insensitive substring in the title |
| `dueFrom` | Due on or after this `YYYY-MM-DD` date |
| `dueTo` | Due on or before this `YYYY-MM-DD` date |
| `page` | Positive integer; default `1` |
| `limit` | Positive integer from `1` to `100`; default `20` |

Example: `GET /tasks?completed=false&label=work&search=report&page=2&limit=10`.
Results are ordered by descending task ID. All task list routes use this shape:

```json
{
  "data": [],
  "pagination": { "page": 2, "limit": 10, "total": 0, "totalPages": 0 }
}
```

The shortcut routes apply their named condition and accept the remaining
filters and pagination parameters. If a query parameter conflicts with a
shortcut's condition, the shortcut condition takes precedence. For example,
`/tasks/completed?completed=false` still returns completed tasks.

Invalid IDs, bodies, filters, or pagination return 400. Missing or invalid
tokens return 401. Missing tasks and tasks owned by another account return
404. Errors have the form `{"message":"..."}`.

Tasks created before account ownership was added have no owner and are not
visible through the API. Assign their `ownerId` deliberately in the database
if they should belong to a particular account. TypeORM `synchronize` is
enabled for this sample project; use migrations before deploying with
persistent production data.

Run `npm test` with local PostgreSQL available to exercise the API.
