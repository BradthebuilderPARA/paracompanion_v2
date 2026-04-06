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

### Run applications (development)

> Commands are representative; use the workspace scripts defined in `package.json` where available.

**Web app**
```bash
pnpm --filter web dev
```

**Mobile app**
```bash
pnpm --filter mobile dev
```

**Marketing site**
```bash
pnpm --filter marketing dev
```

### Supabase local development (if applicable)

If local Supabase is used, follow the repository’s Supabase setup scripts. Typical flow:

```bash
supabase start
supabase db reset
```

**Important:**
- Local development must never require production secrets.
- Use `.env.local` files per app where needed.
- Environment variables must be documented and validated at startup.

### Environment variable expectations

- **No secrets committed to git.**
- Use `.env.example` files to document required variables.
- Validate required variables at runtime (fail fast).
- Treat all logs as potentially sensitive; avoid logging identifiers, tokens, or payloads that could include PII.

---

## 6) Clinical Safety & Regulatory Constraints

ParaCompanion v2 is a regulated clinical product. The following constraints are mandatory:

- The system must **not** provide:
  - diagnosis
  - triage recommendations
  - treatment decisions
  - medication recommendations
  - clinical risk stratification intended to replace clinician judgement
- The system may provide:
  - **information structuring**
  - **deterministic scoring tools** that are offline-capable and explicitly defined (no probabilistic inference)
  - templating and formatting to support documentation

### Offline requirements

- Any **scoring tools** used in the field must operate **offline**.
- Network loss must not degrade core capture and documentation workflows.

### Determinism requirements

- Outputs must be **deterministic** for identical inputs.
- Avoid non-deterministic behaviour (e.g., “AI suggestions”, probabilistic ranking, or cloud inference on user-entered PII).

---

## 7) Data Protection & Airlock Engine

### Absolute rule: PII must NEVER reach the cloud (outside controlled processing)

**PII must never be sent to external services** or processed in client-side “sanitisation” layers. The system assumes clients are not trusted for redaction or compliance enforcement.

### Airlock Engine

- The **Airlock Engine runs ONLY in Supabase Edge Functions**.
- All sanitisation/redaction/validation requiring server-side guarantees must happen **only** in Edge Functions.
- Clients must treat the Airlock as the only permitted processing boundary for sensitive transformations.

### No client-side sanitisation

- Client-side code must not attempt to “remove identifiers” and then send data elsewhere.
- Redaction must be **server-enforced**, testable, and auditable.

### Examples of PII (non-exhaustive)

The following are considered PII and must be handled accordingly:

- NHS number
- Date of birth
- Names (patient or relatives)
- Home address / postcode
- Telephone number / email address
- Incident identifiers that can re-identify a patient when combined with other data
- Free-text narrative that may contain identifiers

---

## 8) Database Rules

All database changes must be made via migrations and follow these rules:

### Keys and identifiers

- **UUID primary keys** required for operational tables.
- Avoid sequential identifiers in exposed surfaces.

### Soft deletes only

- Use soft delete fields; do not hard-delete operational records by default.
- Required columns on operational tables:
  - `created_at`
  - `updated_at`
  - `deleted_at` (nullable)

### Row Level Security (RLS)

- **RLS must be enabled** on all tables containing user or operational data.
- **No writes** permitted unless an explicit RLS policy exists and is reviewed.

### Auditability

- Use **append-only** audit tables for key events.
- Audit rows must never be updated in place; new events are appended.

### Financial data

- Financial amounts must be stored as **pence** using **BIGINT** (no floating point).
- Currency handling must be explicit and documented at call sites.

---

## 9) Authentication & Security

### Authentication

- **Magic link only** (Supabase OTP).
- No passwords stored or managed by this application.

### Token storage

- Web: use **httpOnly cookies** where applicable.
- Mobile: use platform-secure storage (e.g., **Expo SecureStore**).

### Error handling

- Do not expose raw errors or stack traces to end users.
- Centralise error mapping (safe user messages + internal logging).
- Logs must not contain PII; treat logs as part of the regulated record surface.

---

## 10) Design System (“Clinical Architect”)

The UI design system is safety-oriented: clarity, predictability, and low cognitive load.

### Core rules

- **No-line rule:** avoid borders/outlined boxes as primary layout structure.
- Typography:
  - **Inter** for clinical and operational UI text.
  - **Space Grotesk** reserved for controlled brand/marketing contexts only.
- Colour system:
  - Use a constrained palette with high contrast.
  - Colour must not be the only indicator of state (always pair with text/iconography).
- Touch targets:
  - Minimum **48px** tap target for all interactive controls on mobile.
- Arrival Mode HUD constraints:
  - HUD elements must remain readable under glare and movement.
  - Avoid dense multi-column layouts; prioritise large type and single-action flows.
  - Any “arrival mode” display must remain deterministic and stable (no flicker, no reflow from background refresh).

---

## 11) Development Rules (Non-Negotiable)

- **Never use `any`.** Use precise types, `unknown`, and type narrowing.
- **Never gate access using client-side tier state.** Access control is server-enforced.
- **Never run PII processing outside Supabase Edge Functions.**
- **Never use `DELETE`** for operational records (except explicit deletion workflows with audit trails).
- **Never introduce Axios.** Use `fetch`.
- **Never introduce Moment.js.** Use `date-fns`.
- **Never use class components.** Function components only.
- **TypeScript strict mode is mandatory.** Do not weaken compiler options to “make it pass”.
- **Clinical logic must remain in `packages/clinical`.** Do not duplicate or embed in UI layers.

---

## 12) Test Credentials (Development Only)

> Insert the provided accounts below exactly as given. Do not use these in production.

- **[REPLACE WITH PROVIDED TEST ACCOUNT 1]**
- **[REPLACE WITH PROVIDED TEST ACCOUNT 2]**

---

## 13) Disclaimer

ParaCompanion v2 is a clinical documentation support tool. It is **not** a medical device intended for diagnosis, triage, or treatment decision-making, and it is **not a substitute for clinical judgement**. Clinicians retain full responsibility for all clinical decisions and actions.
