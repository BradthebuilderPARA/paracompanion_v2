# ParaCompanion v2

ParaCompanion v2 is a clinical documentation support tool for UK prehospital clinicians. It is a **Class I Software as a Medical Device (SaMD) under MHRA** and is designed to **structure and standardise clinical documentation** (e.g., capture, organisation, and formatting of information). **It is not a diagnostic, triage, or treatment decision system**, and must not be used to generate or recommend clinical decisions.

---

## 1) Title & Overview

**Project:** ParaCompanion v2  
**Purpose:** Documentation support for UK prehospital care  
**Regulatory position:** Class I SaMD (MHRA)  
**Safety posture:** Information structuring only; no decision-making

ParaCompanion v2 supports clinicians by providing consistent workflows for documenting care in the field, including offline-capable capture and deterministic formatting of structured data. The system is intentionally constrained to avoid diagnostic or prescriptive behaviour.

---

## 2) System Architecture

This repository is a **monorepo** comprising three user-facing surfaces and shared packages:

### Surfaces

1. **Web App (Next.js App Router)**
   - Internal clinical web interface for authenticated users.
   - Uses shared UI, types, and clinical logic packages.
   - Client must not process PII through any cloud AI or external service.

2. **Mobile App (React Native + Expo)**
   - Primary field workflow for prehospital clinicians.
   - **Offline-first** by design: core capture and scoring must function without network access.
   - Sync is opportunistic and must never block clinical workflows.

3. **Marketing Site (Next.js SSG)**
   - Public, static content only.
   - No clinical functionality, no authenticated features, no access to operational systems.

### Backend

- **Supabase** provides:
  - **Postgres** for structured storage
  - **Auth** for OTP / magic link authentication
  - **Edge Functions** for constrained server-side processing (“Airlock Engine”)

### Architectural constraints (high-level)

- Clinical logic is separated and versioned in **`packages/clinical`**.
- The mobile app is **offline-first**; any scoring tools must operate offline with deterministic outputs.
- All sensitive processing and sanitisation is performed **server-side only** within **Supabase Edge Functions**.

---

## 3) Tech Stack (Strict)

### Enforced technologies

- Package manager: **pnpm only**
- Web: **Next.js 16 (App Router)**
- Mobile: **React Native + Expo (SDK 51)**
- State management: **Zustand**
- Forms: **react-hook-form**
- Validation: **zod**
- Dates: **date-fns** (required)
- Backend: **Supabase (Postgres, Auth, Edge Functions)**
- Styling:
  - Web: **Tailwind CSS**
  - Mobile: **NativeWind**
- Icons: **lucide-react**
- Language: **TypeScript (strict mode)**

### Prohibited (non-negotiable)

- Package managers: **npm**, **yarn**
- HTTP client: **Axios** (use `fetch`)
- Date library: **Moment.js**
- React **class components** (function components only)

---

## 4) Project Structure

Representative layout (actual layout may evolve, but must preserve separation of concerns):

```text
/apps
  /web           # Next.js App Router application (clinical web)
  /mobile        # React Native + Expo application (offline-first)
  /marketing     # Next.js static site (SSG)

/packages
  /clinical      # Clinical logic: deterministic, testable, offline-capable
  /ui            # Shared UI primitives + design system components
  /types         # Shared TypeScript types + schemas

/supabase
  /functions     # Edge Functions (Airlock Engine runs here)
  /migrations    # Database migrations (schema as code)
```

**Hard boundary:** `packages/clinical` must remain free of UI dependencies and must be deterministic and testable.

---

## 5) Setup & Development

### Prerequisites

- Node.js (LTS recommended)
- **pnpm** installed globally
- Supabase CLI (if using local Supabase)
- iOS/Android toolchains (for mobile development)

### Install dependencies

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

### Regenerating Database Types

The generated TypeScript types for the Supabase database schema live in `packages/types/database.ts`. Whenever you apply a new migration, regenerate these types to keep TypeScript in sync:

```bash
# Requires the local Supabase stack to be running (supabase start)
pnpm supabase:types
```

This runs `supabase gen types typescript --local` and overwrites `packages/types/database.ts`. Commit the updated file alongside any migration that changes the schema.

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
