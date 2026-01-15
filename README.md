# Pravah AI 🌊  
AI-Powered Multi-Agent Customer Support System

Pravah AI is a full-stack, AI-powered customer support system built with a
**deterministic, multi-agent backend architecture**. The system prioritizes
**backend correctness, explainability, and extensibility** over prompt-centric
or UI-heavy implementations.

The core idea is simple: routing, decision-making, and data access are
**backend-controlled**, while the LLM is used strictly as a **response renderer**
with token-level streaming.

---

## 🎯 Design Philosophy

This project prioritizes:
- Deterministic backend behavior
- Clear separation of concerns
- Explainable agentic flows
- Testable business logic independent of HTTP or LLMs

UI and deployment are intentionally kept minimal to keep the focus on backend
architecture and system design.

---

## ✨ Key Features

- Multi-agent architecture (Support, Order, Billing)
- Deterministic router with pluggable strategies
- Real database-backed tools (PostgreSQL + Prisma)
- Conversation and message persistence
- Token-level streaming responses
- Clean Controller → Service → Domain layering
- Mock LLM streaming (default) with optional Gemini support
- Monorepo with shared types (Hono RPC)

---

## 🧠 Architecture Overview

Pravah AI follows a strict separation of concerns:

User Request
↓
Controller (Hono)
↓
Chat Service (Orchestrator)
↓
Router (Strategy-based)
↓
Agent (Support | Order | Billing)
↓
Tools (Database access via Prisma)
↓
Structured Result
↓
LLM Renderer (Mock / Gemini)
↓
Streaming Response
↓
Frontend (ReadableStream)


### Core Design Principles

- Routing is deterministic, not generative
- Agents do not generate free-form text
- LLMs are renderers, not decision-makers
- Business logic is testable without HTTP or AI
- Streaming is implemented at the service layer

---

## 🧱 Backend Architecture

### Controllers (Hono)
- Handle HTTP transport only
- Validate inputs
- Delegate to services
- No business logic

### Services
- Central orchestration layer
- Coordinates routing, agent execution, and persistence
- Owns streaming behavior

### Router
- Strategy-based design
- Default: intent-based deterministic router
- Extension points for LLM-based or ML-based routing

### Agents
- Support Agent
- Order Agent
- Billing Agent

Agents:
- Receive message and context
- Call tools
- Return structured results (not text)

### Tools
- Thin wrappers around database queries
- No business logic
- No awareness of routing or agents

### LLM Layer
- Pluggable providers
- Default: mock streaming renderer
- Optional: Gemini via Vercel AI SDK
- Used only for rendering structured results

---

## 🛠 Tech Stack

### Frontend
- React
- Vite
- Native Fetch + ReadableStream

### Backend
- Hono.dev
- Prisma ORM
- PostgreSQL (Neon or local)

### AI
- Vercel AI SDK
- Gemini (optional)
- Mock streaming provider (default)

### Monorepo
- Turborepo
- End-to-end type sharing via Hono RPC

---

## 🔌 API Endpoints

### Chat
- POST `/api/chat/messages`
- POST `/api/chat/messages/stream`
- GET `/api/chat/conversations`
- GET `/api/chat/conversations/:id`
- DELETE `/api/chat/conversations/:id`

### Agents
- GET `/api/agents`
- GET `/api/agents/:type/capabilities`

### Health
- GET `/api/health`

---

## ✨ Streaming Design

- Token-level streaming using `ReadableStream`
- Streaming handled inside the service layer
- Controllers remain transport-only
- Frontend renders tokens incrementally with a “Thinking…” indicator

This ensures streaming does not leak into business logic and LLM providers can
be swapped without architectural changes.

---

## 🏃‍♂️ Running Pravah AI Locally

This project is a monorepo containing both backend and frontend.  
They are designed to be run together locally to preserve end-to-end type safety
(Hono RPC) and streaming behavior.

---

### ✅ Prerequisites

- Node.js ≥ 18
- pnpm
- PostgreSQL (Neon, local Postgres, or hosted)

---

### 📦 Clone the Repository

```bash
git clone <repo-url>
cd pravah-ai

📥 Install Dependencies

From the repo root:

pnpm install


This installs dependencies for both frontend and backend using the workspace.

🗄 Database Setup
Configure Environment Variables

Create a file at:

apps/backend/.env


Add:

DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>?sslmode=require


Any PostgreSQL-compatible database works.

Run Prisma Migrations
cd apps/backend
pnpm prisma migrate deploy

Seed the Database
pnpm prisma db seed


This seeds:

A demo user

A demo conversation

Sample orders and billing data

These are used by the frontend for demo purposes.

🚀 Start the Backend

From apps/backend:

pnpm dev


Backend runs at:

http://localhost:3001


Verify with:

curl http://localhost:3001/api/health

💬 Start the Frontend

In a new terminal:

cd apps/frontend
pnpm dev


Frontend runs at:

http://localhost:5173

🧪 Using the App

Open http://localhost:5173

Type a message such as:

Where is my order?


You will observe:

Deterministic routing to the Order Agent

Real database-backed data access

Token-level streaming response

🧠 Demo User & Conversation

For simplicity, the frontend bootstraps a pre-seeded demo user and conversation.

This avoids adding authentication or user management logic and keeps the focus on:

Backend architecture

Agent design

Routing logic

Streaming behavior

In a production system, these identifiers would come from an auth/session layer.

🧩 Notes on Architecture

Frontend and backend are intended to be run together locally

Hono RPC is used for shared types in the monorepo

LLMs are used only for response rendering

All routing and tool usage are backend-controlled

🚀 Future Improvements

LLM- or ML-based routing strategies

Context compaction for long conversations

Authentication and authorization

Rate limiting and observability

Production deployment setup

🎥 Demo

A 2–5 minute Loom walkthrough accompanies this project, covering:

Architecture and design decisions

Routing and agent flow

Streaming behavior

Live frontend demo


---

## 🧪 Demo User & Conversation

For simplicity, the frontend bootstraps a demo user and conversation
that are pre-seeded in the database.

This avoids adding authentication or user management logic, keeping
the focus on backend architecture and agent design.

In a production system, these identifiers would come from an auth
session or user context.


### ✅ This file is:
- GitHub-render safe
- Markdown-clean
- Reviewer-friendly
- Architecturally strong
- Free of breaking artifacts
