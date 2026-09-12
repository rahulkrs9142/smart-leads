# 🚀 SmartLeads — Deployment & DevOps Guide

This guide outlines the production deployment strategy and DevOps architecture for the **SmartLeads** Lead Management Platform.

---

## 🏛️ Architecture Overview

The system utilizes a modern decoupled cloud architecture:

```
                      ┌─────────────────────────────────┐
                      │          End Users              │
                      └──────────────┬──────────────────┘
                                     │ HTTPS
                                     ▼
                      ┌─────────────────────────────────┐
                      │   Frontend Client (React/Vite)  │
                      │         Hosted on Vercel        │
                      └──────────────┬──────────────────┘
                                     │ REST API (JSON/JWT)
                                     ▼
                      ┌─────────────────────────────────┐
                      │   Backend API (Express/Node.js) │
                      │      Containerized on Render    │
                      └──────────────┬──────────────────┘
                                     │ Mongoose Driver
                                     ▼
                      ┌─────────────────────────────────┐
                      │       Database Cluster          │
                      │        MongoDB Atlas            │
                      └─────────────────────────────────┘
```

---

## ☁️ 1. Backend Deployment (Render)

### Option A: Docker Deployment (Recommended)
1. Sign in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository: `rahulkrs9142/smart-leads`.
4. Configure service:
   - **Name**: `smartleads-api`
   - **Region**: Closest to your target users (e.g., Singapore / Oregon / Frankfurt)
   - **Root Directory**: `server`
   - **Environment**: `Docker`
   - **Dockerfile Path**: `./Dockerfile`
   - **Docker Context**: `.`
5. Configure Environment Variables:
   | Variable | Value |
   |----------|-------|
   | `PORT` | `5000` |
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/smart-leads?retryWrites=true&w=majority` |
   | `JWT_SECRET` | Strong randomly generated 64-character secret |
   | `JWT_EXPIRES_IN` | `7d` |
   | `CLIENT_URL` | `https://smart-lead-client.vercel.app` (or your custom frontend domain) |
6. Health Check Path: `/api/health`
7. Click **Create Web Service**.

---

## ⚡ 2. Frontend Deployment (Vercel)

1. Sign in to [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** → **Project**.
3. Import your GitHub repository: `rahulkrs9142/smart-leads`.
4. Configure Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Configure Environment Variables:
   | Variable | Value |
   |----------|-------|
   | `VITE_API_URL` | `https://<your-render-service>.onrender.com/api` |
6. Click **Deploy**.

> 💡 **SPA Routing**: The included [`client/vercel.json`](file:///client/vercel.json) handles client-side routing rewrites so page reloads on routes like `/leads` and `/dashboard` never result in 404 errors.

---

## 🐳 3. Local Production Simulation (Docker Compose)

To test the entire production stack locally:

```bash
# Clone the repository
git clone https://github.com/rahulkrs9142/smart-leads.git
cd smart-leads

# Run all containers
docker-compose up --build -d

# Verify running containers
docker-compose ps

# View live logs
docker-compose logs -f
```

| Service | Port | Endpoint |
|---------|------|----------|
| Frontend Client | `3000` | http://localhost:3000 |
| Backend API | `5000` | http://localhost:5000/api/health |
| MongoDB Engine | `27017` | localhost:27017 |

---

## 🔄 4. CI/CD Automation (GitHub Actions)

A continuous integration workflow is configured in [`.github/workflows/ci.yml`](file:///.github/workflows/ci.yml):
- Automatically triggers on every push and pull request to `main`.
- Validates backend and frontend TypeScript builds.
- Prevents breaking changes from merging into production.
