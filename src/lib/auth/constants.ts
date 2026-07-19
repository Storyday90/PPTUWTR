// Split out from src/lib/auth/index.ts so middleware.ts (Edge runtime) can read the
// cookie name without pulling in the stub provider's Node-only deps (bcrypt, Prisma).
export const SESSION_COOKIE = "ppuwtr_session";
