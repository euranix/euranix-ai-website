# Euranix AI — Website

**Controlled release: AI deployed; 129 public checks and both genuine origin acceptances, assignment and human-confirmed inbox/format checks passed. AI replay remains unverified after browser closure and the Computer Use URL-verification stop; final release validation remains open.** [Current evidence and release record](docs/release-candidate/RELEASE-RECORD.md). [Deployment and rollback](docs/release-candidate/DEPLOYMENT.md) supersede the generic hosting guide below.

Marketing site for [euranix.ai](https://euranix.ai). Built with React + Vite, served via Nginx in a multi-stage Docker image.

---

## Tech stack

| Layer | Tool |
|---|---|
| Frontend | React 18 + TypeScript |
| Build | Vite 5 |
| Server | Nginx (Alpine) |
| Container | Docker (multi-stage) |
| Deployment | Coolify |

---

## Local development

**Requirements:** Node 22.13+ (Docker builder uses Node 22 Alpine).

```bash
npm install
npm run dev          # http://localhost:5173
```

**Production build (test locally):**

```bash
npm run build        # outputs to dist/
npm run preview      # http://127.0.0.1:4374 (loopback only, noindex)
```

---

## Deploying with Coolify

Coolify manages its own reverse proxy (Traefik) and SSL automatically.  
You do **not** need to configure ports, Traefik labels, or TLS yourself.

### 1 — Push the repo to Git

Make sure the repository (GitHub, GitLab, or Gitea) is accessible from your Coolify instance.

### 2 — Create a new resource in Coolify

1. Open your Coolify dashboard.
2. Go to **Projects** → select or create a project.
3. Click **+ New Resource** → **Docker Compose**.
4. Connect your Git repository and select the branch to deploy (e.g. `main`).

### 3 — Configure the resource

| Setting | Value |
|---|---|
| Build pack | **Docker Compose** |
| Docker Compose file | `docker-compose.yml` (default) |
| Port | `80` (Coolify reads `expose: "80"` automatically) |
| Domain | Add your domain (e.g. `euranix.ai`) — Coolify provisions SSL via Let's Encrypt |

> **No manual port mapping needed.** Coolify's Traefik proxy routes traffic to the container's internal port 80.

### 4 — Deploy

Click **Deploy**. Coolify will:

1. Clone the repo.
2. Build the Docker image using the multi-stage `Dockerfile`.
3. Start the container and wire it up through Traefik with HTTPS.

Subsequent pushes to the tracked branch trigger automatic redeployments if you enable **Auto Deploy** in the resource settings.

---

## Project structure

```
.
├── index.html          # Vite HTML entry point
├── index.tsx           # React root
├── App.tsx             # Full single-page app
├── App.css             # Styles
├── index.css           # Base reset
├── vite.config.ts      # Vite config
├── tsconfig.json       # TypeScript config
├── Dockerfile          # Multi-stage build (Node → Nginx)
├── docker-compose.yml  # Coolify / local compose
├── nginx.conf          # Nginx SPA config with gzip + cache
└── package.json
```

---

## How the Docker image works

```
Stage 1 — builder (node:18)
  npm ci
  npm run build  →  dist/

Stage 2 — server (nginx:stable-alpine)
  COPY dist/       →  /usr/share/nginx/html
  COPY nginx.conf  →  /etc/nginx/conf.d/default.conf
  EXPOSE 80
```

The Nginx config:
- Serves the React SPA with `try_files` (handles client-side routing).
- Enables gzip for HTML, CSS, and JS.
- Sets `Cache-Control: public, immutable` with a 1-year expiry on all static assets (hashed filenames from Vite ensure safe long-caching).

---

## Environment variables

This project has no runtime environment variables. All configuration is baked in at build time. If you need to add any in the future, set them as **Build Variables** in Coolify (they are injected during `npm run build`).
