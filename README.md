# FitAI X

> **Enterprise AI-Powered Adaptive Fitness Intelligence Platform**

FitAI X is a production-grade, full-stack fitness intelligence platform built with a microservices-ready architecture. It leverages AI to deliver adaptive workout planning, progressive overload management, real-time coaching, and deep analytics.

---

## Project Structure

```
ai-fitness/
├── frontend/     # React + Vite + Tailwind + Shadcn/UI
└── backend/      # Node.js + Express + TypeScript + Prisma + PostgreSQL
```

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React (Latest) | UI Framework |
| Vite | Build Tool |
| React Router DOM | Client-side Routing |
| Tailwind CSS | Utility-first Styling |
| Shadcn/UI | Component Library |
| TanStack React Query | Server State Management |
| Zustand | Client State Management |
| React Hook Form | Form Management |
| Zod | Schema Validation |
| Framer Motion | Animations |
| Axios | HTTP Client |

### Backend
| Technology | Purpose |
|---|---|
| Node.js (LTS) | Runtime |
| Express.js | Web Framework |
| TypeScript | Type Safety |
| PostgreSQL | Primary Database |
| Prisma ORM | Database Toolkit |
| Redis | Caching & Pub/Sub |
| BullMQ | Job Queue |
| Socket.IO | Real-time Communication |
| Winston | Logging |
| JWT | Authentication Tokens |

---

## Getting Started

### Prerequisites

- Node.js `>= 20.x` (LTS)
- npm `>= 10.x`
- PostgreSQL `>= 15.x`
- Redis `>= 7.x`

---

### Installation

#### 1. Clone the repository

```bash
git clone <repository-url>
cd ai-fitness
```

#### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

#### 3. Backend

```bash
cd backend
npm install
cp .env.example .env
# Configure your DATABASE_URL and other env vars in .env
npx prisma generate
npm run dev
```

---

## Development Scripts

### Frontend (`frontend/`)

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier |

### Backend (`backend/`)

| Command | Description |
|---|---|
| `npm run dev` | Start dev server (nodemon) |
| `npm run build` | Compile TypeScript |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:studio` | Open Prisma Studio |
| `npm run prisma:seed` | Seed the database |

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the required values.

### Backend Required Variables

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/fitaix_db?schema=public"
JWT_SECRET="your-super-secret-key"
REDIS_URL="redis://localhost:6379"
```

---

## Architecture

FitAI X follows:

- **Microservices-Ready Architecture** — modular, independently scalable feature modules
- **Clean Architecture** — clear separation of concerns across layers
- **Feature-Based Organization** — each feature is self-contained
- **SOLID Principles** — maintainable, extensible codebase
- **Repository Pattern** — data access abstraction
- **Event-Driven Ready** — BullMQ queue and Socket.IO pre-configured
- **AI-Ready** — dedicated AI module scaffold

---

## Phase Status

| Phase | Status | Description |
|---|---|---|
| Phase 1 | ✅ Complete | Project setup & architecture |
| Phase 2 | 🔜 Upcoming | Authentication & user management |
| Phase 3 | 🔜 Upcoming | Workout & exercise modules |
| Phase 4 | 🔜 Upcoming | AI coach & progressive overload engine |
| Phase 5 | 🔜 Upcoming | Analytics & social features |

---

## License

FitAI X
