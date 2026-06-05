# list-of-good-deeds-react

A full-stack web application for tracking your good deeds. Register an account, manage your personal list of good deeds, add other users as friends by their unique public tag, and view their good deeds.

## Features

- **Authentication** — register, login, update profile, delete account (JWT-based)
- **Good deeds CRUD** — each authorized user manages their own private list of deeds
- **Friends** — add other users by their unique public tag (Telegram-style `@username`) and view their list of good deeds

## Tech Stack

**Backend**
- TypeScript + [NestJS](https://nestjs.com/) 10
- PostgreSQL with [TypeORM](https://typeorm.io/)
- JWT authentication (`@nestjs/jwt`, `passport-jwt`)
- Password hashing with `bcryptjs`
- Request validation with `class-validator`

**Frontend**
- TypeScript + [Next.js](https://nextjs.org/) 14 (App Router)
- [Redux Toolkit](https://redux-toolkit.js.org/) for state management
- [Tailwind CSS](https://tailwindcss.com/) for styling
- Axios HTTP client with a token interceptor

**Infrastructure**
- Docker & Docker Compose (PostgreSQL + backend + frontend)

## Architecture

```
list-of-good-deeds-react/
├── docker-compose.yml          # Orchestrates postgres + backend + frontend
├── .env.example                # Environment variables template
├── backend/                    # NestJS API (port 3001)
│   └── src/
│       ├── main.ts             # Bootstrap: CORS, global validation pipe
│       ├── app.module.ts       # Root module, TypeORM config
│       ├── auth/               # Register, login, JWT strategy & guard, /auth/me
│       ├── users/              # User entity & service (bcrypt hashing)
│       ├── deeds/              # Good deeds CRUD (scoped per user)
│       └── friends/            # Friend relations & viewing friends' deeds
└── frontend/                   # Next.js app (port 3000)
    └── src/
        ├── app/                # Routes: /, /login, /register, /profile, /friends
        ├── components/         # Navbar, Providers, deed forms & list
        ├── store/              # Redux slices: auth, deeds, friends
        ├── lib/axios.ts        # Axios instance with Bearer-token interceptor
        ├── types/              # Shared TypeScript interfaces
        └── middleware.ts       # Route protection based on auth cookie
```

### How it works

- Each user has a unique **email** (for login) and a unique public **tag** (for being found by friends).
- On register/login the backend issues a **JWT** (containing `id`, `email`, `name`, `tag`) which the frontend stores in `localStorage` and a cookie.
- The Axios interceptor attaches the token as a `Bearer` header to every request; Next.js `middleware.ts` guards protected pages using the cookie.
- **Deeds** are private — every deed belongs to a `userId`, and all deed endpoints are scoped to the authenticated user.
- **Friends** are stored as directed `userId → friendId` links. Viewing a friend's deeds is only allowed if the friendship link exists, otherwise the API returns `403`.

## API Endpoints

| Method | Endpoint                  | Description                          | Auth |
|--------|---------------------------|--------------------------------------|------|
| POST   | `/auth/register`          | Create account, returns JWT          | —    |
| POST   | `/auth/login`             | Login, returns JWT                   | —    |
| GET    | `/auth/me`                | Current user profile                 | ✓    |
| PUT    | `/auth/me`                | Update name / password               | ✓    |
| DELETE | `/auth/me`                | Delete account                       | ✓    |
| GET    | `/deeds`                  | List your deeds                      | ✓    |
| POST   | `/deeds`                  | Create a deed                        | ✓    |
| PUT    | `/deeds/:id`              | Update a deed                        | ✓    |
| DELETE | `/deeds/:id`              | Delete a deed                        | ✓    |
| GET    | `/friends`                | List your friends                    | ✓    |
| POST   | `/friends`                | Add a friend by `{ tag }`            | ✓    |
| DELETE | `/friends/:friendId`      | Remove a friend                      | ✓    |
| GET    | `/friends/:friendId/deeds`| View a friend's deeds                | ✓    |

## Getting Started

### Prerequisites
- [Docker](https://www.docker.com/) and Docker Compose

### Run with Docker (recommended)

```bash
# 1. Copy environment variables
cp .env.example .env

# 2. Build and start all services
docker-compose up --build
```

The app will be available at:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **PostgreSQL:** localhost:5432

> **Note:** the database schema is auto-synced by TypeORM (`synchronize: true`).
> If you change an entity, reset the database with `docker-compose down -v` before restarting.

### Environment Variables

| Variable            | Description                | Default                |
|---------------------|----------------------------|------------------------|
| `POSTGRES_USER`     | PostgreSQL user            | `postgres`             |
| `POSTGRES_PASSWORD` | PostgreSQL password        | `postgres`             |
| `POSTGRES_DB`       | PostgreSQL database name   | `good_deeds`           |
| `JWT_SECRET`        | Secret for signing JWTs    | `change_me_in_production` |

## Usage

1. Open http://localhost:3000 and **register** with a name, a unique tag (e.g. `@john_doe`), email, and password.
2. Add good deeds to your personal list and mark them complete.
3. Share your `@tag` (shown on the **Profile** page) with friends.
4. Go to **Friends**, add someone by their tag, and click **View deeds** to see their good deeds.
