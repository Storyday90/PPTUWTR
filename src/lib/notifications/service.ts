import { prisma } from "@/lib/prisma";

/**
 * Notification + email seam. Today: in-app rows for the bell, and an email
 * "outbox" that is logged and recorded. Swap `deliverEmail` for Resend /
 * nodemailer at launch without touching call sites.
 */

interface InAppInput {
  userId: string;
  type: string;
  bookingId?: string;
  title: string;
  body: string;
}

export async function notifyUser({ userId, type, bookingId, title, body }: InAppInput) {
  await prisma.notification.create({
    data: {
      userId,
      bookingId,
      channel: "INAPP",
      type,
      status: "SENT",
      payloadJson: JSON.stringify({ title, body }),
    },
  });
}

/** Fan out an in-app notification to every admin (so any admin sees it). */
export async function notifyAdmins({ type, bookingId, title, body }: Omit<InAppInput, "userId">) {
  const admins = await prisma.user.findMany({ where: { role: "ADMIN" }, select: { id: true } });
  if (admins.length === 0) return;
  await prisma.notification.createMany({
    data: admins.map((a) => ({
      userId: a.id,
      bookingId,
      channel: "INAPP",
      type,
      status: "SENT",
      payloadJson: JSON.stringify({ title, body }),
    })),
  });
}

interface EmailInput {
  to: string;
  subject: string;
  body: string;
  type: string;
  bookingId?: string;
  userId?: string;
}

/** Real delivery goes here later (Resend/nodemailer). For now: log to server. */
async function deliverEmail(input: EmailInput) {
  console.info(
    `\n📧 [EMAIL → ${input.to}] ${input.subject}\n${input.body}\n`,
  );
}

export async function sendEmail(input: EmailInput) {
  let status = "SENT";
  try {
    await deliverEmail(input);
  } catch (err) {
    console.error("Email delivery failed", err);
    status = "FAILED";
  }
  await prisma.notification.create({
    data: {
      userId: input.userId,
      bookingId: input.bookingId,
      channel: "EMAIL",
      type: input.type,
      status,
      payloadJson: JSON.stringify({ to: input.to, subject: input.subject, body: input.body }),
    },
  });
}
