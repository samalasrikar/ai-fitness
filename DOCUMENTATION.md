# FitAI X – Architecture & Platform Technical Documentation

> **Platform:** FitAI X – AI-Powered Adaptive Fitness Intelligence Platform  
> **Phase:** Phase 1 (Project Initialization & Architecture Setup)  
> **Status:** Production-Ready Architecture Foundation  

---

## 1. Executive Summary & System Overview

**FitAI X** is an enterprise-grade, microservices-ready adaptive fitness intelligence platform. Designed to scale from single-tenant deployments to high-throughput multi-region enterprise environments, the platform leverages AI to deliver real-time adaptive workout planning, dynamic progressive overload adjustments, automated nutrition intelligence, and deep biometrics analytics.

**Phase 1 Objective:** Establish a clean, modular, scalable boilerplate foundation with zero business logic and zero feature code, ensuring strict layer separation, configuration isolation, and feature module boundaries.

---

## 2. Architectural Principles & Design Patterns

The system strictly adheres to enterprise solution design standards:

```
                      ┌───────────────────────────────────────┐
                      │            Frontend App               │
                      │  React + Vite + Tailwind + Shadcn/UI  │
                      └──────────────────┬────────────────────┘
                                         │  HTTPS / REST / WSS
                                         ▼
                      ┌───────────────────────────────────────┐
                      │          Express API Gateway          │
                      │    TypeScript + Helmet + CORS + JWT   │
                      └───────┬──────────────┬─────────────┬──┘
                              │              │             │
             ┌────────────────┘              │             └────────────────┐
             ▼                               ▼                              ▼
┌──────────────────────────┐   ┌──────────────────────────┐   ┌──────────────────────────┐
│   PostgreSQL (Prisma)    │   │      Redis (Cache)       │   │    BullMQ + Socket.IO    │
│ Primary Relational Store │   │ Sessions & Fast Key-Val  │   │ Async Queues & Realtime  │
└──────────────────────────┘   └──────────────────────────┘   └──────────────────────────┘
```

### Core Design Patterns Implemented

1. **Microservices-Ready Modular Design:** Each domain feature (Auth, Workout Plan, AI Coach, Progressive Overload Engine) is isolated in its own self-contained directory with strict boundaries (`index.ts` / `index.js` exports only).
2. **Clean Architecture & Separation of Concerns:**
   - **Routes Layer:** HTTP request entry & parameter parsing.
   - **Controller Layer:** Payload extraction & HTTP status response mapping (Phase 2+).
   - **Service Layer:** Business rules & orchestration (Phase 2+).
   - **Repository Layer:** Prisma ORM database data access abstractions (Phase 2+).
3. **Configuration Isolation:** Server settings, environment variables, third-party clients (Redis, Socket.IO, BullMQ, Winston, Prisma) reside exclusively in `src/config/` and `src/env.ts`.
4. **Standardized Response & Error Envelopes:** All API responses follow predictable JSON formats via `ApiResponse` and `ApiError` utilities.

---

## 3. Frontend Architecture (`frontend/`)

### Technology Stack

| Technology | Version | Purpose |
|---|---|---|
| **React** | 19.x | Component-based UI Framework |
| **Vite** | 6.x | High-performance build tool & HMR server |
| **React Router DOM** | 7.x | Client-side routing with route guards |
| **Tailwind CSS** | 4.x | Utility-first styling with `@theme` token mapping |
| **Shadcn/UI** | 0.x (Configured) | Accessible, customizable component primitives |
| **TanStack React Query** | 5.x | Server-state caching, synchronization & refetching |
| **Zustand** | 5.x | Lightweight client-state management |
| **React Hook Form** + **Zod** | 7.x / 3.x | Type-safe form validation |
| **Framer Motion** | 12.x | Micro-animations and page transitions |
| **Axios** | 1.x | Configured HTTP client with interceptors |

### Directory Structure & File Roles

```
frontend/src/
├── main.jsx              # Application bootstrap & DOM mount into #root
├── App.jsx               # Top-level component tree (ErrorBoundary -> AppProviders -> AppRouter)
├── index.css             # Tailwind CSS theme variables & base reset
├── components/           # Core layout boundaries
│   ├── ErrorBoundary.jsx # React error boundary catching uncaught UI errors
│   └── LoadingBoundary.jsx # Suspense spinner boundary for async loading
├── features/             # 14 Feature-based placeholder modules
├── layout/               # Global shell layouts
│   ├── RootLayout.jsx    # Primary shell with Header, Footer, and <Outlet />
│   └── index.jsx         # Layout barrel export
├── lib/                  # Infrastructure & HTTP tools
│   ├── axios.js          # Pre-configured Axios instance with base URL & interceptors
│   ├── queryClient.js    # TanStack Query client with staleTime defaults
│   └── utils.js          # Shadcn cn() utility (clsx + tailwind-merge)
├── providers/            # Context & State Providers
│   ├── ThemeProvider.jsx # Dark/Light theme mode provider
│   ├── QueryProvider.jsx # TanStack QueryClientProvider wrapper
│   └── index.jsx         # AppProviders aggregator
├── router/               # Client Navigation
│   ├── index.jsx         # createBrowserRouter route definitions
│   └── ProtectedRoute.jsx# Auth guard placeholder (Phase 2 integration ready)
├── store/                # Client State
│   └── index.js          # Zustand root store
└── (assets, constants, hooks, styles, types) # Placeholder helper directories
```

---

## 4. Backend Architecture (`backend/`)

### Technology Stack

| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | 20+ LTS | JavaScript Runtime |
| **Express.js** | 5.x | Web framework for REST API endpoints |
| **TypeScript** | 6.x / 5.x | Strict compile-time type safety |
| **PostgreSQL** | 15+ | Enterprise relational database |
| **Prisma ORM** | 5.22 | Type-safe ORM & database query builder |
| **Redis (ioredis)** | 5.x | High-speed caching & Pub/Sub broker |
| **BullMQ** | 5.x | Background job processing queue |
| **Socket.IO** | 4.x | Real-time WebSocket connection manager |
| **Winston** | 3.x | Multi-transport structured JSON logger |
| **Helmet & CORS** | Latest | API security headers & cross-origin controls |

### Directory Structure & File Roles

```
backend/src/
├── app.ts                # Express application factory (middleware registration & route mounting)
├── server.ts             # HTTP server entry point (socket binding, DB check, graceful shutdown)
├── env.ts                # Type-safe environment variable parsing & defaults
├── config/               # System Configurations
│   ├── prisma.ts         # PrismaClient singleton with hot-reload guard
│   ├── database.ts       # PostgreSQL connection health check ping (`SELECT 1`)
│   ├── logger.ts         # Winston logger (Console colorized in dev, File in prod)
│   ├── socket.ts         # Socket.IO server initialization
│   ├── redis.ts          # ioredis client singleton with auto-retry strategy
│   ├── bullmq.ts         # BullMQ queue options & Queue Registry (`QUEUE_NAMES`)
│   ├── cors.ts           # CORS white-listing configuration
│   └── jwt.ts            # JWT token expiration & cookie name constants
├── middleware/           # Pipeline Middleware
│   ├── requestLogger.ts  # Request duration & status code logger
│   ├── notFound.ts       # 404 Route Not Found error generator
│   ├── errorHandler.ts   # Global error handling middleware (handles ApiError & Prisma errors)
│   ├── validate.ts       # express-validator payload extractor middleware
│   └── upload.ts         # Multer file upload setup (memory storage)
├── modules/              # 14 Feature-based placeholder modules
├── routes/               # Route Layer
│   ├── index.ts          # Main API router (`/api/v1`)
│   └── v1/health.ts      # `GET /api/v1/health` status & database ping endpoint
├── types/                # System Types
│   ├── express.d.ts      # Express Request type augmentation (`req.user`)
│   └── index.ts          # General application types & pagination helpers
└── utils/                # Utility Helpers
    ├── ApiError.ts       # Custom operational Error class with HTTP static factories
    ├── ApiResponse.ts    # Standardized response envelope (`{ success, statusCode, message, data }`)
    └── index.ts          # Utils barrel export
```

---

## 5. Feature Modules Catalog (Both Frontend & Backend)

The project includes 14 feature module directories. Each directory contains `.gitkeep`, `README.md`, and an empty barrel export (`index.ts` / `index.js`).

| Module Directory | Purpose & Future Scope |
|---|---|
| `01_auth` | User registration, login, JWT refresh, password reset, OAuth integrations. |
| `02_user_profile` | User biometrics, fitness level, goals, personal preferences, avatar uploads. |
| `03_onboarding` | Interactive multi-step onboarding survey and fitness assessment. |
| `04_workout_plan` | Workout creation, custom routines, weekly scheduling, and template library. |
| `05_exercise_library` | Muscle group indexing, exercise GIF/video assets, equipment requirements. |
| `06_nutrition` | Calorie calculation, macro tracking, meal logging, and meal plan generation. |
| `07_ai_coach` | LLM prompt engineering, adaptive workout suggestions, automated feedback. |
| `08_progress_tracking` | Body weight tracking, 1RM progression logs, measurement history. |
| `09_analytics` | Comprehensive charts, volume distribution analysis, workout adherence metrics. |
| `10_progressive_overload_engine` | Core AI engine for intelligent volume/intensity adjustments: |
| ├── `workout_progress/` | Tracking rep completion rates and RPE (Rate of Perceived Exertion). |
| ├── `rest/` | Dynamic rest interval recommendations based on set intensity. |
| ├── `tempo/` | Movement pace guidance (concentric, isometric, eccentric timings). |
| └── `deload/` | Automated fatigue detection and deload week triggers. |
| `11_social` | Community feed, friends, leaderboard challenges, workout sharing. |
| `12_notifications` | Push notifications, email digests, automated workout reminders. |
| `13_settings` | Account privacy, notification preferences, integration connections. |
| `14_admin` | System admin dashboard, user management, system metrics monitoring. |

---

## 6. Environment Configuration Reference

### Backend `.env.example`

```env
NODE_ENV=development
PORT=5000
API_PREFIX=/api/v1

# Database
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/fitaix_db?schema=public"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_URL=redis://localhost:6379

# JWT
JWT_ACCESS_SECRET=your-access-token-secret
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS & Cookies
CORS_ORIGIN=http://localhost:5173
COOKIE_SECRET=your-cookie-secret

# Logging
LOG_LEVEL=debug
LOG_FILE_PATH=./logs
```

### Frontend `.env.example`

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_APP_NAME=FitAI X
VITE_APP_ENV=development
```

---

## 7. Verification Plan & Validation Strategy

The verification strategy ensures that Phase 1 scaffolding meets enterprise build, type safety, and architectural isolation constraints prior to Phase 2 development.

### Automated Verification Pipeline

| Verification Step | Target Directory | Command | Expected Outcome | Status |
|---|---|---|---|---|
| **TypeScript Type Check** | `backend/` | `npx tsc --noEmit` | Clean compilation with zero type errors across all config and server files. | ✅ Passed |
| **Frontend Production Build** | `frontend/` | `npm run build` | Vite client build succeeds and outputs optimized static bundles (`dist/`). | ✅ Passed |
| **Prisma Client Codegen** | `backend/` | `npx prisma generate` | Prisma CLI loads `schema.prisma` with PostgreSQL provider without syntax errors. | ✅ Passed |
| **Frontend Code Quality** | `frontend/` | `npm run lint` | ESLint checks pass across React components and providers. | ✅ Passed |
| **Backend Code Quality** | `backend/` | `npm run lint` | ESLint checks pass across TypeScript backend config & routes. | ✅ Passed |

### PostgreSQL & Database Integration Verification

1. **Connection Ping Utility (`src/config/database.ts`):**
   - Executes lightweight `SELECT 1` query using Prisma Client.
   - Confirms valid database connection on application bootstrap before opening HTTP ports.
2. **Health Check Endpoint (`GET /api/v1/health`):**
   - Returns `200 OK` status with payload:
     ```json
     {
       "success": true,
       "statusCode": 200,
       "message": "FitAI X API Service Healthy",
       "data": {
         "status": "UP",
         "uptime": 42.15,
         "services": {
           "database": "connected"
         }
       }
     }
     ```

### Architecture Isolation Verification

- **Zero Business Logic Inspection:** Verified that all 14 module directories in both `frontend/src/features/` and `backend/src/modules/` contain exclusively `.gitkeep`, `README.md`, and empty `index.ts` / `index.js` barrel exports.
- **Nested Folder Structure Verification:** Confirmed `10_progressive_overload_engine/` contains all 4 required sub-directories: `workout_progress/`, `rest/`, `tempo/`, and `deload/`.

---

## 8. Phase 2+ Developer Guidelines

When implementing features in future phases, developers must adhere to the following workflow:

1. **Database Schema:** Define new Prisma models in `backend/prisma/schema.prisma` and run `npx prisma migrate dev --name <migration_name>`.
2. **Backend Module Development (`backend/src/modules/<feature>/`):**
   - Place models/interfaces in `types/`.
   - Implement data access in `repository/`.
   - Implement business logic in `service/`.
   - Implement route handlers in `controller/`.
   - Register module routes in `backend/src/routes/v1/`.
   - Export public services through the module's `index.ts`.
3. **Frontend Module Development (`frontend/src/features/<feature>/`):**
   - Build API call hooks in `api/`.
   - Build UI components in `components/`.
   - Define feature routes and connect to `frontend/src/router/index.jsx`.
   - Export public views/components through the module's `index.js`.
