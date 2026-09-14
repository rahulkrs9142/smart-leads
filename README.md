# 🚀 SmartLeads — Lead Management Dashboard

<div align="center">

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-smart--lead--client.vercel.app-6366f1?style=for-the-badge)](https://smart-lead-client.vercel.app)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/rahulkrs9142/smart-leads/actions)
[![Release](https://img.shields.io/badge/Release-v1.0.0-6366f1.svg?style=for-the-badge)](https://github.com/rahulkrs9142/smart-leads/releases)
[![Postman](https://img.shields.io/badge/Postman-Collection_Ready-FF6C37?style=for-the-badge&logo=postman&logoColor=white)](./docs/SmartLeads.postman_collection.json)
[![API Docs](https://img.shields.io/badge/OpenAPI_3.0-Interactive_Docs-85EA2D?style=for-the-badge&logo=openapiinitiative&logoColor=black)](https://smart-leads-backend.onrender.com/api/docs)
[![Tests](https://img.shields.io/badge/Tests-Passing_25%2F25-success?style=for-the-badge&logo=node.js&logoColor=white)](https://github.com/rahulkrs9142/smart-leads)

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

</div>

---

A full-stack **Lead Management Dashboard** built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js) using **TypeScript** throughout. Features JWT authentication, role-based access control, advanced filtering, CSV export, and a premium glassmorphism UI.

---

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| **Frontend** | [smart-lead-client.vercel.app](https://smart-lead-client.vercel.app) |
| **Backend API** | Hosted on Render |
| **API Documentation** | `/api/docs` (Interactive OpenAPI 3.0 Reference) |
| **Database** | MongoDB Atlas |

> 💡 **Test Credentials** — Register a new account directly on the live site.

---

## ✨ Features

### Core
- **JWT Authentication** — Secure register/login with bcrypt password hashing
- **RBAC** — Admin and Sales User roles with permission-based access
- **Lead CRUD** — Create, Read, Update, Delete leads with validation
- **Advanced Filtering** — Filter by status, source, search by name/email — all combinable
- **Backend Pagination** — Proper skip/limit with metadata (10 per page)
- **Debounced Search** — 400ms debounce on search input
- **CSV Export** — Export filtered leads as CSV
- **Dark Mode** — System-preference-aware with manual toggle
- **Security & Rate Limiting** — Brute-force protection on auth endpoints + defensive security headers
- **Automated Tests** — Unit & integration test suites for Auth, RBAC, Validators, and Security
- **Interactive API Docs** — OpenAPI 3.0 specification rendered via Scalar at `/api/docs`

### UI/UX
- Premium glassmorphism design with gradient accents
- Responsive layout with collapsible sidebar
- Loading skeletons, empty states, and error handling
- Animated transitions and micro-interactions
- Toast notifications for all actions

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript, TailwindCSS v4, Vite |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | MongoDB + Mongoose |
| **Auth** | JWT + bcrypt |
| **Deployment** | Vercel (frontend) + Render (backend) + MongoDB Atlas |
| **DevOps** | Docker + Docker Compose |

---

## 📁 Project Structure

```
├── client/                    # React Frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/        # Reusable components
│   │   │   ├── layout/        # Layout component
│   │   │   └── leads/         # Lead-specific components
│   │   ├── context/           # Auth & Theme contexts
│   │   ├── hooks/             # Custom hooks (useDebounce)
│   │   ├── pages/             # Page components
│   │   ├── services/          # API service layer
│   │   ├── types/             # TypeScript interfaces
│   │   └── App.tsx
│   ├── vercel.json            # SPA routing config
│   ├── Dockerfile
│   └── nginx.conf
├── server/                    # Express Backend
│   ├── src/
│   │   ├── config/            # Database config
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Auth, RBAC, error handling
│   │   ├── models/            # Mongoose models
│   │   ├── routes/            # API routes
│   │   ├── types/             # TypeScript interfaces
│   │   ├── validators/        # Request validators
│   │   └── server.ts
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/rahulkrs9142/smart-leads.git
cd smart-leads
```

### 2. Setup Backend
```bash
cd server
cp ../.env.example .env    # Edit with your MongoDB URI & JWT secret
npm install
npm run dev
```

### 3. Setup Frontend
```bash
cd client
npm install
npm run dev
```

### 4. Docker Setup (Alternative)
```bash
docker-compose up --build
```
| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:5000 |
| MongoDB | localhost:27017 |

---

## ☁️ Deployment

This project is deployed using a split architecture:

| Part | Platform | Notes |
|------|----------|-------|
| **Frontend** | [Vercel](https://vercel.com) | Root dir: `client`, auto-deploys on push |
| **Backend** | [Render](https://render.com) | Docker-based, root dir: `server` |
| **Database** | [MongoDB Atlas](https://mongodb.com/cloud/atlas) | Free M0 cluster |

> 📖 **Full Guide**: For step-by-step instructions, Docker orchestration, and cloud configurations, refer to the [Deployment Guide](./DEPLOYMENT.md).

### Required Environment Variables

**Backend (Render):**
| Variable | Description |
|----------|-------------|
| `PORT` | `5000` |
| `NODE_ENV` | `production` |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Strong random secret |
| `JWT_EXPIRES_IN` | `7d` |
| `CLIENT_URL` | Your Vercel frontend URL |

**Frontend (Vercel):**
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Your Render backend URL + `/api` |

---

## 🔑 Environment Variables (Local)

Copy `.env.example` and configure:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/smart-leads` |
| `JWT_SECRET` | JWT signing secret | *(change in production!)* |
| `JWT_EXPIRES_IN` | Token expiration | `7d` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |

---

## 📡 API Documentation

> 📖 **Interactive Swagger / Scalar Documentation**: Visit `/api/docs` when running the backend to interactively explore and test all endpoints directly in the browser! Raw OpenAPI 3.0 specification is available at `/api/docs/openapi.json`.

### Auth Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user profile | Private |

### Lead Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/leads` | Get leads (paginated, filterable) | Private |
| GET | `/api/leads/:id` | Get single lead | Private |
| POST | `/api/leads` | Create new lead | Private |
| PUT | `/api/leads/:id` | Update lead | Private |
| DELETE | `/api/leads/:id` | Delete lead | Admin only |
| GET | `/api/leads/export/csv` | Export leads as CSV | Private |
| GET | `/api/leads/stats/overview` | Get dashboard stats | Private |
| GET | `/api/health` | Health check | Public |

### Query Parameters (GET /api/leads)

| Param | Type | Description |
|-------|------|-------------|
| `status` | string | Filter: `New`, `Contacted`, `Qualified`, `Lost` |
| `source` | string | Filter: `Website`, `Instagram`, `Referral` |
| `search` | string | Search by name or email |
| `sort` | string | `latest` (default) or `oldest` |
| `page` | number | Page number (default: 1) |
| `limit` | number | Records per page (default: 10) |

### Response Format
```json
{
  "success": true,
  "message": "Leads retrieved successfully.",
  "data": {
    "records": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalRecords": 48,
      "limit": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

## 👥 Role-Based Access

| Feature | Admin | Sales User |
|---------|-------|------------|
| View all leads | ✅ | ❌ (own only) |
| Create leads | ✅ | ✅ |
| Update leads | ✅ (all) | ✅ (own only) |
| Delete leads | ✅ | ❌ |
| Export CSV | ✅ | ✅ (own only) |
| Dashboard stats | ✅ (all) | ✅ (own only) |

---

## 🛠️ Development
 
```bash
# Backend (hot reload with ts-node)
cd server && npm run dev

# Frontend (Vite dev server)
cd client && npm run dev
```

---

## 🧪 Automated Testing

SmartLeads includes a fully automated unit and integration test suite written with the native Node test runner and TypeScript (`tsx --test`), guaranteeing fast and deterministic test execution without external bloat:

```bash
# Run all automated tests from root
npm test

# Run tests directly in server
cd server && npm test

# Run full CI check (backend build + frontend build + test suite)
npm run ci
```

### Test Coverage Highlights:
- **Auth & JWT Suite**: Token generation, verification, header parsing, expiry detection, and RBAC permission enforcement.
- **Request Validation Suite**: Schema validations, regex email constraints, minimum password complexities, and enum checks.
- **Security Middleware Suite**: Sliding window IP rate limiting, brute-force defense, and defensive security headers.
- **Health & Error Suite**: Health status metrics, custom error handler formats, Mongoose duplicate key handling, and 404 responses.

---

## 🛡️ Security Hardening

- **IP Rate Limiting**: Auth endpoints (`/api/auth/register`, `/api/auth/login`) are protected by an in-memory sliding-window rate limiter allowing a maximum of 30 requests per 15 minutes per IP.
- **Security Headers**: Standard defensive headers applied to all responses:
  - `X-Content-Type-Options: nosniff` (MIME sniffing prevention)
  - `X-Frame-Options: SAMEORIGIN` (Clickjacking prevention)
  - `X-XSS-Protection: 1; mode=block` (Cross-site scripting protection)
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Strict-Transport-Security` (HSTS enabled in production)
  - `X-Powered-By` header stripped to prevent tech stack fingerprinting.

---

## 📬 Postman API Collection

SmartLeads includes a ready-to-import Postman collection and environment for automated API exploration:

1. **Import Collection**: Open Postman -> Click **Import** -> Select [`docs/SmartLeads.postman_collection.json`](./docs/SmartLeads.postman_collection.json).
2. **Import Environment**: Select [`docs/SmartLeads.postman_environment.json`](./docs/SmartLeads.postman_environment.json).
3. **Auto-Auth Extraction**: Running the **Login User** request automatically extracts and sets `{{authToken}}` in your environment, allowing all subsequent private lead requests to execute seamlessly without manual copy-pasting.

---

## 🏥 Production Health Probes & Graceful Shutdown

For enterprise container deployments (Docker, Kubernetes, AWS ECS, Render):
- **Liveness Probe** (`GET /api/health/live`): Fast ping checking if container process is responsive.
- **Readiness Probe** (`GET /api/health/ready`): Deep check verifying MongoDB connection state (`readyState === 1`) before routing incoming network traffic.
- **Graceful Shutdown**: On receiving `SIGTERM` or `SIGINT`, the Express server finishes all in-flight requests, cleanly disconnects Mongoose, and terminates with exit code 0 to prevent dropped requests during rolling deployments.

---

## 📅 7-Day Engineering Roadmap

| Day | Date | Milestone & Focus | Status |
|:---:|:---:|---|:---:|
| **Day 1** | 08-Sep-2026 | Project Initialization, Express Configuration & MongoDB Atlas Setup | ✅ Complete |
| **Day 2** | 09-Sep-2026 | User Model, Password Hashing, JWT Authentication & RBAC Middleware | ✅ Complete |
| **Day 3** | 10-Sep-2026 | Lead CRUD APIs, Multi-Param Filtering, Pagination & CSV Export | ✅ Complete |
| **Day 4** | 11-Sep-2026 | React 19 Frontend Setup, Glassmorphism UI, Auth Pages & Lead Table | ✅ Complete |
| **Day 5** | 12-Sep-2026 | Docker Containerization, GitHub Actions CI/CD & Deployment Guide | ✅ Complete |
| **Day 6** | 13-Sep-2026 | Automated Testing Suite, Swagger/OpenAPI Docs & Security Hardening | ✅ Complete |
| **Day 7** | **14-Sep-2026** | **Production Readiness Probes, Postman Collection & v1.0.0 Release** | 🏆 **Complete** |

> 🎉 **All 7 Days Successfully Completed & Shipped!**

---

<div align="center">

Built with ❤️ by [Rahul Kumar](https://github.com/rahulkrs9142)

</div>
