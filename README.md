# School of Freedom · sof.ai

The digital home of **Movement Thinking** — a unifying gateway to specialised
educational pathways designed to liberate human potential.

This repository powers https://sof.ai. It is the apex over the apex: it sits
above two sister schools and lets a single named member move freely between
them.

## The architecture

```
        sof.ai (this repo)               <- gateway / manifesto / Pioneers
         /            \
The VR School      The AI School         <- two sister schools, two URLs,
www.thevrschool.org   ai.thevrschool.org    one identity
```

Both sister schools run their own apps; this repo is intentionally small —
its job is the manifesto, the founder, the application funnel, and the
public student profile. Auth and the user database are shared with the
existing AI School backend (NextAuth + Postgres) so a Pioneer is one
identity across all three sites.

## Stack

- **Next.js 14** App Router · TypeScript
- **Tailwind v4** (paper-cream + emerald + orange + amber)
- **Geist Sans / Mono** for body, **Instrument Serif** for editorial headlines
- **NextAuth** (planned, next PR) — same `NEXTAUTH_SECRET` as `sof-ai-repo`
  so a Pioneer signed in on one site is the same Pioneer everywhere.
- **Postgres** (planned, next PR) — reuses the existing AI School database
  so applications and approved profiles flow into the same schema students
  already have.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Manifesto landing — Hero, Movement Thinking, Founder, sister-school cards |
| `/founder` | Dr. Freedom Cheteni's deep profile + timeline |
| `/students` | Directory of approved Pioneers |
| `/[slug]` | Individual Pioneer profile (manifesto · projects · tags) |
| `/apply` | Multi-step application form |
| `/admin` _(planned)_ | Approval dashboard for the trio |
| `/settings` _(planned)_ | Logged-in Pioneer self-service editor |

## Local dev

```bash
pnpm install
pnpm dev
```

The site runs on `http://localhost:3000`. There's no required env config
for the marketing surface; auth + database wiring lands in the next PR
and brings its own `.env.example`.

## Liquid routing

The navbar's "context label" tracks the page — `Movement` on the home,
`The Architect` on `/founder`, `Pioneer` on `/[slug]`, etc. This is a
quiet incarnation of the Contextual Navigation idea from the brief: the
gateway feels alive to where the visitor is reading.

## Brand

Cream paper · deep emerald · warm orange · amber gold. Editorial serif
headlines for the manifesto register; clean Geist sans for everything
else. The two sister schools each get their own gradient on `/` so the
gateway never flattens them into a single voice.


## Repository map

### Web app (Next.js / TypeScript)
- `app/`: App Router pages and API routes (site pages, auth, admin, chat, uploads).
- `components/`: UI, layout, and section-level building blocks.
- `lib/`: shared business logic (auth, SSO bridge, site config, profile utilities).
- `types/`: TypeScript type augmentations (for example NextAuth).

### API service (FastAPI / Python)
- `src/sof_ai_api/main.py`: FastAPI entrypoint and router mounting.
- `src/sof_ai_api/routes/`: endpoint modules (health, progress, wallet, journals, challenges, pioneer applications).
- `src/sof_ai_api/models.py`: SQLModel entities and constraints.
- `src/sof_ai_api/ledger.py`: points/ledger domain logic.
- `src/sof_ai_api/integrations/`: external integrations (including OJS adapter/client).

### Infra and tooling
- `Dockerfile`: container build definition.
- `fly.toml`: Fly.io deploy configuration.
- `pyproject.toml`: Python package and dependency settings.
- `package.json`: Node scripts and dependencies.

## Suggested next build targets
1. **Contract tests between Next API routes and FastAPI endpoints** to prevent regressions across the TS/Python boundary.
2. **End-to-end auth flow tests** (magic link + SSO handoff/signout) to harden enrollment onboarding.
3. **Observability baseline** (request IDs, structured logs, health/readiness checks, error budget alerts).
4. **Data lifecycle docs** for progress/enrollment and ledger mutations to simplify contributor onboarding.



## Vercel deployment (CI/CD)

This repo now includes `.github/workflows/vercel-deploy.yml` for automatic deployments:

- Pull requests to `main` create a **Preview** deployment.
- Pushes to `main` create a **Production** deployment.

Configure these GitHub repository secrets before enabling the workflow:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

You can get these values from your Vercel account/project settings and by running `vercel link` locally.
