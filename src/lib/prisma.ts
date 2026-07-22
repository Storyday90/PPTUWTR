import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Resolve a Postgres connection string across the env-var names Vercel Postgres
 * / Neon may inject. We prefer the DIRECT (unpooled) endpoint so the pg driver
 * never hits a pgbouncer transaction-pool (which breaks prepared statements).
 * Fine for this low-concurrency community app.
 */
export function resolveDatabaseUrl() {
  return (
    process.env.DATABASE_URL_UNPOOLED ??
    process.env.POSTGRES_URL_NON_POOLING ??
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL
  );
}

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: resolveDatabaseUrl() });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
