# Deployment Checklist

## Security
- [ ] Rotate any leaked `MONGO_URI` credentials.
- [ ] Rotate `JWT_SECRET`.
- [ ] Confirm no secrets are committed (`server/.env`, `client/.env.local` are ignored).

## Backend (Render)
- [ ] Service created from GitHub repo.
- [ ] Root directory is `server`.
- [ ] Build command is `npm install`.
- [ ] Start command is `npm start`.
- [ ] Env vars set: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URLS`, `NODE_ENV=production`.
- [ ] Backend URL responds on `/`.
- [ ] Health endpoint responds on `/healthz`.
- [ ] Render logs show successful MongoDB connection.

## Frontend (Netlify)
- [ ] Site created from same GitHub repo.
- [ ] Base directory is `client`.
- [ ] Build command is `npm run build`.
- [ ] Publish directory is `dist`.
- [ ] Env var set: `VITE_API_URL=<render-backend-url>`.
- [ ] Deployment succeeds without build errors.
- [ ] React routes work on refresh/direct URL access.

## Integration Validation
- [ ] Register new user.
- [ ] Verification email received.
- [ ] Email verification link opens `/verify-email` and succeeds.
- [ ] Login/logout.
- [ ] Google login works.
- [ ] Product list pagination loads.
- [ ] Add/remove cart items.
- [ ] Place order.
- [ ] Orders page loads with history.
- [ ] No CORS errors in browser console.
