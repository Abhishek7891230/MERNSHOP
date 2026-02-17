# MERNSHOP Deployment Guide (Render + Netlify)

This guide deploys:
- Backend (`server/`) to Render
- Frontend (`client/`) to Netlify
- Database on MongoDB Atlas (already created)

## 1. Pre-Deployment Security and Git Setup

1. Your `server/.env` currently contains real secrets.
2. Before pushing to GitHub, rotate these values in MongoDB Atlas and JWT:
   - `MONGO_URI` user/password
   - `JWT_SECRET`
3. Keep using local env files for development:
   - `server/.env`
   - `client/.env.local`
4. Confirm ignores are active:
   - `server/.env` ignored
   - `client/.env.local` ignored
   - `node_modules` ignored

## 2. Backend Deployment on Render

### 2.1 Push code to GitHub

From repo root:

```bash
git add .
git commit -m "Prepare MERNSHOP for Render + Netlify deployment"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2.2 Create Render Web Service

1. Go to Render Dashboard.
2. Click `New +` -> `Web Service`.
3. Connect your GitHub repo.
4. Configure:
   - `Root Directory`: `server`
   - `Environment`: `Node`
   - `Build Command`: `npm install`
   - `Start Command`: `npm start`

### 2.3 Add Render environment variables

Set these in Render -> Service -> `Environment`:

- `MONGO_URI` = your Atlas URI
- `JWT_SECRET` = strong random secret
- `CLIENT_URLS` = `https://your-netlify-site.netlify.app,https://your-custom-domain.com`
- `NODE_ENV` = `production`

Do not set `PORT` on Render (Render injects it automatically).

### 2.4 Deploy and validate backend

After first deploy, test:

- `GET https://<your-render-service>.onrender.com/`
- `GET https://<your-render-service>.onrender.com/healthz`

Both should return success (`API is running...` and JSON health status).

## 3. Frontend Deployment on Netlify

`netlify.toml` is already added at repo root and configured for `client/` build.

### 3.1 Create Netlify site

1. Go to Netlify Dashboard.
2. Click `Add new site` -> `Import an existing project`.
3. Connect GitHub repo.
4. Build settings:
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `dist`

### 3.2 Add Netlify environment variable

Netlify -> Site settings -> `Environment variables`:

- `VITE_API_URL` = `https://<your-render-service>.onrender.com`

### 3.3 Deploy and validate frontend

1. Trigger deploy.
2. Open deployed Netlify URL.
3. Verify:
   - Signup/Login works
   - Products load
   - Cart and Orders endpoints work
   - Directly opening routes (for example `/products`) works

SPA route fallback is handled by:
- `client/public/_redirects`
- `netlify.toml` redirects

## 4. CORS and Cross-Origin Notes

Backend now accepts multiple origins using `CLIENT_URLS` (comma-separated).  
Example:

```env
CLIENT_URLS=https://your-site.netlify.app,https://yourdomain.com
```

Local development can still use:
- `http://localhost:5173`
- `http://localhost:3000`

## 5. Common Production Checks

1. MongoDB Atlas Network Access:
   - Add `0.0.0.0/0` (or tighter allowlist) for cloud connections.
2. MongoDB Atlas DB user:
   - Ensure credentials in `MONGO_URI` are valid.
3. Render logs:
   - Confirm `MongoDB Connected` on startup.
4. Browser console:
   - Check for CORS errors.
5. API base URL:
   - Verify Netlify `VITE_API_URL` points to Render backend.

## 6. Redeploy Flow

1. Make local code changes.
2. Commit and push to GitHub.
3. Render and Netlify auto-deploy from the connected branch.
4. Re-test key user flows after each deployment.
