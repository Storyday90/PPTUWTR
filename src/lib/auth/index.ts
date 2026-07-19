import { stubAuthProvider } from "@/lib/auth/stubAuthProvider";
import type { AuthProvider } from "@/lib/auth/provider";

const PROVIDERS: Record<string, AuthProvider> = {
  stub: stubAuthProvider,
};

export const authProvider: AuthProvider = PROVIDERS[process.env.AUTH_PROVIDER ?? "stub"] ?? stubAuthProvider;
export { SESSION_COOKIE } from "@/lib/auth/constants";
