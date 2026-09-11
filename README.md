# 🚀 SmartLeads — Lead Management Dashboard

<div align="center">

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-smart--lead--client.vercel.app-6366f1?style=for-the-badge)](https://smart-lead-client.vercel.app)

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
git clone https://github.com/Amcodeit/smart-lead.git
cd smart-lead
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

<div align="center">

Built with ❤️ by [Amcodeit](https://github.com/Amcodeit)

</div>
