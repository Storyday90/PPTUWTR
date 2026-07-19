# PPUWTR Arena

Booking platform for **Dewan Dato' Haji Samsudin bin Haji Abu Hassan** (Persatuan Penduduk Taman
Universiti Wallagonia Tapah Road) — badminton, pickleball, futsal, ping pong, and hall/seminar
bookings, with a real-time-feeling calendar and a database-enforced anti-double-booking guarantee.

Tagline: **Book. Play. Connect.**

## Stack

Next.js 16 (App Router) full-stack — no separate backend service. Prisma + SQLite for local dev
(zero install), designed to cut over to Postgres before production. Tailwind + shadcn/ui (Base UI)
for the design system. React Query for data fetching. Auth, payments, notifications, and realtime
are each behind a small provider interface (`src/lib/{auth,payments,notifications}/provider.ts`)
with a `stub` implementation active today — swap in Clerk/Billplz/ToyyibPay/Supabase Realtime later
by adding a new provider file, without touching call sites.

## Getting started

```bash
npm install
npm run db:migrate   # applies prisma/migrations, creates prisma/dev.db
npm run db:seed       # seeds the branch, facility, sports, courts, and demo users
npm run dev
```

Open http://localhost:3000.

Demo logins (from the seed script):

- Admin: `admin@ppuwtr.org` / `Admin123!`
- Customer: `demo@ppuwtr.org` / `Demo123!`

Other useful scripts: `npm run db:studio` (Prisma Studio), `npm run db:reset` (drop + re-migrate +
re-seed), `npm run build` (also runs the TypeScript check).

## How anti-double-booking works

This is the core guarantee of the whole system, so it's worth being explicit about it.

Every booking is decomposed into one row per time unit in `BookingSlot`, and that table has:

```prisma
@@unique([courtId, slotStart])
```

That single database constraint is what makes double-booking impossible — not application logic.
When a booking is created (`src/lib/booking/createHold.ts`), it runs inside a transaction that:

1. Deletes any stale `HELD` rows for the requested slots whose 10-minute hold has expired (so an
   abandoned hold can never block a legitimate new claim).
2. Creates the `Booking` row and then `createMany`s one `BookingSlot` per requested time unit, all
   in the same transaction.

If two requests race for the same slot, the database's unique index guarantees exactly one
`createMany` succeeds — the loser's transaction fails with Prisma error `P2002`, which is caught
and turned into a friendly `409` response: *"Maaf, slot ini baru sahaja ditempah oleh pengguna
lain."* The frontend shows that as a toast and immediately re-fetches availability for that court,
so the losing user's calendar re-renders the slot as booked in real time.

Reads (`GET /api/availability`) never delete anything — an expired `HELD` row is simply treated as
free in the query's `WHERE` clause. Only the write path physically sweeps expired holds, and only
for the exact slots someone is trying to claim, right when it matters.

This is proven, not just asserted: `POST /api/bookings` fired concurrently (5-way `Promise.all`)
against the same slot produces exactly one `201` and N-1 `409`s. Re-run this check any time you
touch `createHold.ts` or the schema.

## SQLite (dev) → Postgres (production) cutover

Local dev uses SQLite via `@prisma/adapter-better-sqlite3` for zero-install setup. Postgres gives
real concurrent-writer row-locking under load and is what a production deployment should run.
Prisma migration history is dialect-specific, so this is a one-time regeneration, not an in-place
switch:

1. Provision a Postgres database (e.g. a free [Neon](https://neon.tech) or Supabase project).
2. In `prisma/schema.prisma`, change `provider = "sqlite"` to `provider = "postgresql"` under
   `datasource db`.
3. Delete/archive `prisma/migrations/` (those are SQLite-dialect SQL).
4. Point `DATABASE_URL` in `.env` at the new Postgres connection string.
5. Run `npx prisma migrate dev --name init` to generate a fresh Postgres-dialect initial migration
   from the current schema, and commit it as the new canonical history.
6. Swap `src/lib/prisma.ts` (and `prisma/seed.ts`) to use `@prisma/adapter-pg` (or your preferred
   Postgres driver adapter) instead of `PrismaBetterSqlite3` — same `PrismaClient({ adapter })`
   shape, different adapter class.
7. Re-run `npm run db:seed`, then re-run the concurrency check above against the real Postgres
   instance before calling it production-ready.

The schema was written to stay portable across both providers: no Prisma `enum` (status fields are
plain `String` + TS unions), no Prisma `Json` (JSON columns are serialized strings via
`src/lib/utils/json.ts`), and money is always `Int` cents — never `Decimal`/`Float`.

## What's built vs. deferred

**Built (MVP):** live availability calendar (day + week views), the full booking flow (slot
selection → contact form → 10-minute hold → stub payment → confirmation), booking lookup by code,
stub email/session auth with role-gated admin, and a minimal admin dashboard (bookings
approve/cancel, courts CRUD, blocked-slot/maintenance management, revenue & utilization stats).

**Deferred to later phases** (stubbed or intentionally out of scope for this pass): real payment
gateways (FPX/DuitNow/Billplz/ToyyibPay — currently a one-click stub that always succeeds), real
email/WhatsApp delivery (notifications are written to the `Notification` table but not sent
anywhere), month calendar view, PDF/Excel report export, reviews, promotions, full audit logging,
multi-branch admin, and the full 17-document enterprise design package from the original brief.
None of these are architecturally blocked — the provider-seam pattern means they're additive work,
not rewrites.

## Project structure

```
prisma/                  schema, migrations, seed script
src/
  app/                    routes: public pages, /admin/*, /api/*
  components/             ui/ (shadcn), booking/, facilities/, landing/, admin bits, shared/
  lib/
    booking/               createHold, confirmPayment, cancelBooking, availability, pricing
    auth/                  provider interface + stub implementation + session helpers
    validation/            zod schemas
    api/                   error → HTTP response mapping, rate limiting
  hooks/                   React Query hooks used by the client components
```
