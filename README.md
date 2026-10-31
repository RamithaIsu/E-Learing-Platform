# LearnSphere - E-Learning Management Platform

LearnSphere is a full-stack **MERN** (MongoDB, Express, React, Node.js) web application for running an e-learning platform. Administrators can manage the **course catalogue**, the **teaching team**, **registered students** and **course enrollments** with complete create, read, update and delete (CRUD) workflows.

> Developed For EE4207 Web Application Development - Mini Project
> **Student:** W.G.R.I.N. Dharmaweera (EG/2023/5560)

![Dashboard](docs/screenshots/01-dashboard.png)

---

## Contents

1. [Features](#features)
2. [Tech stack](#tech-stack)
3. [Project structure](#project-structure)
4. [Getting started](#getting-started)
5. [Database design (ERD)](#database-design-erd)
6. [REST API](#rest-api)
7. [Validation and error handling](#validation-and-error-handling)
8. [Screenshots](#screenshots)
9. [Testing and quality](#testing-and-quality)

---

## Features

| Area               | What the user can do                                                                                                                                                                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Create**         | Add instructors, courses (with a dynamic list of lessons), students and enrollments through structured, validated forms. Forms can be pre-filled from context (for example "Enroll a student" from a course page).                                           |
| **Read**           | Paginated lists for every entity, detail pages with related records, **debounced search**, **filters** (category, level, status, instructor, course) and **sorting**. List state lives in the URL, so refresh and the back button keep the current view.     |
| **Update**         | Edit every record with the same validated forms. An unsaved-changes guard warns before leaving a modified form.                                                                                                                                              |
| **Delete**         | Every delete asks for confirmation and explains its impact. Deleting a course or student also removes their enrollments **inside a database transaction**. Instructors who still teach courses **cannot be deleted** (enforced in the UI and on the server). |
| **Business rules** | Only published courses accept enrollments. A course cannot exceed its seat capacity. A student cannot enroll in the same course twice. A completed enrollment must be at 100% progress. Capacity cannot be reduced below the active enrollments.             |
| **Dashboard**      | Live counts, recent enrollments and quick actions for the most common tasks.                                                                                                                                                                                 |
| **UI/UX**          | Consistent design system, accessible custom dropdowns, loading skeletons, empty and error states, toast notifications and a fully responsive layout (sidebar on desktop, drawer menu on mobile, tables that turn into cards on narrow screens).              |

## Tech stack

| Layer      | Technology                                                                                                                              |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Frontend   | React 19, Vite, React Router 7, TanStack Query, React Hook Form, Tailwind CSS 4, Radix UI (Select, Dialog), Lucide icons, Sonner toasts |
| Backend    | Node.js 22, Express 5, Mongoose 9, Helmet, CORS, express-rate-limit                                                                     |
| Database   | MongoDB Atlas                                                                                                                           |
| Validation | Zod 4 schemas **shared by the client and the server**                                                                                   |
| Testing    | Vitest, Supertest, mongodb-memory-server                                                                                                |
| Tooling    | npm workspaces, ESLint, Prettier                                                                                                        |

## Project structure

The repository is an npm workspace with three packages:

```
E-Learning-Platform/
├── shared/                 # Validation schemas and constants used by BOTH client and server
│   ├── src/constants.js    #   enums (categories, levels, statuses) and field limits
│   ├── src/schemas/        #   zod schemas for instructors, courses, students, enrollments
│   └── test/               #   unit tests for the validation rules
├── server/                 # Express REST API
│   ├── src/app.js          #   app setup: security middleware, routes, error handling
│   ├── src/config/         #   environment validation, database connection, HTTP limits
│   ├── src/lib/            #   reusable CRUD router, list query helpers, HTTP errors
│   ├── src/middleware/     #   request validation, error handler
│   ├── src/modules/        #   one folder per feature: model, service (business rules), routes
│   ├── src/seed/seed.js    #   wipes the database and inserts demo data
│   └── tests/              #   API integration tests
├── client/                 # React single-page application
│   ├── src/components/     #   reusable UI (buttons, fields, dropdowns, tables, dialogs, layout)
│   ├── src/features/       #   pages per feature: dashboard, courses, instructors, students, enrollments
│   ├── src/hooks/          #   list URL state, form handling, unsaved-changes guard
│   ├── src/lib/            #   API client, query hooks, formatting helpers
│   └── src/styles/         #   design tokens (colours, fonts, radii, shadows)
└── docs/                   # ERD and screenshots
```

Each server module follows the same layering: **routes** (HTTP and validation) -> **service** (business rules) -> **model** (Mongoose schema and indexes).

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) **22.9 or newer**
- A MongoDB database (a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster works)

### 1. Clone and install

```bash
git clone https://github.com/RamithaIsu/E-Learing-Platform.git
cd E-Learing-Platform
npm install
```

### 2. Configure the environment

Copy the example file and fill in your own values:

```bash
cp server/.env.example server/.env
```

| Variable        | Description                                           | Example                                                 |
| --------------- | ----------------------------------------------------- | ------------------------------------------------------- |
| `NODE_ENV`      | Runtime mode                                          | `development`                                           |
| `PORT`          | API port                                              | `5000`                                                  |
| `MONGODB_URI`   | MongoDB connection string (include the database name) | `mongodb+srv://user:pass@cluster.mongodb.net/elearning` |
| `CLIENT_ORIGIN` | Allowed browser origin(s) for CORS, comma-separated   | `http://localhost:5173`                                 |

The server validates these variables at startup and stops with a clear message if any are missing or invalid. When using Atlas, allow your IP address under **Network Access**.

### 3. Seed demo data (optional)

```bash
npm run seed
```

This **wipes** the database and inserts 3 instructors, 3 courses, 3 students and 3 enrollments.

### 4. Run the app

```bash
npm run dev
```

- Web app: http://localhost:5173
- API: http://localhost:5000/api

### Available scripts (run from the project root)

| Command          | Description                                                 |
| ---------------- | ----------------------------------------------------------- |
| `npm run dev`    | Start the API and the web app together with live reload     |
| `npm run seed`   | Reset the database with demo data                           |
| `npm test`       | Run the validation unit tests and the API integration tests |
| `npm run lint`   | Lint the whole project with ESLint                          |
| `npm run format` | Format the code with Prettier                               |
| `npm run build`  | Build the production web app into `client/dist`             |
| `npm start`      | Start the API without live reload                           |

## Database design (ERD)

![Entity relationship diagram](docs/erd.png)

The diagram source is in [docs/erd.mmd](docs/erd.mmd) (Mermaid).

### Collections and relationships

| Relationship         | Type                      | How it is stored                                                                                                |
| -------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Instructor -> Course | One-to-many               | `course.instructor` references `instructors._id`                                                                |
| Course -> Lesson     | One-to-many (composition) | Lessons are **embedded** in the course document because they are always read with their course and never shared |
| Student <-> Course   | Many-to-many              | Resolved by the **Enrollment** collection, which holds its own data (status, progress, enrolment date)          |

### Keys, constraints and indexes

- **Primary keys:** MongoDB `ObjectId` (`_id`) on every collection.
- **Unique keys:** `instructors.email`, `students.email`, `courses.code`, and a **compound unique index** on `enrollments (student, course)` so a student can enroll in a course only once.
- **Foreign keys:** `course.instructor`, `enrollment.student` and `enrollment.course` are `ObjectId` references; the API checks that referenced documents exist.
- **Data types:** prices, capacity, progress and lesson durations are validated **integers** (money is stored in whole rupees, never as floating point); dates are stored as `Date` in UTC; categories, levels and statuses are **enums**.
- **Indexes** on every field used to filter, sort or join: instructor, category/level/status, title, price, creation date and enrolment date.
- **Timestamps:** every document has `createdAt` and `updatedAt`.

### Delete rules (referential integrity)

| Deleting   | Effect                                                   |
| ---------- | -------------------------------------------------------- |
| Instructor | **Restricted** while they still teach courses (HTTP 409) |
| Course     | **Cascades** to its enrollments, in a transaction        |
| Student    | **Cascades** to their enrollments, in a transaction      |
| Enrollment | Removes only that enrollment and frees its seat          |

## REST API

Base URL: `/api`. All request and response bodies are JSON.

| Method             | Endpoint           | Description                                                                                            |
| ------------------ | ------------------ | ------------------------------------------------------------------------------------------------------ |
| GET                | `/health`          | Health check                                                                                           |
| GET                | `/stats`           | Dashboard counts and recent enrollments                                                                |
| GET                | `/courses`         | List courses (`search`, `category`, `level`, `status`, `instructor`, `sort`, `order`, `page`, `limit`) |
| GET                | `/courses/:id`     | Course details with instructor and seat counts                                                         |
| POST               | `/courses`         | Create a course                                                                                        |
| PUT                | `/courses/:id`     | Update a course                                                                                        |
| DELETE             | `/courses/:id`     | Delete a course and its enrollments                                                                    |
| GET / POST         | `/instructors`     | List (`search`, `sort`, `order`, `page`, `limit`) or create instructors                                |
| GET / PUT / DELETE | `/instructors/:id` | Read, update or delete an instructor                                                                   |
| GET / POST         | `/students`        | List (`search`, `sort`, `order`, `page`, `limit`) or create students                                   |
| GET / PUT / DELETE | `/students/:id`    | Read, update or delete a student                                                                       |
| GET / POST         | `/enrollments`     | List (`search`, `status`, `course`, `student`, `sort`, `order`, `page`, `limit`) or create enrollments |
| GET / PUT / DELETE | `/enrollments/:id` | Read, update (status and progress) or delete an enrollment                                             |

**List response**

```json
{
  "data": [{ "_id": "...", "title": "Modern Web Development with MERN" }],
  "meta": { "page": 1, "limit": 10, "total": 3, "totalPages": 1 }
}
```

**Error response**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please correct the highlighted fields",
    "details": [
      { "path": "email", "message": "Enter a valid email address, e.g. name@example.com" }
    ],
    "requestId": "6f1c..."
  }
}
```

| Status | Code                                               | When                                                     |
| ------ | -------------------------------------------------- | -------------------------------------------------------- |
| 400    | `VALIDATION_ERROR`, `INVALID_ID`, `MALFORMED_JSON` | Invalid input, id or JSON                                |
| 404    | `NOT_FOUND`, `ROUTE_NOT_FOUND`                     | Record or route does not exist                           |
| 409    | `DUPLICATE`, `CONFLICT`                            | Unique value already used, or a restricted delete        |
| 413    | `PAYLOAD_TOO_LARGE`                                | Request body over 100 KB                                 |
| 422    | `BUSINESS_RULE`                                    | For example: course full, course not published           |
| 429    | `RATE_LIMITED`                                     | Too many requests                                        |
| 500    | `INTERNAL_ERROR`                                   | Unexpected error (details are logged on the server only) |

## Validation and error handling

- **One schema, two sides.** The zod schemas in `shared/` validate forms in the browser (instant feedback) **and** every request on the server (the authority). Limits such as name length or capacity live in one place (`shared/src/constants.js`).
- **Three layers of defence:** client validation for user experience, server validation for security, and database constraints (required fields, enums, min/max, unique indexes) as the last line.
- **Every field** defines whether it is required, its type, normalisation (trimming, lower-case emails, upper-case course codes), length or range limits, and its format (Sri Lankan mobile numbers, `WEB101`-style codes, real calendar dates, student age 13-100).
- **Cross-field rules:** a completed enrollment must have 100% progress.
- **Unknown fields and query parameters are rejected**, list page size is capped, and search text is escaped so it can never act as a regular expression.
- **Friendly messages:** server errors are mapped back onto the matching form field (for example "This course code is already in use"), and every page has loading, empty and error states.
- **Security:** Helmet security headers, CORS allow-list from the environment, rate limiting, request body size limit, and safe error responses with a request id for tracing.

## Screenshots

### Desktop

|                                                                                                |                                                                                         |
| ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| ![Courses list](docs/screenshots/02-courses-list.png) **Course catalogue**                     | ![Search and filter](docs/screenshots/03-courses-search-filter.png) **Filter and sort** |
| ![Course detail](docs/screenshots/04-course-detail.png) **Course details**                     | ![Form validation](docs/screenshots/05-course-form-validation.png) **Form validation**  |
| ![Dropdown](docs/screenshots/06-course-form-dropdown.png) **Edit course with styled dropdown** | ![Instructors](docs/screenshots/07-instructors-list.png) **Instructors**                |
| ![Instructor detail](docs/screenshots/08-instructor-detail.png) **Instructor profile**         | ![Students](docs/screenshots/09-students-list.png) **Students**                         |
| ![Student detail](docs/screenshots/10-student-detail.png) **Student profile**                  | ![Enrollments](docs/screenshots/11-enrollments-list.png) **Enrollments**                |
| ![Enrollment form](docs/screenshots/12-enrollment-form.png) **Enroll a student**               | ![Delete confirmation](docs/screenshots/13-delete-confirmation.png) **Safe delete**     |
| ![Delete blocked](docs/screenshots/14-delete-blocked.png) **Restricted delete**                |                                                                                         |

### Mobile

|                                                               |                                                           |                                                                 |                                                                   |
| ------------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------- |
| ![Mobile dashboard](docs/screenshots/15-mobile-dashboard.png) | ![Mobile courses](docs/screenshots/16-mobile-courses.png) | ![Mobile navigation](docs/screenshots/17-mobile-navigation.png) | ![Mobile enrollments](docs/screenshots/18-mobile-enrollments.png) |

## Testing and quality

```bash
npm test        # validation unit tests + API integration tests
npm run lint    # ESLint, zero warnings
npm run build   # production build
```

- **Unit tests** (`shared/test`) cover every validation rule: normalisation, formats, ranges, age calculation and cross-field rules.
- **Integration tests** (`server/tests`) run the real Express app against an in-memory MongoDB replica set and cover full CRUD for every resource, search, filters, sorting, pagination, duplicate keys, business rules, cascade and restricted deletes, malformed input and unknown routes.
- **Version control:** feature branches (`feat/...`, `docs/...`) merged into `main`, with [Conventional Commit](https://www.conventionalcommits.org/) messages.
