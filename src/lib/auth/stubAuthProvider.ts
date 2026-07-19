import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import type { AuthProvider, AuthUser, LoginInput, LoginResult, RegisterInput } from "@/lib/auth/provider";
import { EmailInUseError, InvalidCredentialsError } from "@/lib/auth/errors";

const SESSION_DAYS = 30;

function toAuthUser(u: { id: string; name: string; email: string; role: string }): AuthUser {
  return { userId: u.id, name: u.name, email: u.email, role: u.role === "ADMIN" ? "ADMIN" : "CUSTOMER" };
}

export const stubAuthProvider: AuthProvider = {
  async register(input: RegisterInput) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) throw new EmailInUseError();

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await prisma.user.create({
      data: { name: input.name, email: input.email, phone: input.phone, passwordHash, role: "CUSTOMER" },
    });
    return toAuthUser(user);
  },

  async login(input: LoginInput): Promise<LoginResult> {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user || !user.passwordHash) throw new InvalidCredentialsError();

    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) throw new InvalidCredentialsError();

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
    await prisma.session.create({ data: { token, userId: user.id, expiresAt } });

    return { token, expiresAt, user: toAuthUser(user) };
  },

  async logout(token: string) {
    await prisma.session.deleteMany({ where: { token } });
  },

  async validateSession(token: string): Promise<AuthUser | null> {
    const session = await prisma.session.findUnique({ where: { token }, include: { user: true } });
    if (!session || session.expiresAt < new Date()) return null;
    return toAuthUser(session.user);
  },
};
