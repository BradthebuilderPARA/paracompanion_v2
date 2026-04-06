# ParaCompanion v2

ParaCompanion v2 is a clinical documentation support tool for UK prehospital clinicians. It structures information captured during patient encounters — it does not diagnose, triage, or make treatment decisions. The system is classified as Class I Software as a Medical Device (SaMD) under MHRA regulation and is developed accordingly, with explicit regulatory, safety, and engineering constraints enforced throughout.

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Setup & Development](#setup--development)
5. [Clinical Safety & Regulatory Constraints](#clinical-safety--regulatory-constraints)
6. [Data Protection & Airlock Engine](#data-protection--airlock-engine)
7. [Database Rules](#database-rules)
8. [Authentication & Security](#authentication--security)
9. [Design System](#design-system)
10. [Development Rules](#development-rules)
11. [Test Credentials](#test-credentials)
12. [Disclaimer](#disclaimer)

---

## System Architecture

ParaCompanion v2 is a monorepo delivering three distinct surfaces:

| Surface | Framework | Purpose |
|---|---|---|
| **Web App** | Next.js 16 (App Router) | Primary clinical documentation interface |
| **Mobile App** | React Native + Expo SDK 51 | Field use; offline-first |
| **Marketing Site** | Next.js 16 (SSG) | Public-facing, statically generated |

### Backend

- **Supabase** provides Postgres, Auth (OTP/magic link), and Edge Functions.
- All server-side processing — including PII handling — occurs exclusively within **Supabase Edge Functions** (the Airlock Engine). No PII processing runs client-side.
- Row Level Security (RLS) is enforced on all tables before any write operation.

### Mobile

- Designed **offline-first**. Clinical scoring tools must function without network connectivity.
- Data is synced to the backend when a connection is re-established.
- SecureStore is used for all sensitive local storage.

### Clinical Logic

- All shared clinical logic is isolated in `packages/clinical`.
- No clinical logic is duplicated across surfaces.
- Outputs are deterministic and non-inferential.

---

## Tech Stack

### Enforced Technologies

| Concern | Technology |
|---|---|
| Package manager | `pnpm` (exclusively) |
| Web framework | Next.js 16 App Router |
| Mobile framework | React Native + Expo SDK 51 |
| State management | Zustand |
| Form handling | react-hook-form |
| Validation | Zod |
| Date handling | date-fns |
| Backend | Supabase (Postgres, Auth, Edge Functions) |
| Styling (web) | Tailwind CSS |
| Styling (mobile) | NativeWind |
| Icons | lucide-react |
| Language | TypeScript (strict mode) |

### Prohibited Technologies

The following are **not permitted** anywhere in this codebase:

- `npm` or `yarn` — use `pnpm` only
- `axios` — use `fetch` directly
- `Moment.js` — use `date-fns`
- React class components — use function components only
- `any` TypeScript type — enforce strict typing throughout

---

## Project Structure

```
/apps
  /web              # Next.js 16 App Router — clinical documentation web interface
  /mobile           # React Native + Expo SDK 51 — mobile field app
  /marketing        # Next.js 16 SSG — public marketing site
/packages
  /clinical         # Shared clinical logic (scoring tools, structuring utilities)
  /ui               # Shared component library
  /types            # Shared TypeScript type definitions
/supabase
  /functions        # Edge Functions — Airlock Engine, PII processing
  /migrations       # Postgres schema migrations
```

---

## Setup & Development

### Prerequisites

- Node.js (see `.nvmrc` or `engines` field in `package.json`)
- `pnpm` installed globally: `npm install -g pnpm`
- Supabase CLI (for local development): `brew install supabase/tap/supabase`

### Install Dependencies

```bash
pnpm install
```

### Development Servers

```bash
# Web app
pnpm --filter web dev

# Mobile app
pnpm --filter mobile start

# Marketing site
pnpm --filter marketing dev
```

### Supabase Local Setup

```bash
supabase start
supabase db reset   # Applies all migrations and seeds
```

### Environment Variables

Each app expects a `.env.local` file. **No secrets are committed to the repository.** Reference `.env.example` in each app directory for required variable names. Variables follow the pattern:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Sensitive keys (service role, edge function secrets) are provided through environment configuration in deployment pipelines and are never exposed client-side.

---

## Clinical Safety & Regulatory Constraints

ParaCompanion v2 is classified as **Class I SaMD under MHRA regulation**. The following constraints are non-negotiable and reflect the safety case for the system:

- The system **does not diagnose, triage, or recommend treatment**.
- All functionality is limited to **information structuring and documentation support**.
- Clinical scoring tools (e.g. GCS, NEWS2) produce deterministic outputs from user-supplied inputs — they do not infer, predict, or interpret.
- Offline functionality for scoring tools is **mandatory**. Clinicians must be able to use the system without network connectivity.
- All outputs are reproducible given the same inputs. No probabilistic or model-driven outputs are permitted.
- Changes to clinical logic in `packages/clinical` require engineering review and traceability to a documented clinical requirement.

---

## Data Protection & Airlock Engine

Patient data is subject to UK GDPR and the Data Protection Act 2018. The following rules govern all PII handling:

### PII Definition (Non-Exhaustive)

- NHS number
- Date of birth
- Full name
- Address or postcode
- Any field that alone or in combination could identify a patient

### Airlock Rules

- PII **must never reach cloud infrastructure in identifiable form**.
- All PII processing (structuring, redaction, anonymisation) occurs exclusively within **Supabase Edge Functions** — the Airlock Engine.
- **No client-side PII sanitisation is permitted.** Client applications must not attempt to strip or transform PII before transmission.
- The Airlock is the sole boundary at which PII is handled. Any proposed change to this boundary requires explicit sign-off.

---

## Database Rules

All schema changes must conform to the following:

- **Primary keys**: UUID only — no serial or integer IDs
- **Soft deletes**: Records are never hard-deleted except through an explicit, documented deletion workflow. All tables with user data must include a `deleted_at` column.
- **Required columns**: Every table must include:
  - `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`
  - `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()`
  - `deleted_at TIMESTAMPTZ`
- **Row Level Security**: RLS policies must be in place and verified before any write path is enabled on a table.
- **Audit tables**: Append-only audit tables are required for any table containing clinical or financial data. No updates or deletes are permitted on audit tables.
- **Financial data**: All monetary values are stored in **pence as `BIGINT`**. Floating-point types are not used for financial data.
- **Migrations**: All schema changes are applied via versioned migration files in `/supabase/migrations`. No ad-hoc schema modifications are permitted.

---

## Authentication & Security

- Authentication uses **Supabase OTP (magic link) only**. Password-based authentication is not implemented.
- Session tokens are stored in:
  - **Web**: `httpOnly` cookies — not `localStorage`
  - **Mobile**: Expo `SecureStore`
- Access control is enforced **server-side via RLS**. Client-side tier or role state is never used to gate data access or feature availability.
- Error responses must not expose raw database errors, stack traces, or internal system detail to the client.
- All API routes validate the authenticated session before processing any request.

---

## Design System

The design system is referred to internally as **"Clinical Architect"**. It prioritises legibility, reliability, and suitability for use in high-stress prehospital environments.

### Typography

| Use case | Typeface |
|---|---|
| Body, UI labels, data | Inter |
| Headings, structural labels | Space Grotesk |

### Layout

- **No borders or dividing lines** between UI elements. Separation is achieved through spacing and background contrast only.
- All interactive elements must meet a **minimum touch target of 48×48px**.

### Colour

- Colour usage is functional, not decorative.
- Status colours (alert, warning, neutral) follow clinical convention and are not repurposed for branding.
- The system must remain usable in bright outdoor light conditions.

### Arrival Mode HUD

- The Arrival Mode HUD is a specialised display surface activated on scene arrival.
- It must render key patient and scene data without scroll.
- No dynamic animations, no decorative elements.
- Font sizes and contrast ratios in HUD view must meet WCAG AA as a minimum.

---

## Development Rules

The following rules are enforced across all contributions. They are not negotiable.

- **Never use the `any` type.** All TypeScript must be fully typed. Use `unknown` with explicit narrowing where the type is genuinely uncertain.
- **Never gate data access using client-side tier or role state.** All access control is enforced through Supabase RLS.
- **Never process PII outside Supabase Edge Functions.** The Airlock Engine is the only permitted location for PII handling.
- **Never use `DELETE` in application code** except within explicitly documented deletion workflows. Use soft deletes (`deleted_at`) everywhere else.
- **Never use `npm` or `yarn`.** Use `pnpm` for all package operations.
- **Never use `Moment.js`.** Use `date-fns` for all date operations.
- **Never use `axios`.** Use the native `fetch` API.
- **Never use React class components.**
- **Never commit secrets or credentials.** Use environment variables and deployment-level secret management.
- **Never expose raw errors to the client.** Sanitise all error responses before returning them.

---

## Test Credentials

> **Development environment only. Do not use in staging or production.**

These accounts are available in the local Supabase development environment for testing purposes. OTP magic links are captured by the local Inbucket email server at `http://localhost:54324` (available when `supabase start` is running).

```
Role: Clinician (standard)
Email: test.clinician@paracompanion.dev

Role: Admin
Email: test.admin@paracompanion.dev
```

---

## Disclaimer

ParaCompanion v2 is a clinical documentation support tool. It is **not a medical device for the purpose of diagnosis, triage, or treatment decision-making**. It does not replace clinical judgement. All clinical decisions remain the sole responsibility of the treating clinician.

This software is classified as Class I SaMD under MHRA regulation and is subject to applicable post-market surveillance obligations.
