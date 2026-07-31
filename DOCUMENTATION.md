# FitAI X – Comprehensive Project Documentation

> **Version:** 1.0.0 | **Last Updated:** July 2026 | **Stack:** Node.js · TypeScript · React · PostgreSQL · OpenRouter AI

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture Overview](#2-architecture-overview)
3. [Tech Stack](#3-tech-stack)
4. [Project Structure](#4-project-structure)
5. [Backend – In Depth](#5-backend--in-depth)
   - [Server Bootstrap](#51-server-bootstrap)
   - [Configuration Layer](#52-configuration-layer)
   - [Middleware Pipeline](#53-middleware-pipeline)
   - [API Routes](#54-api-routes)
   - [Module Documentation](#55-module-documentation)
   - [AI Service Engine](#56-ai-service-engine)
   - [Utilities](#57-utilities)
6. [Database Schema](#6-database-schema)
7. [Frontend – In Depth](#7-frontend--in-depth)
   - [Application Entry](#71-application-entry)
   - [Routing](#72-routing)
   - [State Management & Auth](#73-state-management--auth)
   - [Feature Modules](#74-feature-modules)
   - [Custom Hooks](#75-custom-hooks)
   - [API Services Layer](#76-api-services-layer)
8. [Environment Variables](#8-environment-variables)
9. [API Reference](#9-api-reference)
10. [Authentication Flow](#10-authentication-flow)
11. [AI Integration](#11-ai-integration)
12. [Deployment](#12-deployment)
13. [Development Setup](#13-development-setup)
14. [Security Architecture](#14-security-architecture)

---

## 1. Project Overview

**FitAI X** is a full-stack, AI-powered fitness platform designed to provide users with personalized workout planning, real-time nutrition tracking, and conversational AI coaching. It is built as a mobile-first Progressive Web App (PWA) with a maximum viewport width of `430px`, mimicking the experience of a native mobile application.

### Core Capabilities

| Capability | Description |
|---|---|
| 🤖 **AI Coaching** | Conversational fitness assistant powered by OpenRouter LLMs |
| 🏋️ **Workout Planning** | AI-generated and manual workout plan creation |
| 🥗 **Nutrition Tracking** | AI meal analysis, macro tracking, and plan generation |
| 📊 **Progress Analytics** | Personal records, performance lab, and goal-drift analysis |
| 🔐 **Secure Authentication** | JWT access tokens + HTTP-only cookie refresh with token rotation |
| ⚠️ **Injury Guard** | AI-powered injury risk detection and protective mode |
| 📈 **Progressive Overload Engine** | Volume and intensity tracking with AI-generated overload strategies |

---

## 2. Architecture Overview

FitAI X follows a **monorepo** layout with two independent packages:

```
ai-fitness/
├── backend/    # Node.js + TypeScript REST API
└── frontend/   # React + Vite SPA (mobile-first)
```

### High-Level Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    CLIENT (Browser/PWA)                    │
│  React 19 + Vite + TailwindCSS + Zustand + React Query    │
└───────────────────────┬────────────────────────────────────┘
                        │ HTTPS REST + WebSocket
┌───────────────────────▼────────────────────────────────────┐
│                 BACKEND (Render.com Cloud)                  │
│  Node.js 20 + Express 5 + TypeScript + Socket.IO          │
│  ┌──────────┐ ┌──────────┐ ┌─────────┐ ┌──────────────┐  │
│  │  Auth    │ │ Workout  │ │  Nutr.  │ │  AI Coach    │  │
│  │  Module  │ │  Module  │ │  Module │ │  Module      │  │
│  └────┬─────┘ └────┬─────┘ └────┬────┘ └──────┬───────┘  │
│       └────────────┴────────────┴──────────────┘          │
│                        │                                   │
│         ┌──────────────▼──────────────┐                   │
│         │      AI Service Engine       │                   │
│         │  (OpenRouter REST client)    │                   │
│         └──────────────┬──────────────┘                   │
└────────────────────────┼───────────────────────────────────┘
                         │
       ┌─────────────────┼────────────────────┐
       ▼                 ▼                    ▼
 ┌──────────┐    ┌──────────────┐   ┌─────────────────┐
 │PostgreSQL│    │    Redis     │   │  OpenRouter AI  │
 │(Render)  │    │(ioredis/Bull)│   │   (LLM API)     │
 └──────────┘    └──────────────┘   └─────────────────┘
```

### Request Lifecycle

```
Browser Request
    │
    ▼ HTTPS
Express App
    │
    ├─ requestIdMiddleware      (attach X-Request-ID)
    ├─ helmet()                 (security headers)
    ├─ cors()                   (origin whitelist)
    ├─ express.json()           (body parsing, 10MB limit)
    ├─ cookieParser()           (signed cookie support)
    ├─ requestLogger            (structured HTTP logging)
    │
    ▼ /api/v1/<resource>
Module Router
    │
    ├─ rateLimiter              (IP-based sliding window)
    ├─ authenticateToken        (JWT Bearer verification)
    ├─ validateRequest          (express-validator schema)
    │
    ▼
Controller → Service → Repository → PostgreSQL
    │
    ▼
ApiResponse.success() / ApiError → errorHandler
```

---

## 3. Tech Stack

### Backend

| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | ≥ 20.0.0 | JavaScript runtime |
| **Express** | ^5.2.1 | HTTP framework |
| **TypeScript** | ^5.4.5 | Type safety |
| **PostgreSQL** | – | Primary relational database |
| **node-postgres (`pg`)** | ^8.22.0 | DB driver with connection pooling |
| **ioredis** | ^5.11.1 | Redis client (caching / pub-sub) |
| **BullMQ** | ^5.81.0 | Job queue (future phases) |
| **Socket.IO** | ^4.8.3 | WebSocket / real-time events |
| **jsonwebtoken** | ^9.0.3 | JWT signing & verification |
| **bcryptjs** | ^3.0.3 | Password hashing (salt rounds: 12) |
| **Helmet** | ^8.3.0 | HTTP security headers |
| **Winston** | ^3.19.0 | Structured logging |
| **Multer** | ^2.2.0 | File upload handling |
| **express-validator** | ^7.3.2 | Input validation |

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| **React** | ^19.0.0 | UI framework |
| **Vite** | ^6.2.0 | Build tool & dev server |
| **TailwindCSS** | ^4.0.9 | Utility-first CSS |
| **React Router DOM** | ^7.3.0 | Client-side routing |
| **TanStack React Query** | ^5.67.2 | Server state / data fetching |
| **Zustand** | ^5.0.3 | Client-side state management |
| **Axios** | ^1.8.2 | HTTP client |
| **Framer Motion** | ^12.4.10 | Animations & transitions |
| **React Hook Form** | ^7.54.2 | Form state management |
| **Zod** | ^3.24.2 | Schema validation |
| **Lucide React** | ^0.479.0 | Icon library |
| **Radix UI** | ^1.1.2 | Accessible headless components |

---

## 4. Project Structure

```
ai-fitness/
├── backend/
│   ├── src/
│   │   ├── app.ts                     # Express application factory
│   │   ├── server.ts                  # HTTP server bootstrap
│   │   ├── env.ts                     # Top-level env loader
│   │   ├── config/
│   │   │   ├── bullmq.ts              # BullMQ queue factory
│   │   │   ├── cors.ts                # CORS whitelist options
│   │   │   ├── database.ts            # PostgreSQL pool + auto-schema
│   │   │   ├── env.ts                 # Typed environment config
│   │   │   ├── index.ts               # Config barrel exports
│   │   │   ├── jwt.ts                 # JWT helpers
│   │   │   ├── logger.ts              # Winston logger instance
│   │   │   ├── redis.ts               # Singleton Redis client
│   │   │   ├── socket.ts              # Socket.IO initialization
│   │   │   └── validateEnv.ts         # Env var validator
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts        # Global error handler
│   │   │   ├── notFound.ts            # 404 catch-all
│   │   │   ├── rateLimiter.ts         # IP-based rate limiting
│   │   │   ├── requestId.ts           # X-Request-ID header
│   │   │   ├── requestLogger.ts       # HTTP request logger
│   │   │   ├── upload.ts              # Multer file upload middleware
│   │   │   └── validate.ts            # Validation helper
│   │   ├── modules/
│   │   │   ├── 01_auth/               # Authentication module
│   │   │   ├── 02_user_profile/       # User profile management
│   │   │   ├── 03_onboarding/         # Onboarding flow
│   │   │   ├── 04_workout_plan/       # Workout plans & sessions
│   │   │   ├── 05_exercise_library/   # Exercise library
│   │   │   ├── 06_nutrition/          # Nutrition tracking
│   │   │   ├── 07_ai_coach/           # AI coaching & injury guard
│   │   │   ├── 08_progress_tracking/  # Personal records & streaks
│   │   │   ├── 09_analytics/          # Advanced performance analytics
│   │   │   ├── 10_progressive_overload_engine/ # Overload tracking
│   │   │   ├── 11_social/             # Social features (future)
│   │   │   ├── 12_notifications/      # In-app notifications
│   │   │   ├── 13_settings/           # User settings (future)
│   │   │   └── 14_admin/              # Admin panel (future)
│   │   ├── routes/
│   │   │   ├── index.ts               # API router aggregator
│   │   │   └── v1/
│   │   │       ├── ai.ts              # Standalone AI endpoints
│   │   │       ├── dashboard.ts       # Dashboard data aggregation
│   │   │       └── health.ts          # Health check endpoint
│   │   ├── types/                     # Shared TypeScript types
│   │   └── utils/
│   │       ├── ai.service.ts          # OpenRouter AI service class
│   │       ├── ApiError.ts            # Custom error factory
│   │       ├── ApiResponse.ts         # Standardised response helper
│   │       └── authLogger.ts          # Auth-specific log helpers
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.build.json
│   └── nodemon.json
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx                   # React entry point
│   │   ├── App.jsx                    # Root app component
│   │   ├── router/
│   │   │   ├── index.jsx              # React Router configuration
│   │   │   └── ProtectedRoute.jsx     # Auth guard HOC
│   │   ├── providers/
│   │   │   ├── AuthContext.jsx        # Auth state + token management
│   │   │   ├── QueryProvider.jsx      # TanStack Query provider
│   │   │   ├── ThemeProvider.jsx      # Dark theme provider
│   │   │   └── index.jsx              # Provider composition
│   │   ├── store/
│   │   │   └── index.js               # Zustand global store
│   │   ├── hooks/                     # Shared custom React hooks
│   │   ├── services/api/              # Axios API service modules
│   │   ├── lib/                       # Axios instance + interceptors
│   │   ├── components/                # Shared UI components
│   │   ├── layouts/                   # Dashboard layout shell
│   │   ├── features/
│   │   │   ├── 01_auth/               # Landing, Login, Signup pages
│   │   │   ├── 02_user_profile/       # Profile management
│   │   │   ├── 03_onboarding/         # Multi-step onboarding wizard
│   │   │   ├── 04_workout_plan/       # Workout plan UI
│   │   │   ├── 05_exercise_library/   # Exercise browser
│   │   │   ├── 06_nutrition/          # Nutrition tracking UI
│   │   │   ├── 07_ai_coach/           # AI coach, workout & sessions
│   │   │   ├── 08_progress_tracking/  # Dashboard & progress views
│   │   │   ├── 09_analytics/          # Analytics visualizations
│   │   │   ├── 10_progressive_overload_engine/ # Overload charts
│   │   │   ├── 11_social/             # Social features (future)
│   │   │   ├── 12_notifications/      # Notifications UI
│   │   │   ├── 13_settings/           # Settings UI (future)
│   │   │   └── 14_admin/              # Admin panel (future)
│   │   ├── constants/                 # App-wide constants
│   │   ├── styles/                    # CSS modules / global styles
│   │   └── types/                     # TypeScript types / JSDoc
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── .env.example
│   └── package.json
│
├── render.yaml                        # Render.com deployment config
├── README.md
└── DOCUMENTATION.md                   # This file
```

---

## 5. Backend – In Depth

### 5.1 Server Bootstrap

**Entry point:** `backend/src/server.ts`

The `bootstrap()` function follows a structured 6-step startup sequence:

```
1. createApp()              → Express application factory (app.ts)
2. http.createServer()      → Wraps Express in an HTTP server
3. initializeSocket()       → Attaches Socket.IO to the HTTP server
4. checkDatabaseConnection() → Verifies PostgreSQL + auto-creates schema
5. httpServer.listen()      → Binds to the configured port
6. Graceful shutdown        → Registers SIGTERM / SIGINT handlers
```

**Graceful Shutdown** closes:
- HTTP server (stops accepting new connections)
- PostgreSQL connection pool
- Exits with code `0`

Unhandled promise rejections and uncaught exceptions both log to Winston and exit with code `1`.

---

### 5.2 Configuration Layer

All configuration files live in `backend/src/config/`.

#### `env.ts` – Typed Environment Configuration

All environment variables are accessed through a single typed `env` object. Missing required variables throw at startup, preventing silent misconfiguration.

```typescript
export const env = {
  // Server
  NODE_ENV, PORT, API_PREFIX, IS_PRODUCTION, IS_DEVELOPMENT, IS_TEST,

  // Database
  DATABASE_URL,

  // Redis & Queue
  REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, REDIS_URL,
  QUEUE_REDIS_HOST, QUEUE_REDIS_PORT,

  // JWT
  JWT_ACCESS_SECRET, JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN,

  // CORS & Cookie
  CORS_ORIGIN, CORS_CREDENTIALS, COOKIE_SECRET,

  // Logging
  LOG_LEVEL, LOG_FILE_PATH,

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS,

  // AI Engine
  OPENROUTER_API_KEY, OPENROUTER_BASE_URL, OPENROUTER_MODEL,
}
```

#### `database.ts` – PostgreSQL Connection Pool

- **Library:** `node-postgres` (`pg`)
- **Pool settings:** `max: 20`, `idleTimeoutMillis: 30000`, `connectionTimeoutMillis: 5000`
- **SSL:** Auto-enabled for `render.com` hosts and any production environment
- **Auto-schema init:** `checkDatabaseConnection()` runs `CREATE TABLE IF NOT EXISTS` for all 14 tables on every startup — no manual migration needed in development

#### `redis.ts` – Singleton Redis Client

- Uses `ioredis` with lazy connection (`lazyConnect: true`)
- Max **3 reconnection attempts** with exponential backoff (200ms → 2000ms)
- Offline queue disabled to prevent memory buildup during outages

#### `bullmq.ts` – Job Queue Configuration

Pre-configured infrastructure for background jobs:

```typescript
QUEUE_NAMES = {
  AI_WORKOUT_GENERATION:  'ai:workout:generation',
  AI_NUTRITION_ANALYSIS:  'ai:nutrition:analysis',
  NOTIFICATION_EMAIL:     'notification:email',
  NOTIFICATION_PUSH:      'notification:push',
  PROGRESS_ANALYTICS:     'progress:analytics',
}
```

- 3 retry attempts with exponential backoff (1 second initial delay)
- Completed jobs: last 100 retained; Failed jobs: last 500 retained

#### `socket.ts` – Socket.IO

- Transports: **WebSocket** primary, **HTTP polling** fallback
- Ping timeout: `60 000 ms` | Ping interval: `25 000 ms`
- CORS origins mirrored from `env.CORS_ORIGIN`

#### `logger.ts` – Winston Structured Logging

- Level configurable via `LOG_LEVEL` environment variable
- JSON-structured output for production; colorized console for development
- Persisted to file at `LOG_FILE_PATH`

---

### 5.3 Middleware Pipeline

Registered in `app.ts` in this exact order:

| # | Middleware | File | Purpose |
|---|---|---|---|
| 1 | `requestIdMiddleware` | `requestId.ts` | Attaches unique `X-Request-ID` to every request |
| 2 | `helmet()` | npm | Sets security headers (CSP, HSTS, X-Frame-Options, etc.) |
| 3 | `cors()` | `cors.ts` | Validates `Origin` header against allowlist |
| 4 | `express.json()` | express | Parses JSON bodies, max **10 MB** |
| 5 | `express.urlencoded()` | express | Parses form-encoded bodies, max **10 MB** |
| 6 | `cookieParser()` | npm | Parses signed cookies using `COOKIE_SECRET` |
| 7 | `requestLogger` | `requestLogger.ts` | Logs HTTP method, path, status, and duration |
| 8 | `apiRouter` | `routes/index.ts` | Mounts all API routes under `/api/v1` |
| 9 | `notFound` | `notFound.ts` | 404 catch-all for unmatched routes |
| 10 | `errorHandler` | `errorHandler.ts` | Normalizes errors into `ApiResponse` format |

#### Rate Limiter (`rateLimiter.ts`)

Custom in-memory IP-based rate limiter — no Redis dependency for auth endpoints:

- Keyed by `path:ip` in a `Map<string, { count, resetTime }>`
- Stale entries auto-purged every **10 minutes**
- Throws `ApiError.tooManyRequests()` on limit breach
- Per-route limits: **login** (15/15 min), **register** (10/15 min), **refresh** (60/15 min)

---

### 5.4 API Routes

**Base prefix:** `/api/v1` (configurable via `API_PREFIX` env var)

All routes aggregated in `routes/index.ts`:

| Mount Point | Module / File | Status |
|---|---|---|
| `/health` | `routes/v1/health.ts` | ✅ Active |
| `/auth` | `modules/01_auth` | ✅ Active |
| `/profile` | `modules/02_user_profile` | ✅ Active |
| `/onboarding` | `modules/03_onboarding` | ✅ Active |
| `/workouts` | `modules/04_workout_plan` | ✅ Active |
| `/exercises` | `modules/05_exercise_library` | ✅ Active |
| `/nutrition` | `modules/06_nutrition` | ✅ Active |
| `/ai-coach` | `modules/07_ai_coach` | ✅ Active |
| `/progress` | `modules/08_progress_tracking` | ✅ Active |
| `/analytics` | `modules/09_analytics` | ✅ Active |
| `/notifications` | `modules/12_notifications` | ✅ Active |
| `/ai` | `routes/v1/ai.ts` | ✅ Active |
| `/dashboard` | `routes/v1/dashboard.ts` | ✅ Active |

---

### 5.5 Module Documentation

Each module follows the **Controller → Service → Repository** pattern:

```
module/
  ├── *.controller.ts    # HTTP handlers, delegates to service
  ├── *.service.ts       # Business logic layer
  ├── *.repository.ts    # Database queries (parameterized SQL)
  ├── *.routes.ts        # Express Router with middleware chain
  ├── *.types.ts         # DTOs and TypeScript interfaces
  ├── *.validation.ts    # express-validator schema rules
  └── index.ts           # Barrel export
```

---

#### Module 01 – Authentication (`/api/v1/auth`)

Handles user registration, login, JWT token issuance, secure rotation, and logout.

| Method | Path | Auth | Rate Limit | Description |
|---|---|---|---|---|
| `POST` | `/register` | Public | 10/15 min | Register a new user account |
| `POST` | `/login` | Public | 15/15 min | Authenticate and receive tokens |
| `POST` | `/refresh` | Public | 60/15 min | Rotate access token using refresh token |
| `POST` | `/logout` | 🔒 Private | – | Invalidate all active sessions |
| `GET` | `/me` | 🔒 Private | – | Get current authenticated user |

**Security mechanics:**
- Passwords hashed with `bcryptjs` at **12 salt rounds**
- Tokens signed with **HS256**, include `iss: fitai-x` and `aud: fitai-x-app` claims
- **Access tokens:** short-lived (default `15m`), stored in memory on client
- **Refresh tokens:** long-lived (default `7d`), stored as HTTP-only signed cookies and hashed in DB with a `family_id` for rotation tracking
- **Token Rotation:** Every `/refresh` call revokes the old DB record and issues a new token pair in the same family
- **Reuse Detection:** Presenting a previously revoked token triggers revocation of the entire token family — containment of compromised sessions

**Key types:**
```typescript
interface TokenPayload { id, userId, email, role }

interface AuthResponseDTO {
  user: UserResponseDTO;
  tokens: { accessToken: string; refreshToken: string };
}
```

---

#### Module 02 – User Profile (`/api/v1/profile`)

CRUD for the user's fitness profile (biometrics, goals, activity level).

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/` or `/me` | 🔒 Private | Get authenticated user's profile |
| `PUT` | `/` or `/me` | 🔒 Private | Create or update profile |

**Profile fields:** `age`, `gender`, `height_cm`, `weight_kg`, `target_weight_kg`, `fitness_goal`, `activity_level`, `display_name`, `username`, `fitness_level`, `frequency`, `location`, `duration`, `selected_goal`, `is_completed`

---

#### Module 03 – Onboarding (`/api/v1/onboarding`)

Multi-step onboarding wizard that populates user profile data before first dashboard access. Sets `is_completed = true` upon completion.

---

#### Module 04 – Workout Plan (`/api/v1/workouts`)

Complete workout lifecycle: plan generation, session logging, history, and template management.

| Method | Path | Description |
|---|---|---|
| `GET` | `/home-summary` | Aggregate summary for home screen |
| `GET` | `/active` | Get current active workout plan |
| `GET` | `/daily` | Get today's scheduled workout |
| `POST` | `/generate` | Generate workout from profile data |
| `POST` | `/generate-ai` | Generate AI-powered workout plan |
| `POST` | `/manual` | Create workout plan manually |
| `POST` | `/reset` | Archive and reset current plan |
| `GET` | `/replace-exercise` | Get AI exercise replacement suggestions |
| `POST` | `/replace-exercise` | Confirm exercise replacement |
| `GET` | `/analytics` | Workout analytics and volume data |
| `GET` | `/recommendations` | AI workout recommendations |
| `POST` | `/log-session` | Log a completed workout session |
| `GET` | `/history` | Get workout session history |
| `GET` | `/history/:id` | Get a specific session with sets |
| `DELETE` | `/history/:id` | Delete a session record |
| `GET` | `/templates` | Get saved workout templates (Vault) |
| `POST` | `/templates` | Save workout as a reusable template |
| `DELETE` | `/templates/:id` | Delete a template |

**Exercise JSONB object shape:**
```typescript
{
  name: string;      sets: number;    reps: string;
  rpe?: number;      tag?: string;    tagColor?: string;
  note?: string;     imgSrc?: string; imgAlt?: string;
}
```

---

#### Module 05 – Exercise Library (`/api/v1/exercises`)

Searchable exercise database with muscle group filtering and AI exercise intelligence.

---

#### Module 06 – Nutrition (`/api/v1/nutrition`)

Complete nutrition management: meal logging, AI macro analysis, water tracking, and meal plan generation.

| Method | Path | Description |
|---|---|---|
| `GET` | `/summary` | Today's macro totals and water intake |
| `GET` | `/meals` | List all logged meals |
| `POST` | `/analyze` | AI-analyze a meal description |
| `POST` | `/recommendations` | AI nutrition recommendations from profile |
| `POST` | `/generate-plan` | Generate a full AI meal plan |
| `POST` | `/meals` | Log a new meal entry |
| `POST` | `/meals/:id/duplicate` | Duplicate an existing meal log |
| `DELETE` | `/meals/:id` | Delete a meal log entry |

---

#### Module 07 – AI Coach (`/api/v1/ai-coach`)

AI-powered fitness coaching, conversational chat, AI workout generation, and injury monitoring.

| Method | Path | Description |
|---|---|---|
| `GET` | `/history` | Get chat message history with AI coach |
| `POST` | `/chat` | Send a message to the AI coach |
| `POST` | `/generate-workout` | Generate AI workout plan via coach |
| `GET` | `/injury-guard` | Get injury status and active alerts |
| `POST` | `/injury-log` | Log pain or discomfort |
| `GET` | `/exercise-analysis` | AI biomechanical analysis of an exercise |

**Injury Guard status values:**
- `OPTIMAL` — No injury logs; full unrestricted training
- `PROTECTIVE_MODE` — Active logs; reduced load recommendations applied  
  (e.g. `Reduce load by {discomfortLevel × 5}% on {bodyPart} movement patterns`)

---

#### Module 08 – Progress Tracking (`/api/v1/progress`)

Personal records management, active-day streaks, challenge participation, and dashboard metrics.

| Method | Path | Description |
|---|---|---|
| `GET` | `/dashboard` | Full progress metrics |
| `GET` | `/dashboard-summary` | Compact summary card |
| `POST` | `/challenge/toggle` | Toggle weekly challenge participation |
| `GET` | `/records/summary` | Personal records summary by category |
| `GET` | `/records` | All personal records |
| `POST` | `/records` | Create a new personal record |
| `DELETE` | `/records/:id` | Delete a personal record |

---

#### Module 09 – Analytics (`/api/v1/analytics`)

AI-powered advanced analytics for performance optimization and goal tracking.

| Method | Path | Description |
|---|---|---|
| `GET` | `/overload` | Progressive overload analysis |
| `GET` | `/performance-lab` | Strength curves, volume metrics |
| `GET` | `/goal-drift` | AI goal drift and completion projection |
| `GET` | `/workout-recommendations` | Personalized AI workout recommendations |
| `GET` | `/nutrition-recommendations` | Personalized AI nutrition recommendations |

---

#### Module 12 – Notifications (`/api/v1/notifications`)

In-app notification storage, retrieval, and management.

---

### 5.6 AI Service Engine

**File:** `backend/src/utils/ai.service.ts`

`AIService` is the central gateway for all LLM interactions. It connects to **OpenRouter**, a unified API that routes requests to multiple large language models.

#### Configuration

```typescript
AIService.apiKey  = env.OPENROUTER_API_KEY
AIService.baseUrl = env.OPENROUTER_BASE_URL   // https://openrouter.ai/api/v1
AIService.model   = env.OPENROUTER_MODEL       // e.g. openrouter/free
```

#### Core Method: `callOpenRouter()`

- Sends to OpenRouter `/chat/completions` endpoint
- Applies a **15-second timeout** via `AbortController`
- Extracts JSON content from ` ```json ... ``` ` fenced blocks in LLM responses
- Falls back gracefully on parse errors

#### AI Capability Map

| Method | Input | Output Type | Use Case |
|---|---|---|---|
| `generateCoachReply()` | User message + history | `string` | AI Coach chat |
| `analyzeMealWithAI()` | Meal description | `NutritionAIResponse` | Meal macro analysis |
| `generateWorkoutPlanWithAI()` | Focus area, duration, equipment, energy | `WorkoutPlanAIResponse` | AI workout builder |
| `generateExerciseAnalysisWithAI()` | Exercise name | `ExerciseAnalysisAIResponse` | Exercise intelligence |
| `generateNutritionRecommendationsWithAI()` | User profile data | `NutritionRecommendationsAIResponse` | Personalized diet plan |
| `generateGoalDriftRecommendationsWithAI()` | Goal progress data | `GoalDriftAIResponse` | Goal drift analysis |
| `generateProgressInsightsWithAI()` | User metrics | `ProgressInsightsAIResponse` | Progress insights |

#### Standalone AI Route (`/api/v1/ai`)

| Method | Path | Description |
|---|---|---|
| `POST` | `/chat` | General AI chat completion |
| `POST` | `/meal-analysis` | Analyze a meal description |
| `POST` | `/workout` | Generate a workout blueprint |
| `POST` | `/nutrition` | AI nutrition plan |
| `POST` | `/recommendations` | Goal drift & strategic recommendations |
| `GET` | `/insights` | AI progress insights |

---

### 5.7 Utilities

#### `ApiError.ts` – Custom Error Factory

```typescript
ApiError.badRequest(message, errors?)    // 400
ApiError.unauthorized(message)           // 401
ApiError.forbidden(message)              // 403
ApiError.notFound(message)               // 404
ApiError.conflict(message)               // 409
ApiError.tooManyRequests(message)        // 429
ApiError.internal(message)               // 500
```

#### `ApiResponse.ts` – Standardized Response Envelope

```typescript
// Success response
ApiResponse.success(message, data?, statusCode?)
// → { success: true, message, data, statusCode }

// Error response
ApiResponse.error(message, statusCode, errors?)
// → { success: false, message, statusCode, errors }
```

---

## 6. Database Schema

Schema is auto-initialized on startup via `checkDatabaseConnection()`. All PKs are `UUID` generated by `gen_random_uuid()`. All tables use `CASCADE DELETE` on `user_id` foreign keys.

### Entity Relationship Diagram

```
users (id PK)
  ├── refresh_tokens       (user_id FK) [CASCADE]
  ├── user_profiles        (user_id FK, UNIQUE) [CASCADE]
  ├── workout_plans        (user_id FK) [CASCADE]
  │     └─ exercises (JSONB)
  ├── workout_sessions     (user_id FK) [CASCADE]
  │     └── workout_session_sets (session_id FK) [CASCADE]
  ├── workout_templates    (user_id FK) [CASCADE]
  │     └─ exercises (JSONB)
  ├── meal_logs            (user_id FK) [CASCADE]
  ├── meal_plans           (user_id FK) [CASCADE]
  │     └─ meals (JSONB)
  ├── water_logs           (user_id FK) [CASCADE]
  ├── personal_records     (user_id FK) [CASCADE]
  ├── workout_recommendations (user_id FK) [CASCADE]
  └── user_streaks         (user_id PK + FK) [CASCADE]
```

### Table Definitions

#### `users`
```sql
id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
email         VARCHAR(255) UNIQUE NOT NULL
password_hash VARCHAR(255) NOT NULL
first_name    VARCHAR(100) NOT NULL
last_name     VARCHAR(100) NOT NULL
role          VARCHAR(20)  NOT NULL DEFAULT 'USER'
is_verified   BOOLEAN      NOT NULL DEFAULT false
created_at    TIMESTAMPTZ  DEFAULT CURRENT_TIMESTAMP
updated_at    TIMESTAMPTZ  DEFAULT CURRENT_TIMESTAMP
```

#### `refresh_tokens`
```sql
id         UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
token_hash VARCHAR(255) NOT NULL
family_id  UUID                              -- rotation family grouping
is_revoked BOOLEAN NOT NULL DEFAULT false   -- reuse detection flag
expires_at TIMESTAMPTZ NOT NULL
created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
```

#### `user_profiles`
```sql
id               UUID PRIMARY KEY
user_id          UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE
age              INT NOT NULL
gender           VARCHAR(30) NOT NULL
height_cm        NUMERIC(5,2) NOT NULL
weight_kg        NUMERIC(5,2) NOT NULL
target_weight_kg NUMERIC(5,2)
fitness_goal     VARCHAR(50) NOT NULL
activity_level   VARCHAR(50) NOT NULL
display_name     VARCHAR(150)
username         VARCHAR(100)
height_ft        INT
height_in        INT
fitness_level    VARCHAR(50)
frequency        VARCHAR(50)
location         VARCHAR(50)
duration         VARCHAR(50)
selected_goal    VARCHAR(100)
is_completed     BOOLEAN DEFAULT false
created_at       TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
updated_at       TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
```

#### `workout_plans`
```sql
id         UUID PRIMARY KEY
user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
title      VARCHAR(150) NOT NULL
duration   VARCHAR(50) NOT NULL
exercises  JSONB NOT NULL          -- array of exercise objects
is_active  BOOLEAN DEFAULT true
created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
```

#### `workout_sessions`
```sql
id               UUID PRIMARY KEY
user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
title            VARCHAR(150) NOT NULL
duration_seconds INT NOT NULL DEFAULT 0
total_volume_kg  NUMERIC(10,2) DEFAULT 0
calories_burned  INT DEFAULT 0
rpe_avg          NUMERIC(4,2) DEFAULT 8.0
ai_feedback      TEXT
rating           INT DEFAULT 5
created_at       TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
```

#### `workout_session_sets`
```sql
id            UUID PRIMARY KEY
session_id    UUID NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE
exercise_name VARCHAR(150) NOT NULL
set_number    INT NOT NULL
weight_kg     NUMERIC(8,2) NOT NULL
reps          INT NOT NULL
rpe           NUMERIC(4,2) DEFAULT 8.0
completed     BOOLEAN DEFAULT true
created_at    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
```

#### `workout_templates`
```sql
id                     UUID PRIMARY KEY
user_id                UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
title                  VARCHAR(150) NOT NULL
category               VARCHAR(50) DEFAULT 'Custom'
estimated_duration_min INT DEFAULT 45
difficulty             VARCHAR(50) DEFAULT 'Intermediate'
exercises              JSONB NOT NULL
created_at             TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
```

#### `meal_logs`
```sql
id         UUID PRIMARY KEY
user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
title      VARCHAR(150) NOT NULL
meal_type  VARCHAR(50) NOT NULL    -- breakfast | lunch | dinner | snack
time_label VARCHAR(50) NOT NULL
calories   INT NOT NULL
protein    INT NOT NULL
carbs      INT NOT NULL
fat        INT NOT NULL
img_url    TEXT
created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
```

#### `meal_plans`
```sql
id              UUID PRIMARY KEY
user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
title           VARCHAR(150) NOT NULL
target_calories INT NOT NULL
diet_type       VARCHAR(50) DEFAULT 'Balanced'
meals           JSONB NOT NULL
created_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
```

#### `water_logs`
```sql
id        UUID PRIMARY KEY
user_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
amount_ml INT NOT NULL
logged_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
```

#### `personal_records`
```sql
id            UUID PRIMARY KEY
user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
exercise_name VARCHAR(150) NOT NULL
record_value  NUMERIC(8,2) NOT NULL
previous_best NUMERIC(8,2)
unit          VARCHAR(20) DEFAULT 'kg'
category      VARCHAR(50) DEFAULT 'Strength'
achieved_at   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
```

#### `workout_recommendations`
```sql
id                 UUID PRIMARY KEY
user_id            UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
title              VARCHAR(200) NOT NULL
type               VARCHAR(50) NOT NULL
reason             TEXT NOT NULL
recommended_action TEXT NOT NULL
priority           VARCHAR(20) NOT NULL DEFAULT 'Medium'
created_at         TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
```

#### `user_streaks`
```sql
user_id              UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE
active_days_count    INT DEFAULT 14
has_joined_challenge BOOLEAN DEFAULT false
updated_at           TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
```

---

## 7. Frontend – In Depth

### 7.1 Application Entry

**`main.jsx`** — mounts `<App />` into the DOM root.

**`App.jsx`** — composes the full application shell:

```jsx
<ErrorBoundary>
  <AppProviders>          {/* Auth, Query, Theme providers */}
    <div max-w-[430px]>   {/* Mobile-first viewport cap */}
      <AppRouter />       {/* React Router DOM v7 */}
    </div>
  </AppProviders>
</ErrorBoundary>
```

The `430px` cap ensures the PWA renders identically to a native mobile app on any screen size.

---

### 7.2 Routing

**File:** `frontend/src/router/index.jsx`  
Uses **React Router DOM v7** `createBrowserRouter`.

#### Public Routes

| Path | Component | Description |
|---|---|---|
| `/` | `Landing` | Marketing / landing page |
| `/login` | `Login` | Login form |
| `/signup` | `Signup` | Registration form |

#### Protected Routes

Wrapped by `<ProtectedRoute />` — redirects unauthenticated users to `/login`.

**Dashboard** (nested under `DashboardLayout`):

| Path | Component | Description |
|---|---|---|
| `/dashboard` | `DashboardHome` | Main progress overview |
| `/dashboard/calories` | `DashboardCalories` | Calorie & macro ring charts |
| `/dashboard/meal-ai` | `DashboardMealAI` | AI meal analysis view |
| `/dashboard/workout` | `DashboardWorkout` | Today's workout card |
| `/dashboard/records` | `DashboardRecords` | Personal records gallery |
| `/dashboard/profile` | `DashboardProfile` | Profile view with edit |

**Workout / AI Coach:**

| Path | Component | Description |
|---|---|---|
| `/workout/home` | `WorkoutHomeDashboard` | Active plan & home |
| `/workout/assistant` | `FitAIAssistant` | AI chat coach |
| `/workout/alternatives` | `AIAlternatives` | Exercise replacement tool |
| `/workout/injury-guard` | `InjuryGuard` | Injury status & log |
| `/workout/goal-preservation` | `GoalPreservation` | Goal drift view |
| `/workout/overload-analysis` | `OverloadAnalysis` | Progressive overload view |
| `/workout/create-ai` | `CreateWithAI` | AI workout builder form |
| `/workout/ai-analysis` | `AIAnalysis` | Analysis of current plan |
| `/workout/ai-workout` | `YourAIWorkout` | Generated workout preview |
| `/workout/in-progress` | `WorkoutInProgress` | Live session tracker |
| `/workout/perf-lab` | `PerformanceLab` | Performance lab analytics |
| `/workout/session-complete` | `SessionComplete` | Post-workout summary |
| `/workout/vault` | `TrainingVault` | Saved template library |
| `/workout/history` | `TrainingHistory` | Session history log |
| `/workout/log` | `LogSession` | Manual session logger |
| `/workout/exercise-intel` | `ExerciseIntel` | Exercise intelligence view |
| `/setup` or `/onboarding` | `Onboarding` | Onboarding wizard |

---

### 7.3 State Management & Auth

#### Auth Context (`providers/AuthContext.jsx`)

Central auth state machine managing the full authentication lifecycle.

**State held:**
- `user` — current user object (populated from `/auth/me`)
- `isAuthenticated` — boolean
- `isLoading` — true during session restoration on mount

**Key mechanisms:**

1. **Silent Token Refresh** — Schedules a `setTimeout` exactly 60 seconds before the access token expires; calls `/auth/refresh` silently in the background and reschedules.

2. **Session Restoration** — On every page load/refresh, immediately calls `/auth/refresh` to restore the session using the HTTP-only cookie, avoiding a forced login.

3. **Multi-Tab Sync** — Uses `BroadcastChannel` (`authTabSync` utility) to propagate `LOGIN`, `LOGOUT`, and `TOKEN_REFRESHED` events across all open browser tabs instantly.

4. **Token Storage Strategy** — Access tokens live **in-memory only** (no localStorage), preventing XSS token theft. Refresh tokens are HTTP-only, `secure`, signed cookies never accessible to JavaScript.

**Exported actions:** `login(credentials)`, `signup(userData)`, `logout()`, `restoreSession()`

#### Zustand Global Store (`store/index.js`)

```javascript
useAppStore = create({
  initialized: true,
  theme: 'dark',
  setInitialized: (status) => set({ initialized: status }),
})
```

Feature-specific state is co-located within each feature module rather than in this global store.

#### TanStack React Query

Manages all server state (API data), providing:
- Background refetching on window focus
- Stale-while-revalidate caching
- Optimistic updates
- Request deduplication across components
- Error / loading states

---

### 7.4 Feature Modules

Each frontend feature mirrors the backend module structure:

```
features/XX_module_name/
  ├── index.js        # Public barrel exports
  ├── README.md       # Module notes
  ├── components/     # Feature-scoped UI components
  ├── hooks/          # Feature-scoped React hooks
  ├── services/       # API call wrappers for this feature
  └── utils/          # Feature-scoped utilities
```

**Key feature highlights:**

**01_auth** — `Landing.jsx`, `Login.jsx`, `Signup.jsx`  
- Landing: hero section + feature cards + CTA
- Login: email/password with validation, error toasts, redirect on success
- Signup: full validation, auto-login after register

**03_onboarding** — multi-step wizard  
Collects biometrics, goals, frequency, duration, location.  
Marks `is_completed = true` on profile on final step.

**07_ai_coach** — 15+ route-level page components (primary feature)  
- **FitAIAssistant** — full-screen chat with streaming display
- **CreateWithAI** — parameter form for AI workout generation
- **YourAIWorkout** — preview and start generated plan
- **WorkoutInProgress** — live set/rep/weight tracker with rest timer
- **SessionComplete** — AI-generated post-workout feedback
- **InjuryGuard** — pain severity logging and protective mode display
- **ExerciseIntel** — biomechanical muscle map + AI tips
- **PerformanceLab** — strength curve, volume heatmap
- **TrainingVault** — template cards with quick-start
- **TrainingHistory** — filterable session log

**08_progress_tracking** — dashboard suite  
- `DashboardHome` — streak counter, macro rings, weekly summary
- `DashboardCalories` — macro progress bars + meal list
- `DashboardMealAI` — text input → AI macro breakdown
- `DashboardRecords` — PRs by category (Strength, Cardio, etc.)

---

### 7.5 Custom Hooks

Shared hooks in `src/hooks/` wrap API calls and React Query:

| Hook | Endpoints Used | Responsibility |
|---|---|---|
| `useAuth.js` | `/auth/*` | Auth action wrappers |
| `useProfile.js` | `/profile/*` | Profile CRUD |
| `useWorkout.js` | `/workouts/*` | Plan & session management |
| `useNutrition.js` | `/nutrition/*` | Meal logging & summaries |
| `useProgress.js` | `/progress/*` | Records & dashboard data |
| `useAICoach.js` | `/ai-coach/*` | AI chat & injury guard |
| `useAnalytics.js` | `/analytics/*` | Analytics fetching |
| `useExercise.js` | `/exercises/*` | Exercise library queries |
| `useOnboarding.js` | `/onboarding/*` | Onboarding submission |

---

### 7.6 API Services Layer

**Axios base instance** (`lib/axios.js`):
- `baseURL` set from `VITE_API_BASE_URL`
- **Request interceptor:** injects `Authorization: Bearer <token>` on every call
- **Response interceptor:** normalizes response envelope, handles 401 auto-logout
- **Cancellation:** `AbortController` integration for cleanup on component unmount

**Per-module service files** (`services/api/`):

| File | Operations |
|---|---|
| `auth.api.js` | login, register, logout, refresh, getMe |
| `profile.api.js` | getProfile, updateProfile |
| `workout.api.js` | all workout CRUD + AI generation + history + templates |
| `nutrition.api.js` | meal CRUD, analyze, recommendations, generate plan |
| `progress.api.js` | records CRUD, dashboard, challenge toggle |
| `analytics.api.js` | overload, perf lab, goal drift, recommendations |
| `aicoach.api.js` | chat history, send message, injury log/guard |
| `exercise.api.js` | exercise search and library |
| `onboarding.api.js` | submit onboarding data |

---

## 8. Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Example | Description |
|---|---|---|---|
| `NODE_ENV` | ✅ | `development` | Runtime environment |
| `PORT` | ✅ | `5000` | HTTP server port |
| `API_PREFIX` | ✅ | `/api/v1` | Base URL prefix |
| `DATABASE_URL` | ✅ | `postgresql://...` | PostgreSQL connection string |
| `REDIS_URL` | ✅ | `redis://localhost:6379` | Redis connection URL |
| `REDIS_HOST` | ✅ | `localhost` | Redis host |
| `REDIS_PORT` | ✅ | `6379` | Redis port |
| `REDIS_PASSWORD` | – | – | Redis auth password |
| `QUEUE_REDIS_HOST` | ✅ | `localhost` | BullMQ Redis host |
| `QUEUE_REDIS_PORT` | ✅ | `6379` | BullMQ Redis port |
| `JWT_ACCESS_SECRET` | ✅ | `<random>` | Access token signing secret |
| `JWT_REFRESH_SECRET` | ✅ | `<random>` | Refresh token signing secret |
| `JWT_ACCESS_EXPIRES_IN` | ✅ | `15m` | Access token TTL |
| `JWT_REFRESH_EXPIRES_IN` | ✅ | `7d` | Refresh token TTL |
| `CORS_ORIGIN` | ✅ | `http://localhost:5173` | Allowed origins (comma-separated) |
| `CORS_CREDENTIALS` | ✅ | `true` | Allow credentials in CORS |
| `COOKIE_SECRET` | ✅ | `<random>` | Cookie signing secret |
| `LOG_LEVEL` | ✅ | `info` | Winston log level |
| `LOG_FILE_PATH` | ✅ | `./logs/app.log` | Log file path |
| `RATE_LIMIT_WINDOW_MS` | ✅ | `900000` | Rate limit window (ms) |
| `RATE_LIMIT_MAX_REQUESTS` | ✅ | `100` | Max requests per window |
| `OPENROUTER_API_KEY` | ✅ | `sk-or-...` | OpenRouter API key |
| `OPENROUTER_BASE_URL` | ✅ | `https://openrouter.ai/api/v1` | OpenRouter base URL |
| `OPENROUTER_MODEL` | ✅ | `openrouter/free` | LLM model identifier |

### Frontend (`frontend/.env.local`)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | ✅ | Backend API base URL (e.g. `http://localhost:5000/api/v1`) |
| `VITE_APP_NAME` | – | App display name |
| `VITE_APP_ENV` | – | Environment label |

---

## 9. API Reference

### Standard Response Envelope

#### Success
```json
{
  "success": true,
  "message": "Human-readable description",
  "data": { ... },
  "statusCode": 200
}
```

#### Error
```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400,
  "errors": [ { "field": "email", "message": "Invalid format" } ]
}
```

### HTTP Status Codes

| Code | Meaning |
|---|---|
| `200` | OK |
| `201` | Created |
| `400` | Bad Request – validation failed |
| `401` | Unauthorized – missing or invalid token |
| `403` | Forbidden – insufficient permissions |
| `404` | Not Found |
| `409` | Conflict – resource already exists |
| `429` | Too Many Requests – rate limit exceeded |
| `500` | Internal Server Error |

### Auth Header

All protected routes require:
```
Authorization: Bearer <access_token>
```

### Health Check

```
GET /api/v1/health
Response: 200 OK  { status: "ok", timestamp: "..." }
```

---

## 10. Authentication Flow

### Registration

```
Client                      Server                    DB
  │                            │                       │
  ├── POST /auth/register ────▶│                       │
  │   { email, pw, name }      │                       │
  │                            ├── findByEmail ───────▶│
  │                            │◀─── null ─────────────┤
  │                            │                       │
  │                            ├── bcrypt.hash(pw, 12) │
  │                            ├── createUser ────────▶│
  │                            │◀─── user entity ──────┤
  │                            │                       │
  │                            ├── sign accessToken    │
  │                            ├── sign refreshToken   │
  │                            ├── saveRefreshToken ──▶│
  │                            │                       │
  │◀── 201 { user, tokens } ───┤                       │
```

### Silent Refresh & Token Rotation

```
Client (in-memory timer)    Server                    DB
  │                            │                       │
  ├── POST /auth/refresh ─────▶│ (httpOnly cookie)     │
  │                            ├── jwt.verify() ────── │
  │                            ├── findRefreshToken ──▶│
  │                            │◀─── storedToken ──────┤
  │                            │                       │
  │                            │ if is_revoked:        │
  │                            │   revokeTokenFamily ─▶│ (containment)
  │                            │   → 401               │
  │                            │                       │
  │                            ├── revokeRefreshToken ▶│ (step 1)
  │                            ├── sign new tokens     │
  │                            ├── saveRefreshToken ──▶│ (step 2, same family)
  │                            │                       │
  │◀── 200 { accessToken } ────┤                       │
  │  + Set-Cookie (new refresh)│                       │
```

---

## 11. AI Integration

### OpenRouter Architecture

FitAI X uses **OpenRouter** as an LLM gateway, providing:
- Unified API across 100+ models
- Built-in model fallback and routing
- Free tier models available for development (`openrouter/free`)

### AI Feature Map

```
User Action                      AI Method Called                        Output
─────────────────────────────────────────────────────────────────────────────
Chat with coach            →  generateCoachReply()               → Conversational text
Analyze meal               →  analyzeMealWithAI()                → Macro breakdown JSON
Build AI workout           →  generateWorkoutPlanWithAI()        → Exercise list + sets
Inspect exercise           →  generateExerciseAnalysisWithAI()   → Biomechanics data
Get nutrition plan         →  generateNutritionRecommendationsWithAI() → Meal plan JSON
Check goal drift           →  generateGoalDriftRecommendationsWithAI() → Projection + actions
View AI insights           →  generateProgressInsightsWithAI()   → Insight bullets
```

### Prompt Engineering Pattern

Each AI method builds a system prompt containing:
1. **Persona definition** — role, expertise, communication style
2. **User context** — profile, goals, biometrics, history
3. **Output schema** — exact JSON structure expected in the response
4. **Safety constraints** — RPE-based limits, injury awareness

### Response Parsing Strategy

```
LLM response (raw string)
    │
    ▼
Extract ```json ... ``` fence
    │
    ▼
JSON.parse()
    │
    ▼
Validate required fields → return typed DTO
                        → on failure: throw ApiError.internal()
```

---

## 12. Deployment

### Backend – Render.com

**`render.yaml`:**
```yaml
services:
  - type: web
    name: fitaix-backend
    env: node
    rootDir: backend
    buildCommand: npm run render-build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5000
```

**Build command:** `npm install --include=dev && npx prisma generate && npm run build`  
**Start command:** `node dist/server.js`

Required Render services:
- **Web Service** (Node.js) — the API server
- **PostgreSQL** — managed database (SSL auto-enabled)
- **Redis** (optional) — for BullMQ background jobs

### Frontend – Vercel

- Static site from Vite `dist/` build output
- `vercel.json` configures SPA fallback (all paths → `index.html`)
- Zero-config deployment; connect GitHub repo → auto-deploy on push

### Production Checklist

- [ ] Generate cryptographically random secrets for `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `COOKIE_SECRET`
- [ ] Set `CORS_ORIGIN` to your Vercel production URL
- [ ] Set `NODE_ENV=production`
- [ ] Configure `OPENROUTER_API_KEY` with a production key
- [ ] Verify PostgreSQL `DATABASE_URL` points to the production database
- [ ] Confirm `REDIS_URL` / `QUEUE_REDIS_HOST` are configured if using BullMQ

---

## 13. Development Setup

### Prerequisites

- **Node.js** ≥ 20.0.0
- **npm** ≥ 10.0.0
- **PostgreSQL** (local or Render cloud)
- **Redis** (local via Docker or cloud)
- **OpenRouter API Key** (free at [openrouter.ai](https://openrouter.ai))

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in DATABASE_URL, Redis settings, JWT secrets, OpenRouter key

npm run dev          # Hot-reload dev server at http://localhost:5000
```

**NPM Scripts:**

| Script | Description |
|---|---|
| `npm run dev` | Nodemon hot-reload server |
| `npm run build` | TypeScript compile → `dist/` |
| `npm start` | Run compiled production server |
| `npm run lint` | ESLint TypeScript source |
| `npm run lint:fix` | ESLint with auto-fix |
| `npm run format` | Prettier format `src/` |
| `npm run type-check` | TypeScript check (no emit) |
| `npm run prisma:studio` | Open Prisma Studio GUI |
| `npm run prisma:seed` | Run database seed script |

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Set VITE_API_BASE_URL=http://localhost:5000/api/v1

npm run dev          # Vite HMR server at http://localhost:5173
```

**NPM Scripts:**

| Script | Description |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Production bundle to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | ESLint all source files |
| `npm run format` | Prettier format `src/` |

### Run Both Together

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

---

## 14. Security Architecture

### Authentication Security

| Mechanism | Implementation |
|---|---|
| **Password Hashing** | bcryptjs, 12 salt rounds (~300ms deliberate delay) |
| **Access Token Storage** | In-memory only (not localStorage — XSS-safe) |
| **Refresh Token Storage** | HTTP-only, Secure, Signed cookie (JS-inaccessible) |
| **Token Signing** | HS256 with separate secrets for access vs. refresh |
| **Token Claims** | `iss`, `aud`, `exp`, `userId`, `email`, `role` |
| **Rotation** | Refresh token replaced on every `/refresh` call |
| **Reuse Detection** | Entire token family revoked on reuse — active-session protection |
| **Multi-tab Logout** | BroadcastChannel propagates logout to all tabs instantly |

### Transport Security

| Mechanism | Details |
|---|---|
| **TLS/HTTPS** | Enforced by Render.com and Vercel in production |
| **CORS** | Strict origin allowlist; credentials permitted |
| **Helmet** | CSP, X-Frame-Options, X-Content-Type-Options, HSTS, Referrer-Policy |
| **Cookie Flags** | `httpOnly`, `secure`, `sameSite=strict`, signed with `COOKIE_SECRET` |

### Input & Data Security

| Mechanism | Details |
|---|---|
| **Input Validation** | express-validator schemas on all mutating endpoints |
| **SQL Injection** | Parameterized queries exclusively via `pg` pool |
| **Body Size Limit** | 10 MB cap on JSON and URL-encoded bodies |
| **Rate Limiting** | Per-route, per-IP sliding window (in-memory, O(1)) |
| **Error Masking** | Stack traces suppressed in production; generic 500 message |

### Error Handling Policy

| Error Type | Log Level | Stack Trace | Client Response |
|---|---|---|---|
| 4xx (operational) | `WARN` | Never | Exact `ApiError` message |
| 5xx (unexpected) | `ERROR` | Dev only | `"Internal Server Error"` in prod |
| Prisma errors | `ERROR` | Dev only | `"Database operation failed"` |

---

*This document reflects the live state of the FitAI X codebase. Modules currently scaffolded for future phases (social, admin, settings, BullMQ workers) will be documented as they are implemented.*

---

## 15. Workout Module – Sub-Services

The  4_workout_plan module delegates specialized logic to four internal sub-services, located at modules/04_workout_plan/services/:

### WorkoutGeneratorService

Generates structured workout plans from high-level input parameters using rule-based exercise selection.

**Input:**
```typescript
interface AIGenerateWorkoutInput {
  goal: string;            // 'Hypertrophy' | 'Strength' | 'Endurance' | 'Fat Loss'
  targetMuscle: string;    // e.g. 'Chest & Triceps'
  experience: string;      // 'Beginner' | 'Intermediate' | 'Advanced'
  workoutDuration: string; // e.g. '50 mins'
  equipment: string[];     // ['Barbell', 'Dumbbell', 'Cable']
}
```

**Output:** A complete WorkoutPlan with exercises, sets, reps, RPE targets, tags, and image references.

### ExerciseReplacementService

Given an exercise name and replacement reason (injury, equipment unavailability, preference), returns 3 alternatives targeting the same muscle group with similar biomechanical patterns.

### WorkoutRecommendationService

Analyzes recent session history (volume, frequency, intensity) and generates actionable WorkoutRecommendation rows stored in workout_recommendations.

**Recommendation types:** Volume Increase, Deload Week, Muscle Group Balance, Rest Compliance

### WorkoutAnalysisService

Computes weekly analytics aggregates from workout_sessions and workout_session_sets:
- Total volume lifted (kg)
- Session frequency
- Average RPE trend
- Top-performing exercises by volume

```typescript
interface WeeklyAnalytics {
  totalVolume: number;
  sessionsCompleted: number;
  avgRpe: number;
  topExercises: Array<{ name: string; volume: number }>;
}
```

### Daily Workout Day Map

getDailyWorkout() maps each weekday to a predefined muscle group focus:

| Day | Focus | Muscles | Duration | Est. Calories |
|---|---|---|---|---|
| Monday | Chest & Triceps Hypertrophy | Chest, Triceps | 50 min | 420 kcal |
| Tuesday | Back & Biceps Power Pull | Back, Biceps | 55 min | 460 kcal |
| Wednesday | Active Recovery & Mobility | Core, Mobility | 30 min | 210 kcal |
| Thursday | Quads & Glutes Lower Body | Quadriceps, Glutes | 60 min | 510 kcal |
| Friday | Deltoids & Upper Body Pump | Shoulders, Arms | 45 min | 380 kcal |
| Saturday | Full Body Conditioning | Full Body | 55 min | 490 kcal |
| Sunday | Rest & Myofascial Release | Rest Day | 20 min | 120 kcal |

---

## 16. Unified Dashboard Endpoint

**GET /api/v1/dashboard** returns a complete dashboard payload in a **single HTTP round-trip** using Promise.all() for 6 parallel DB operations:

```
Promise.all([
  Query users              --> profile display info
  Query user_profiles      --> biometrics & fitness level
  Query workout_plans      --> active plan (is_active = true)
  Query workout_sessions   --> last 5 sessions
  Query meal_logs          --> last 10 meals
  ProgressService.getDashboardMetrics() --> streaks, vitals, challenge state
])
```

### Response Payload Shape

```json
{
  "profile": { "displayName": "Alex Johnson", "fitnessLevel": "Intermediate", ... },
  "activeWorkout": { "id": "uuid", "title": "AI Hypertrophy Plan", "exercises": [] },
  "workoutHistory": [],
  "nutrition": {
    "totals": { "calories": 1850, "protein": 142, "carbs": 210, "fat": 58 },
    "loggedMeals": []
  },
  "progress": {
    "heartRate": 78, "steps": 8425, "energy": 2450,
    "hydration": 1.8, "activeBurn": 480, "activeStreak": 14,
    "hasJoinedChallenge": false
  },
  "dashboardSummary": { "activeStreak": 14, "heartRate": 78, ... }
}
```

### Frontend Consumption

useDashboardState.js calls this endpoint on mount with an isMounted guard. Profile data is also cached in localStorage for instant rendering before the API responds. Each sub-query has its own .catch() returning a safe default, so partial failures don't break the whole dashboard.

---

## 17. Data Flow Patterns

### Pattern 1: AI Workout Generation (End-to-End)

```
User taps "Create with AI" --> /workout/create-ai
  useAICoach.generateWorkout({ focusArea, targetDuration, energyLevel, equipment })
  POST /api/v1/ai-coach/generate-workout
  AICoachService.generateAIWorkout(userId, input)
  AIService.generateWorkoutPlanWithAI(input)   <-- OpenRouter LLM (15s timeout)
  WorkoutPlanAIResponse { title, duration, exercises[] }
  WorkoutRepository.createPlan(userId, plan)   <-- INSERT workout_plans
  Navigate to /workout/ai-workout
  User starts --> /workout/in-progress (live tracker)
  POST /api/v1/workouts/log-session
    --> INSERT workout_sessions + workout_session_sets
  /workout/session-complete (AI feedback)
```

### Pattern 2: Meal AI Analysis (End-to-End)

```
User types "3 eggs, avocado toast, OJ"
  POST /api/v1/nutrition/analyze { description: "..." }
  NutritionService.analyzeMeal(mealText)
  AIService.analyzeMealWithAI(mealText)   <-- OpenRouter LLM
  NutritionAIResponse { mealName, calories, protein, carbs, fat, fiber }
  Frontend shows macro breakdown
  User taps "Log" --> POST /api/v1/nutrition/meals
  NutritionRepository.createMealLog() --> INSERT meal_logs
```

### Pattern 3: Silent Token Refresh

```
App mounts --> AuthContext.restoreSession()
  POST /auth/refresh  (browser sends httpOnly cookie automatically)
  Success: setAccessToken(token)
           parseJwt(token).exp --> setTimeout(refresh, exp - now - 60000ms)
  Failure: clearAccessToken() --> setIsAuthenticated(false)

Timer fires at T-60s:
  POST /auth/refresh (background)
  Success: new token in memory, timer rescheduled
  Failure: logout + BroadcastChannel("LOGOUT") --> all tabs react
```

### Pattern 4: Injury Guard Activation

```
POST /api/v1/ai-coach/injury-log { bodyPart, discomfortLevel, notes }
  AICoachRepository.createInjuryLog() --> INSERT

GET /api/v1/ai-coach/injury-guard
  0 logs  --> { status: "OPTIMAL", activeAlerts: [] }
  N logs  --> {
    status: "PROTECTIVE_MODE",
    activeAlerts: [{
      bodyPart: "Lower Back",
      severity: 7,
      recommendation: "Reduce load by 35% on Lower Back movement patterns."
    }]
  }
```

---

## 18. Hook API Reference

### useWorkout() — State & Actions

| State | Type | Description |
|---|---|---|
| ctivePlan | WorkoutPlan\|null | Current active plan |
| homeSummary | object\|null | Home aggregate data |
| 	emplates | WorkoutTemplate[] | Vault templates |
| history | WorkoutSession[] | Past session logs |
| loading | oolean | In-flight indicator |
| error | string\|null | Last error |

| Action | Parameters | Description |
|---|---|---|
| etchActivePlan() | – | Load active plan |
| etchHomeSummary() | – | Load home aggregate |
| etchTemplates() | – | Load vault templates |
| etchHistory() | – | Load session history |
| logSession(data) | LogSessionInput | Save completed session |
| createTemplate(data) | CreateTemplateInput | Save as template |
| deleteTemplate(id) | string | Remove template (optimistic) |
| deleteHistoryItem(id) | string | Remove session (optimistic) |
| generatePlan() | – | Auto-generate workout plan |

### useAICoach() — State & Actions

| State | Type | Description |
|---|---|---|
| chatHistory | ChatMessage[] | Full conversation |
| injuryGuardStatus | InjuryGuardStatus\|null | Guard state |
| exerciseAnalysis | ExerciseAnalysis\|null | Last AI analysis |
| loading | oolean | In-flight indicator |
| error | string\|null | Last error |

| Action | Parameters | Description |
|---|---|---|
| etchHistory() | – | Load past messages |
| sendMessage(text) | string | Optimistic send + coach reply |
| generateWorkout(params) | AIWorkoutParams | AI workout via coach |
| etchInjuryGuard() | – | Load guard status |
| logInjury(data) | InjuryLogInput | Log pain, refresh guard |
| etchExerciseAnalysis(id) | string | AI biomechanical analysis |

**Optimistic update in sendMessage():** Temp user message appended instantly to chatHistory; replaced with confirmed messages on server response; removed on failure.

---

## 19. Nutrition AI Logic

### Daily Macro Targets (Service Defaults)

| Macro | Target |
|---|---|
| Calories | 2,400 kcal |
| Protein | 180 g |
| Carbohydrates | 250 g |
| Fat | 70 g |

### AI Analysis Response Types

```typescript
// Meal Analysis
interface NutritionAIResponse {
  mealName: string; calories: number; protein: number;
  carbs: number; fat: number; fiber: number; description: string;
}

// Nutrition Recommendations
interface NutritionRecommendationsAIResponse {
  recommendedCalories: number; recommendedProtein: number;
  recommendedCarbs: number; recommendedFat: number;
  hydrationLiters: number;
  recommendations: string[];
  sampleMealPlan: Array<{ meal: string; suggestion: string }>;
}
```

---

## 20. Design System

### Color Palette

| Token | Value | Usage |
|---|---|---|
| App Background | #050505 | Outer shell |
| Surface Dark | #0A0A0A / #131313 | Cards, sections |
| Accent Gold | #f5c400 | Brand mark, CTAs, active states |
| Text Primary | #e5e2e1 | Body copy |
| Text Muted | #d1c5ab | Secondary labels |
| Border | gba(255,255,255,0.05) | Card edges |

### Typography
- **Font:** Manrope, sans-serif
- **Weights:** 400 (body) → 600 (labels) → 700 (headings) → 800 (brand/hero)

### Framer Motion Conventions

```javascript
// Card entrance
initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 },
transition: { duration: 0.3, ease: "easeOut" }

// Staggered lists
transition: { staggerChildren: 0.08 }

// Interactive feedback
whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }
```

### Mobile-First Layout

| Rule | Value |
|---|---|
| Max width | 430px |
| Viewport height | 100dvh (iOS Safari safe) |
| Fixed header height | 64px with ackdrop-blur-xl |
| Content bottom padding | pb-32 (128px) to clear bottom nav |

---

## 21. Testing Strategy

> Infrastructure scaffolded in ackend/src/tests/; full suites planned for future phases.

### Planned Layers

| Layer | Tool | Scope |
|---|---|---|
| Unit | Jest / Vitest | Services, utilities, validators |
| Integration | Supertest | Full API endpoint cycles |
| E2E | Playwright | Register → Workout → Log flow |
| Auth | Jest | Rotation, reuse detection, multi-tab sync |

### Critical Test Scenarios

- Register → login → refresh → logout cycle
- Revoked token triggers full family revocation
- Silent refresh fires 60s before expiry
- Multi-tab logout via BroadcastChannel
- AI generation returns valid JSONB structure
- Session logging persists sets correctly
- OpenRouter timeout returns graceful fallback
- Injury guard transitions between OPTIMAL / PROTECTIVE_MODE

---

## 22. Code Quality & Tooling

### Backend Tools

| Tool | File | Purpose |
|---|---|---|
| ESLint | eslint.config.js | TypeScript lint rules |
| Prettier | prettier.config.json | Formatting |
| TypeScript | 	sconfig.json | Strict mode compilation |
| Nodemon | 
odemon.json | Hot-reload on src/**/*.ts |
| tsx | — | TypeScript script execution |

**Key tsconfig options:** strict: true, 	arget: ES2020, module: CommonJS, path aliases via aseUrl + paths.

### Frontend Tools

| Tool | File | Purpose |
|---|---|---|
| ESLint | eslint.config.js | React hooks + JSX rules |
| Prettier | prettier.config.js | Formatting |
| Oxlint | .oxlintrc.json | Fast supplementary linting |
| Vite | ite.config.js | Build + aliases + React plugin |
| PostCSS | postcss.config.js | TailwindCSS v4 processing |

**Vite path aliases:**
```
'@features'   -> './src/features'
'@components' -> './src/components'
'@hooks'      -> './src/hooks'
'@services'   -> './src/services'
'@store'      -> './src/store'
'@lib'        -> './src/lib'
```

---

## 23. Naming Conventions

### Backend

| Layer | Style | Example |
|---|---|---|
| Files | domain.layer.ts | uth.service.ts |
| Classes | PascalCase | AuthService, WorkoutRepository |
| Methods | camelCase | generateAIWorkout() |
| DB tables/columns | snake_case | workout_sessions, user_id |
| DTOs | PascalCase + DTO | RegisterDTO |
| URL routes | kebab-case | /ai-coach, /log-session |
| Constants | SCREAMING_SNAKE | JWT_ISSUER, QUEUE_NAMES |

### Frontend

| Layer | Style | Example |
|---|---|---|
| Page components | PascalCase.jsx | WorkoutHomeDashboard.jsx |
| Custom hooks | use + camelCase | useWorkout.js |
| API services | domain.api.js | workout.api.js |
| Feature dirs | NN_snake_case |  7_ai_coach/ |

---

## 24. Full API Quick-Reference

> Legend: Public = no auth required. 🔒 = Bearer token required.

### Auth
| Method | Path | Access |
|---|---|---|
| POST | /api/v1/auth/register | Public |
| POST | /api/v1/auth/login | Public |
| POST | /api/v1/auth/refresh | Public |
| POST | /api/v1/auth/logout | 🔒 |
| GET | /api/v1/auth/me | 🔒 |

### Profile
| Method | Path | Access |
|---|---|---|
| GET | /api/v1/profile/me | 🔒 |
| PUT | /api/v1/profile/me | 🔒 |

### Workouts
| Method | Path | Access |
|---|---|---|
| GET | /api/v1/workouts/home-summary | 🔒 |
| GET | /api/v1/workouts/active | 🔒 |
| GET | /api/v1/workouts/daily | 🔒 |
| POST | /api/v1/workouts/generate | 🔒 |
| POST | /api/v1/workouts/generate-ai | 🔒 |
| POST | /api/v1/workouts/manual | 🔒 |
| POST | /api/v1/workouts/reset | 🔒 |
| GET/POST | /api/v1/workouts/replace-exercise | 🔒 |
| GET | /api/v1/workouts/analytics | 🔒 |
| GET | /api/v1/workouts/recommendations | 🔒 |
| POST | /api/v1/workouts/log-session | 🔒 |
| GET | /api/v1/workouts/history | 🔒 |
| GET | /api/v1/workouts/history/:id | 🔒 |
| DELETE | /api/v1/workouts/history/:id | 🔒 |
| GET | /api/v1/workouts/templates | 🔒 |
| POST | /api/v1/workouts/templates | 🔒 |
| DELETE | /api/v1/workouts/templates/:id | 🔒 |

### Nutrition
| Method | Path | Access |
|---|---|---|
| GET | /api/v1/nutrition/summary | 🔒 |
| GET | /api/v1/nutrition/meals | 🔒 |
| POST | /api/v1/nutrition/analyze | 🔒 |
| POST | /api/v1/nutrition/recommendations | 🔒 |
| POST | /api/v1/nutrition/generate-plan | 🔒 |
| POST | /api/v1/nutrition/meals | 🔒 |
| POST | /api/v1/nutrition/meals/:id/duplicate | 🔒 |
| DELETE | /api/v1/nutrition/meals/:id | 🔒 |

### AI Coach
| Method | Path | Access |
|---|---|---|
| GET | /api/v1/ai-coach/history | 🔒 |
| POST | /api/v1/ai-coach/chat | 🔒 |
| POST | /api/v1/ai-coach/generate-workout | 🔒 |
| GET | /api/v1/ai-coach/injury-guard | 🔒 |
| POST | /api/v1/ai-coach/injury-log | 🔒 |
| GET | /api/v1/ai-coach/exercise-analysis | 🔒 |

### Progress
| Method | Path | Access |
|---|---|---|
| GET | /api/v1/progress/dashboard | 🔒 |
| GET | /api/v1/progress/dashboard-summary | 🔒 |
| POST | /api/v1/progress/challenge/toggle | 🔒 |
| GET | /api/v1/progress/records/summary | 🔒 |
| GET | /api/v1/progress/records | 🔒 |
| POST | /api/v1/progress/records | 🔒 |
| DELETE | /api/v1/progress/records/:id | 🔒 |

### Analytics
| Method | Path | Access |
|---|---|---|
| GET | /api/v1/analytics/overload | 🔒 |
| GET | /api/v1/analytics/performance-lab | 🔒 |
| GET | /api/v1/analytics/goal-drift | 🔒 |
| GET | /api/v1/analytics/workout-recommendations | 🔒 |
| GET | /api/v1/analytics/nutrition-recommendations | 🔒 |

### AI Gateway
| Method | Path | Access |
|---|---|---|
| POST | /api/v1/ai/chat | 🔒 |
| POST | /api/v1/ai/meal-analysis | 🔒 |
| POST | /api/v1/ai/workout | 🔒 |
| POST | /api/v1/ai/nutrition | 🔒 |
| POST | /api/v1/ai/recommendations | 🔒 |
| GET | /api/v1/ai/insights | 🔒 |

### Dashboard & Health
| Method | Path | Access |
|---|---|---|
| GET | /api/v1/dashboard | 🔒 |
| GET | /api/v1/health | Public |

---

## 25. Glossary

| Term | Definition |
|---|---|
| **Access Token** | Short-lived JWT (15 min) for API auth; kept in memory only — never localStorage |
| **Refresh Token** | Long-lived JWT (7 days) in HTTP-only signed cookie; silently renews access tokens |
| **Token Rotation** | Every /refresh call revokes the old token and issues a brand-new one |
| **Token Family** | Group of refresh tokens sharing a amily_id; enables reuse detection |
| **Reuse Detection** | Presenting a revoked token triggers revocation of the entire token family |
| **RPE** | Rate of Perceived Exertion — 1–10 scale for workout intensity |
| **JSONB** | PostgreSQL binary JSON column; stores flexible exercise and meal arrays |
| **Protective Mode** | Injury guard state reducing load recommendations when active injury logs exist |
| **OPTIMAL Mode** | Injury guard state when no logs exist — full unrestricted training |
| **OpenRouter** | AI gateway unifying 100+ LLMs behind a single OpenAI-compatible API |
| **BullMQ** | Redis-backed job queue; pre-configured for async AI generation and notifications |
| **Socket.IO** | WebSocket library for real-time bidirectional events (future features) |
| **Silent Refresh** | Automatic background token renewal 60s before expiry — zero user interaction |
| **Session Restoration** | On page load, app calls /auth/refresh to restore login state from cookie |
| **PWA** | Progressive Web App — delivers native-like mobile experience from a browser |
| **Barrel Export** | index.ts/js that re-exports all module members for clean import paths |
| **Controller** | Express handler: reads HTTP input, delegates all logic to the Service |
| **Service** | Business logic layer: orchestrates repositories and AI service calls |
| **Repository** | Data access layer: all parameterized SQL queries against PostgreSQL |
| **DTO** | Data Transfer Object — typed interface for request/response shapes |
| **ApiError** | Custom error class with static factories: badRequest, unauthorized, notFound, etc. |
| **ApiResponse** | Wraps all API responses in { success, message, data, statusCode } |
| **HMR** | Hot Module Replacement — Vite in-browser module updates without full reload |
| **Unified Dashboard** | Single endpoint aggregating all dashboard data via parallel Promise.all() |
| **Optimistic Update** | State updated immediately before server confirms; reconciled on response |
| **BroadcastChannel** | Browser API for cross-tab messaging; drives multi-tab auth sync |
| **Connection Pool** | Reused set of DB connections; avoids per-request connection overhead |
| **Stale-While-Revalidate** | Serve cached data instantly, then refetch in background |
| **Monorepo** | Single repo containing both ackend/ and rontend/ packages |
| **Day Map** | Weekday-to-muscle-group mapping in getDailyWorkout() |
| **Home Summary** | Aggregated readiness score, recent sessions, and recommendation for the home screen |

---

*End of FitAI X Project Documentation — v1.0.0*
