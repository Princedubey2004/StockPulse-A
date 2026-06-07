# StockPulse AI 📈

StockPulse AI is a modern, real-time, AI-powered fintech dashboard designed to provide users with seamless portfolio tracking, live market data, instantaneous price alerts, and intelligent financial news analysis.

![Dashboard Preview](./screenshots/dashboard-preview.png) *(Note: Add screenshot here)*

## 🚀 Features

- **Real-Time Market Engine:** A highly optimized market simulator that pushes live ticker data to the frontend via Socket.io and caches global state in Redis.
- **AI-Powered News Analysis:** Integrates directly with Google's Gemini 2.5 Flash to summarize financial news, classify market sentiment, and extract investment insights and risk factors.
- **Event-Driven Price Alerts:** A robust Redis Pub/Sub architecture allows users to set target price alerts and receive real-time notifications when market thresholds are crossed.
- **Portfolio Management:** Track active positions, compute real-time invested values, and visualize asset allocations and sector distributions via beautiful `Recharts` metrics.
- **Modular & Scalable Backend:** Built with a Domain-Driven Design using Repository and Service patterns, strictly typed with TypeScript, and fortified with Zod validation, rate-limiting, and centralized error handling.

## 🛠 Tech Stack

**Frontend:**
- React 18 + Vite
- TypeScript
- Tailwind CSS (Premium Dark Theme UI)
- Lucide React (Icons)
- Recharts (Interactive Analytics)
- Socket.io-client

**Backend:**
- Node.js & Express
- TypeScript
- Socket.io (WebSockets)
- Redis (Pub/Sub & Global Caching)
- Prisma ORM (Database access)
- PostgreSQL (Historical snapshots & User data)
- Google GenAI API (Gemini Integration)
- Zod (Input Validation)
- Morgan (Logging) & Express-Rate-Limit

## 🏗 Architecture Diagram

```text
React Frontend
      │
Socket.io
      │
API Gateway
      │
 ┌───────────────┐
 │ Express APIs  │
 └───────────────┘
      │
Redis Pub/Sub
      │
 ┌───────────────┐
 │ Alert Service │
 └───────────────┘
      │
PostgreSQL
      │
Gemini AI Service
```

## 🔌 Core API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Backend system health check. |
| `POST` | `/api/portfolio` | Add a new holding to the user's portfolio. |
| `GET` | `/api/portfolio` | Retrieve the user's active holdings. |
| `POST` | `/api/alerts` | Create a new price target alert (`ABOVE` or `BELOW`). |
| `GET` | `/api/alerts` | Fetch all active alerts for the user. |
| `GET` | `/api/ai/insights/:symbol` | Fetch AI-generated sentiment and news summaries for a stock. |

## 🚀 Deployment Steps

### 1. Prerequisites
- Node.js (v18+)
- Redis Server (Running locally or via Docker)
- PostgreSQL Database
- Google Gemini API Key

### 2. Backend Setup
```bash
cd backend
npm install
```

Configure your environment variables in `backend/.env`:
```env
PORT=3000
FRONTEND_URL=http://localhost:5173
DATABASE_URL="postgresql://user:password@localhost:5432/stockpulse"
REDIS_URL="redis://localhost:6379"
GEMINI_API_KEY="your-gemini-api-key"
```

Initialize the database schema:
```bash
npx prisma generate
npx prisma db push
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Start the frontend:
```bash
npm run dev
```

Visit `http://localhost:5173` to view the application!

## 📸 Screenshots

- **Portfolio Analytics:**
  ![Portfolio](./screenshots/portfolio.png) *(Note: Add screenshot here)*

- **AI Sentiment Analysis:**
  ![AI Insights](./screenshots/ai-insights.png) *(Note: Add screenshot here)*
