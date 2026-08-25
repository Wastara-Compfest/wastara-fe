# Wastara Frontend — Operator Dashboard

Next.js dashboard for **Wastara**, a garment-defect inspection system. Talks only to `wastara-be` (REST + WebSocket) — it never calls the model service (`wastara-model`) directly.

```text
wastara-fe (Next.js)  ──REST + WebSocket──▶  wastara-be (Hono)  ──internal API──▶  wastara-model (FastAPI)
```

Screens: live camera/video inspection, review queue (confirm/reject anomalies), defect table + detail, analytics.

---

## Related repos

| Repo | Role |
|------|------|
| [wastara-be](https://github.com/Wastara-Compfest/wastara-be) | API this frontend talks to (defects, verification, camera proxy, WebSocket) |
| [wastara-model](https://github.com/Wastara-Compfest/wastara-model) | Detection/tracking/defect pipeline (Python, called by `wastara-be`, not directly by this app) |

---

## Stack

| Tool | Role |
|------|------|
| Next.js 16 (App Router) | UI, routing |
| React 19 | Components |
| Tailwind CSS v4 | Styling |
| sonner | Toast notifications |
| recharts | Analytics charts |

---

## Setup without Docker

Requires Node.js 22+ and a running `wastara-be` (see that repo's README).

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL to your wastara-be URL
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Setup with Docker

```bash
docker compose up --build
```

Builds a production Next.js image and serves it on `http://localhost:3000`. `NEXT_PUBLIC_API_URL` is baked in **at build time** (Next.js inlines `NEXT_PUBLIC_*` vars into the client bundle) — if `wastara-be` isn't on `localhost:8000`, set it before building:

```bash
NEXT_PUBLIC_API_URL=http://your-backend-host:8000 docker compose up --build
```

This repo's `docker-compose.yml` only runs the frontend — `wastara-be` (and its own Postgres) is a separate repo/compose stack, started independently.

---

## Environment variables

| Variable | Default (`.env.example`) | Keterangan |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Base URL of `wastara-be` (REST + derives the `/ws/live` WebSocket URL) |
| `NEXT_PUBLIC_INSPECTION_SOURCE` | `data/input/videos/demovid.mp4` | Default camera source sent to `/camera/start` — `webcam` for a real camera, or a video path (relative to `wastara-model`) to run without physical hardware |

---

## Scripts

| Script | Fungsi |
|---|---|
| `npm run dev` | Dev server with hot-reload |
| `npm run build` | Production build (also used by the Docker image) |
| `npm start` | Serve a production build (non-Docker) |
| `npm run lint` | ESLint |

---

## Key features

- **Live view** — start/stop camera inspection, live annotated preview over WebSocket, plus an **upload-video** mock-data path: upload a clip, watch it run through the real detection pipeline (Uploading → Inspecting → toast on completion), no camera hardware required.
- **Review queue** — confirm/reject pending anomalies detected from either the live camera or an uploaded video.
- **Defect table & detail** — full history with evidence images, filters, and status.
- All timestamps are rendered in **Asia/Jakarta (WIB)**.
