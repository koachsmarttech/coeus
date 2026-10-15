# Coeus

AI-powered data collection and analytics. People submit incident reports, inspections, and community feedback; the platform validates every field, quarantines anything that fails, then turns accepted records into dashboards, weekly briefs, and a permission-scoped “ask a question” chat.

Coeus never lets the model do the math. Counts and trends are calculated first. Grok only narrates those facts.

## What you can do

| Role          | Can                                                                                           |
| ------------- | --------------------------------------------------------------------------------------------- |
| **Submitter** | File a form or CSV, see own status, ask about own filings                                     |
| **Analyst**   | Dashboard, drill-down, briefs, chat on **accepted** records only (no export, no pending/raw)  |
| **Admin**     | Everything an analyst can do, plus users, form rules, quarantine, feeds, AI spend, CSV export |

The first account created on a fresh database is **admin**. Later accounts start as submitters; an admin can change roles.

## Run it locally

### Requirements

- **Node.js 22+**
- **npm** (comes with Node)

Postgres is optional. With no `DATABASE_URL`, Coeus uses an embedded [PGLite](https://pglite.dev/) database (in-memory). Real AI (summaries, chat, voice) needs an [xAI](https://x.ai) API key; without it, rule-based review still runs and chat falls back to a facts-only narrative.

### 1. Install

```bash
git clone <this-repo>
cd <this-repo>
npm install
```

### 2. Environment (optional)

Do **not** commit secrets. Export variables in your shell (or a local-only `.env` you keep off git).

| Variable             | Required?       | Purpose                                                                                        |
| -------------------- | --------------- | ---------------------------------------------------------------------------------------------- |
| `DATABASE_URL`       | No              | Postgres connection string. Unset → PGLite (data is wiped when the process exits).             |
| `XAI_API_KEY`        | No              | Real Grok summaries, chat, and text-to-speech. Unset → rule-based review + facts-only answers. |
| `BETTER_AUTH_SECRET` | Production only | Session signing secret. The template generates one in development.                             |
| `BETTER_AUTH_URL`    | Production only | Public origin, e.g. `http://localhost:8080`.                                                   |

Example:

```bash
export DATABASE_URL="postgres://USER:PASSWORD@localhost:5432/Coeus"
export XAI_API_KEY="xai-..."
```

Auth is **on**. Sign-in methods:

- Google and X (via the Grok auth broker — works in the hosted preview)
- Email + password (works fully on your machine)

### 3. Start the app

```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080).

1. Click **Sign in**.
2. Create an email account (min 8-character password) **or** continue with Google / X.
3. You land as **admin** if you are the first user.
4. Seeded demo filings (incidents, feedback, inspections across five regions) load on first request — give it a few seconds.

### 4. Useful scripts

```bash
npm run dev          # development server on 0.0.0.0:8080
npm run build        # production build + apply SQL migrations
npm run typecheck    # TypeScript
npm run preview      # serve the production build (after npm run build)
```

If you pointed `DATABASE_URL` at Postgres, `npm run build` (or `npm run db:migrate`) applies:

- `migrations/0001_auth.sql` — Better Auth tables
- `migrations/0002_schema.sql` — Coeus tables (profiles, forms, submissions, summaries, chat, audit)

### Try this on a fresh install

1. **Admin dashboard** — volume, region mix, satisfaction, quarantine-rate alert, weekly brief.
2. **View as → Submitter** (top bar) — file an incident; leave “What happened” short to see live validation; upload `public/samples/incident-sample.csv`.
3. **Quarantine** — failed and duplicate rows sit here until you accept or reject them. Nothing is dropped.
4. **Ask Coeus** — “Which region had the most filings?” Answers cite record ids; Listen reads them aloud when `XAI_API_KEY` is set.
5. **Admin → People** — promote a second account to Analyst to confirm they cannot export or open pending records.
6. **Admin → Automated feed** — paste a JSON array of field objects to ingest from another system.

## Architecture (short)

- **App:** React 19, TanStack Start / Router, Tailwind v4, Recharts
- **Auth:** Better Auth — Google, X, email/password
- **Data:** Postgres (Neon in production) or PGLite locally
- **AI:** xAI `grok-4.5` (configurable). Facts are computed in SQL/JS; the model only writes prose. Token usage and estimated cost are logged for admins.

## Roles (product rules)

- Analysts never see `pending_review` or `quarantined` records — not in the dashboard, not in chat, not by guessing an id.
- Export is admin-only.
- Chat is scoped: submitters → own filings; analysts → accepted records; admins → operations including AI spend.
