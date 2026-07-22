// Runs at build time. Applies the schema and seeds ONLY when a Postgres
// DATABASE_URL is present, so the app still builds/deploys before the
// database is connected. Both `db push` and the seed are idempotent.
import { execSync } from "node:child_process";

const url = process.env.DATABASE_URL ?? "";

if (!/^postgres(ql)?:\/\//i.test(url)) {
  console.warn(
    "\n⚠️  DATABASE_URL is not a Postgres connection — skipping `db push` + seed.\n" +
      "   Add a Postgres database (Vercel → Storage) and redeploy to set up data.\n",
  );
  process.exit(0);
}

try {
  console.log("→ Applying schema (prisma db push)…");
  execSync("prisma db push --skip-generate", { stdio: "inherit" });
  console.log("→ Seeding baseline data…");
  execSync("prisma db seed", { stdio: "inherit" });
  console.log("✓ Database ready.");
} catch (err) {
  console.error("✗ Database setup failed:", err?.message ?? err);
  process.exit(1);
}
