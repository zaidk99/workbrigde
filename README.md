# WorkBridge

A role-based portal for a software company to manage clients, service requests, projects, files, and messaging — all from one place.

Three types of users work inside the same system:

- **Admin** — manages users, approves service requests, assigns employees to projects
- **Employee** — works on assigned projects, updates status, talks to clients
- **Client** — submits service requests, tracks projects, uploads files, messages the team

The **backend is built and working**. The **frontend is in progress** — login UI and auth flow are being wired up right now.

---

## Tech stack

| Layer | Tools |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS, React Router |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL |
| Auth | JWT (Bearer token) |
| File storage | AWS S3 (presigned URLs) |

---

## What the backend can do

- **Auth** — login with email + password, JWT issued on success
- **Users** — admin can register, list, deactivate, and delete users
- **Service requests** — clients create requests; admin accepts or rejects (accepting auto-creates a project)
- **Projects** — role-based access, employee assignment, workload view, status updates
- **Project files** — upload to S3, view via presigned URLs, admin can delete
- **Messages** — role-aware messaging (who can message whom depends on project and role)

Base API path: `/api`

Health check: `GET /health`

---

## Project structure

```
workbrigde/
├── backend/          # Express API (ready)
│   ├── src/
│   │   ├── modules/  # auth, user, serviceRequests, projects, messages
│   │   ├── middleware/
│   │   └── config/
│   └── schema.sql    # PostgreSQL schema
│
└── frontend/         # React app (in progress)
    └── src/
        ├── features/auth/   # login page, api, context
        ├── api/             # fetch client (base URL + requests)
        ├── routes/          # routing + protected routes
        └── types/
```

---

## Getting started

You need **Node.js**, **PostgreSQL**, and (for file uploads) an **AWS S3 bucket**.

### 1. Database

Create a PostgreSQL database, then run the schema:

```bash
psql -d your_database_name -f backend/schema.sql
```

### 2. Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/your_database
JWT_SECRET=your_secret_key_here

# Optional — needed for project file uploads
AWS_REGION=your_region
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_BUCKET_NAME=your_bucket
```

Start the server:

```bash
npm run dev
```

Server runs on **http://localhost:3000** by default.

Quick check: open **http://localhost:3000/health** — you should see `{ "message": "Server Running" }`.

### 3. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Start the dev server:

```bash
npm run dev
```

Frontend runs on **http://localhost:5173** by default.

---

## Login flow (what we are building on the frontend)

1. User enters email and password on the login page
2. Frontend sends `POST /api/auth/login`
3. Backend returns `{ token, user: { id, name, role } }`
4. Frontend saves the token, routes the user to the right dashboard by role

**Current frontend status:**

- Login page UI (responsive layout, password show/hide)
- Auth types and API layer started
- Dashboards, auth context, and protected routes — next up

---

## API overview

| Route prefix | Purpose |
|---|---|
| `/api/auth` | Login |
| `/api/user` | User management (admin) |
| `/api/serviceRequests` | Client requests, admin approve/reject |
| `/api/projects` | Projects, assignments, files, status |
| `/api/messages` | Messaging between allowed users |

Protected routes need the header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Roles at a glance

| Role | Can do (high level) |
|---|---|
| Admin | Everything — users, requests, projects, files, messages |
| Employee | Assigned projects, status updates, messaging within rules |
| Client | Own requests and projects, file uploads, messaging within rules |

---

## Repo

**GitHub:** [github.com/zaidk99/workbrigde](https://github.com/zaidk99/workbrigde)

---

## Author

**Zaid Khan**

---

## License

ISC
