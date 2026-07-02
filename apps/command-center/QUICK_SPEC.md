# LixenAI Launch Command Center — Quick Spec

**Tagline:** _You close. We build, deploy, and deliver._

A protected, operator-only command center that turns the LixenAI agency launch playbook into a trackable, copy-paste-ready operating system. It coordinates review, sign-off, and execution coordination for marketing automation work **without** sending messages, publishing workflows, spending on ads, or writing to any CRM.

---

## What it does (at a glance)

| Page | Route (hash) | Purpose |
| --- | --- | --- |
| Overview | `/` | Readiness KPIs, package selector, critical blockers, 14-phase summary, recent activity |
| Playbook | `/playbook` | All 14 launch phases (phase-0 → phase-13) with searchable/filterable checklist items, QA + mistakes callouts, copy buttons |
| Launch Tracker | `/tracker` | 15 seeded tracker items with status/owner/due-date editing, overdue detection |
| Copy Library | `/library` | 18 copy-paste blocks (email/SMS/scripts) with variable highlighting and compliance notes |
| Settings | `/settings` | Export/Import/Reset state, version + provenance, Render/Vercel env examples |
| Profile | `/profile` | Session + launch-context summary |

## Access model

- The whole app is gated. Before unlock, only a Lixen-branded operator login is shown.
- Demo operator token: **`demo-lixen`** (held in React state only — never persisted to browser storage).
- All protected API endpoints require `Authorization: Bearer demo-lixen`. Missing/wrong token → `401`.
- Login warning copy (verbatim): _"Only the Lixen operator token belongs here. Never paste a HighLevel private integration token, API key, or third-party credential into this login."_

## Readiness model (two separate numbers)

- **Benchmark readiness baseline: 70%** — a dated source baseline from the Agency Partner Program benchmark (`SOURCE_DATE = 2026-06-22`). This is fixed and provenance-bound; it is **not** a live score.
- **Calculated checklist completion** — derived live from how many actionable leaf items the operator has checked off (154 total actionable leaf items across 14 phases). Starts at 0%.

These two numbers are always shown distinctly and never conflated.

## Packages (customer-facing labels only)

| Package | Current minimum setup | Planned opening setup | Monthly | Minimum term |
| --- | --- | --- | --- | --- |
| **Local Automation Starter** (default, active) | $1,000 | $3,000 | $197/mo | 6 months |
| **AI Growth System (Plus)** (upgrade) | $1,999 | $4,000 | $497/mo | **OPEN DECISION** |

- `currentMinimumSetupFee` and `plannedOpeningSetupFee` are **separate fields**. The planned opening price is never presented as a discount off anything.
- Customer-facing labels are **only** "Local Automation Starter" and "AI Growth System (Plus)". The legacy internal "Smart/Pro" labels are **never** shown to customers (migration note retained internally: Smart→Starter, Pro→Plus).
- Plus minimum term is intentionally an **OPEN DECISION** (`pricingStatus: "OPEN DECISION"`, `null` term).
- Prominent sentence shown in the app (verbatim): _"Local Automation Starter is active; AI Growth System is what we turn on when upgrading."_

## Safety lanes (enforced in copy + module structure)

- **Cold outreach lane:** Apollo + Instantly only.
- **Warm CRM lane:** GHL LC Email only, for opted-in / warm / existing contacts.
- **Never** send cold outreach through GHL.
- No bulk enrollment, workflow publishing, SMS, or ad spend without explicit approval.
- No secret values ever shown in UI, logs, or exports.

## Stack

- **Preview/sandbox:** React + Vite + TypeScript + Tailwind + shadcn/ui frontend; Express + better-sqlite3/Drizzle backend; wouter hash routing. Deployed via `deploy_website`.
- **Production mapping (documented, not built here):** Next.js (App Router) on Vercel + Supabase (Postgres + Auth + RLS). See `ARCHITECTURE.md` and `DEPLOYMENT.md`.

## Provenance

- Benchmark source: **Benchmark v1 (Agency Partner Program)**, dated `2026-06-22`, last verified `2026-06-22`.
- Playbook version `v1.0.0`, package version `v1.0.0`, export schema `lixenai-lcc-export-v1`.
- Precedence: 1) this build brief, 2) Benchmark document, 3) founder-approved decision log.
