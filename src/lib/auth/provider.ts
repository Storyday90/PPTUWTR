export interface AuthUser {
  userId: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
}

export interface RegisterInput {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResult {
  token: string;
  expiresAt: Date;
  user: AuthUser;
}

/** Swappable seam — stub today, Clerk/Auth.js later without touching call sites. */
export interface AuthProvider {
  register(input: RegisterInput): Promise<AuthUser>;
  login(input: LoginInput): Promise<LoginResult>;
  logout(token: string): Promise<void>;
  validateSession(token: string): Promise<AuthUser | null>;
}
