# 📋 Task Manager CRUD API

A modern, highly performant, type-safe REST API for managing tasks. Built with **Bun**, **Hono**, **Prisma**, **Kysely**, **Zod**, and **PostgreSQL (Supabase)**.

The project is structured with a modular architecture and provides full OpenAPI-compliant documentation with multiple interactive API reference interfaces.

---

## 🚀 Key Features

- **⚡ Fast Runtime**: Powered by **Bun** for maximum performance and low startup latency.
- **🛡️ Type-Safety & Validation**: 
  - Complete TypeScript coverage.
  - Runtime request/response payload validation via **Zod**.
  - Type-safe SQL query building via **Kysely** combined with **Prisma-generated types**.
- **📝 Automatic OpenAPI Docs**: Auto-generated OpenAPI JSON schemas.
- **🎨 Interactive API Reference Docs**:
  - **Swagger UI** for testing endpoints directly.
  - **Scalar** for a sleek, modern, interactive developer experience.
- **📁 Modular Architecture**: Logically organized folder structure separated by feature modules (e.g. `health`, `tasks`).
- **🌲 Structured Logging**: Integration with **Pino** and **Pino-Pretty** for cleaner logs.

---

## 🛠️ Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Web Framework**: [Hono](https://hono.dev/) with `@hono/zod-openapi`
- **Database ORM/Query Builder**: 
  - [Prisma](https://www.prisma.io/) (for schema definitions and generation)
  - [Kysely](https://kysely.dev/) (for type-safe raw query builder performance)
  - `prisma-kysely` (to generate Kysely types from Prisma schemas)
- **Database**: PostgreSQL (hosted on Supabase)
- **Validation**: [Zod](https://zod.dev/)
- **Documentation**: Swagger UI & Scalar API Reference
- **Logging**: Pino

---

## 📂 Project Structure

```text
task-manager-api/
├── prisma/
│   ├── schema.prisma           # Prisma database schema definition
│   └── migrations/             # SQL database migrations
├── src/
│   ├── app.ts                  # Hono Application setup & global middlewares (CORS, logger, etc.)
│   ├── server.ts               # Entrypoint serving the application
│   ├── routes.ts               # Main route registrar
│   ├── config/                 # Environment validation and logger settings
│   ├── db/                     # Prisma/Kysely generated types and connection setup
│   ├── docs/                   # OpenAPI & Scalar documentation integration
│   ├── middlewares/            # Custom application middlewares
│   └── modules/                # Feature-based business logic (Modular architecture)
│       ├── health/             # Health status checking module
│       └── tasks/              # CRUD task management module
│           ├── tasks.controller.ts  # Route handlers (Request/Response orchestration)
│           ├── tasks.routes.ts      # OpenAPI route configurations
│           ├── tasks.service.ts     # Business logic & Database interaction
│           └── tasks.types.ts       # Zod schemas & TypeScript types
├── .env                        # Local environment secrets
├── package.json                # Project dependencies and run scripts
└── tsconfig.json               # TypeScript compiler options
```

---

## 💾 Database Schema

The database model is defined as follows in `prisma/schema.prisma`:

### `Status` Enum
- `PENDING` (Default)
- `IN_PROGRESS`
- `COMPLETED`

### `Task` Model
| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | `@id`, `@default(cuid())` | Unique identifier (cuid format) |
| `title` | `String` | `VARCHAR(255)` | Task title (required) |
| `description` | `String?` | `TEXT`, optional | Details about the task |
| `status` | `Status` | `@default(PENDING)` | Current status of the task |
| `createdAt` | `DateTime` | `@default(now())` | Creation timestamp |
| `updatedAt` | `DateTime` | `@updatedAt` | Auto-updated modification timestamp |

---

## ⚙️ Environment Variables

Create a `.env` file in the root of the project with the following configuration:

```env
APP_PORT=3300
STAGE=dev # Options: dev, prod, local
DATABASE_URL="your-postgresql-connection-string"
```

---

## 🚀 Setup & Execution

### 1. Install Dependencies
Ensure you have [Bun](https://bun.sh/) installed, then run:
```bash
bun install
```

### 2. Run Database Migrations
Synchronize your database with the Prisma schema:
```bash
bun x prisma db push
```
*(or run standard migration scripts if configured)*

### 3. Start Development Server
Run the local hot-reloading development server:
```bash
bun run dev
```

The server will start, typically on port `3300` (controlled by `APP_PORT`).

---

## 📖 API Documentation & Testing

When running in non-production environments (`STAGE` is not `prod`), the following routes are automatically registered:

- **OpenAPI Schema (JSON)**: `/doc`
- **Swagger UI**: `/swagger` - A classic interactive interface to inspect and execute queries.
- **Scalar API Reference**: `/reference` - A modern, interactive developer portal with deepSpace theme styling to inspect, copy code snippets, and call endpoints.

---

## 🔌 API Endpoints Summary

All routes (except health checks) are prefixed under `/api/tasks`.

### 1. Create a Task
- **Method**: `POST`
- **Path**: `/api/tasks`
- **Body (`application/json`)**:
  ```json
  {
    "title": "Learn Hono & Zod",
    "description": "Read documentation and build a CRUD app",
    "status": "IN_PROGRESS"
  }
  ```
- **Responses**:
  - `201 Created`: Returns the newly created Task object.
  - `409 Conflict`: If a task with the same title already exists.

### 2. Retrieve All Tasks
- **Method**: `GET`
- **Path**: `/api/tasks`
- **Response**:
  ```json
  {
    "tasks": [ ...TaskObjects ],
    "count": 1,
    "hasMore": false
  }
  ```

### 3. Get Task by ID
- **Method**: `GET`
- **Path**: `/api/tasks/{id}`
- **Path Parameter**: `id` (UUID or unique format matching DB identifier)
- **Responses**:
  - `200 OK`: Task details.
  - `404 Not Found`: Task does not exist.

### 4. Update a Task
- **Method**: `PUT`
- **Path**: `/api/tasks/{id}`
- **Body (`application/json`)** *(at least one field required)*:
  ```json
  {
    "title": "Updated Title",
    "description": "Updated Description",
    "status": "COMPLETED"
  }
  ```
- **Responses**:
  - `200 OK`: Returns the updated Task object.
  - `404 Not Found`: Task does not exist.

### 5. Delete a Task
- **Method**: `DELETE`
- **Path**: `/api/tasks/{id}`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Task deleted successfully",
    "deleted": {
      "id": "task-id",
      "title": "task-title"
    }
  }
  ```
- **Responses**:
  - `200 OK`: Task deleted successfully.
  - `404 Not Found`: Task does not exist.
