# RB Hub Technologies — Clients Monitoring System

A web-based client management system built to replace the company's legacy
client-tracking setup. Staff can view, search, filter, add, edit, and delete
client records through a single dashboard.

> Status: In development 🚧 — built as a learning project.

---

## Tech Stack (PERN)

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Database   | PostgreSQL                          |
| Backend    | Express (Node.js)                   |
| Frontend   | React + Vite                        |
| UI         | shadcn/ui + Tailwind CSS            |
| Forms      | react-hook-form + zod               |
| DB driver  | node-postgres (`pg`)                |

---

## Features

- View all clients in a searchable table
- Filter clients by category
- Add a new client
- Edit an existing client
- Delete a client (with confirmation)

> Note: Authentication / login is **not** included yet — planned for a later phase.

---

## Data Model

The `clients` table (adjust as you go):

| Column          | Type          | Notes                    |
| --------------- | ------------- | ------------------------ |
| id              | SERIAL        | Primary key              |
| category        | VARCHAR       | e.g. "Agriculture & Energy" |
| company_name    | VARCHAR       |                          |
| client_name     | VARCHAR       |                          |
| contact_number  | VARCHAR       | stored as text, not int  |
| email           | VARCHAR       |                          |
| position        | VARCHAR       |                          |
| created_at      | TIMESTAMP     | default now()            |

---

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [PostgreSQL](https://www.postgresql.org/download/)
- npm (comes with Node)

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

### 2. Set up the database

Create a database in PostgreSQL (via pgAdmin or the `psql` shell):

```sql
CREATE DATABASE rbhub_clients;
```

Then run your table-creation SQL (see Data Model above).

### 3. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file in `/server`:

```
PORT=5000
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/rbhub_clients
```

Start the backend:

```bash
npm run dev
```

### 4. Set up the frontend

```bash
cd client
npm install
npm run dev
```

The app should now be running at `http://localhost:5173` (frontend)
talking to `http://localhost:5000` (backend).

---

## Project Structure

```
.
├── server/          # Express + Postgres backend
│   ├── index.js     # entry point
│   ├── db.js        # database connection
│   └── routes/      # API routes
└── client/          # React + shadcn frontend
    ├── src/
    │   ├── components/
    │   └── App.jsx
    └── ...
```

> Update this once your actual structure takes shape.

---

## API Endpoints

| Method | Endpoint         | Description           |
| ------ | ---------------- | --------------------- |
| GET    | `/clients`       | Get all clients       |
| GET    | `/clients/:id`   | Get one client        |
| POST   | `/clients`       | Add a new client      |
| PUT    | `/clients/:id`   | Update a client       |
| DELETE | `/clients/:id`   | Delete a client       |

---

## Roadmap

- [ ] Core CRUD (view / add / edit / delete)
- [ ] Search + category filter
- [ ] Form validation
- [ ] Toast notifications
- [ ] Authentication / login (future)
- [ ] Deployment

---

## Author

Built by <your-name> for RB Hub Technologies Inc.