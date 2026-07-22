import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { toJson } from "../src/lib/utils/json";

const adapter = new PrismaPg({
  connectionString:
    process.env.DATABASE_URL_UNPOOLED ??
    process.env.POSTGRES_URL_NON_POOLING ??
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const branch = await prisma.branch.upsert({
    where: { id: "branch-ppuwtr-main" },
    update: {},
    create: {
      id: "branch-ppuwtr-main",
      name: "PPUWTR — Taman Universiti Wallagonia Tapah Road",
      address: "Taman Universiti Wallagonia, Tapah Road",
    },
  });

  const facility = await prisma.facility.upsert({
    where: { slug: "dewan-dato-haji-samsudin" },
    update: {},
    create: {
      branchId: branch.id,
      name: "Dewan Dato' Haji Samsudin bin Haji Abu Hassan",
      slug: "dewan-dato-haji-samsudin",
      description:
        "Dewan komuniti rasmi PPUWTR — tuan rumah kepada gelanggang badminton, pickleball, futsal, ping pong dan ruang seminar untuk program komuniti.",
      address: "Taman Universiti Wallagonia, Tapah Road",
      mapUrl: "https://maps.google.com/?q=Dewan+Dato+Haji+Samsudin+Tapah+Road",
      heroImage: "/images/dewan-hero.jpg",
    },
  });

  const sports = await Promise.all(
    [
      { name: "Badminton", slug: "badminton", icon: "🏸" },
      { name: "Pickleball", slug: "pickleball", icon: "🎾" },
      { name: "Futsal", slug: "futsal", icon: "⚽" },
      { name: "Ping Pong", slug: "ping-pong", icon: "🏓" },
      { name: "Dewan Seminar", slug: "dewan-seminar", icon: "🎤" },
    ].map((s) =>
      prisma.sport.upsert({ where: { slug: s.slug }, update: {}, create: s }),
    ),
  );
  const [badminton, pickleball, futsal, pingPong, seminar] = sports;

  const courts = [
    {
      sportId: badminton.id,
      name: "Gelanggang Badminton 1",
      capacity: 4,
      hourlyPriceCents: 1500,
      amenities: ["Lantai getah", "Pencahayaan LED", "Net disediakan"],
    },
    {
      sportId: badminton.id,
      name: "Gelanggang Badminton 2",
      capacity: 4,
      hourlyPriceCents: 1500,
      amenities: ["Lantai getah", "Pencahayaan LED", "Net disediakan"],
    },
    {
      sportId: pickleball.id,
      name: "Gelanggang Pickleball 1",
      capacity: 4,
      hourlyPriceCents: 1200,
      amenities: ["Permukaan khas pickleball", "Net disediakan"],
    },
    {
      sportId: futsal.id,
      name: "Gelanggang Futsal Utama",
      capacity: 12,
      hourlyPriceCents: 8000,
      amenities: ["Padang saiz penuh", "Gol disediakan", "Bilik persalinan"],
      slotMinutes: 60,
    },
    {
      sportId: pingPong.id,
      name: "Meja Ping Pong 1",
      capacity: 2,
      hourlyPriceCents: 600,
      amenities: ["Meja standard", "Bet & bola disediakan"],
    },
    {
      sportId: pingPong.id,
      name: "Meja Ping Pong 2",
      capacity: 2,
      hourlyPriceCents: 600,
      amenities: ["Meja standard", "Bet & bola disediakan"],
    },
    {
      sportId: seminar.id,
      name: "Dewan Seminar Utama",
      capacity: 150,
      hourlyPriceCents: 10000,
      amenities: ["Sistem PA", "Projektor", "Penyaman udara", "Kerusi & meja"],
      openTime: "08:00",
      closeTime: "22:00",
    },
  ];

  for (const c of courts) {
    const existing = await prisma.court.findFirst({ where: { facilityId: facility.id, name: c.name } });
    if (existing) continue;
    await prisma.court.create({
      data: {
        facilityId: facility.id,
        sportId: c.sportId,
        name: c.name,
        capacity: c.capacity,
        hourlyPriceCents: c.hourlyPriceCents,
        amenitiesJson: toJson(c.amenities),
        photosJson: toJson([]),
        openTime: c.openTime ?? "08:00",
        closeTime: c.closeTime ?? "23:00",
        slotMinutes: c.slotMinutes ?? 60,
      },
    });
  }

  const adminPasswordHash = await bcrypt.hash("Admin123!", 10);
  await prisma.user.upsert({
    where: { email: "admin@ppuwtr.org" },
    update: {},
    create: {
      email: "admin@ppuwtr.org",
      name: "Pentadbir PPUWTR",
      role: "ADMIN",
      passwordHash: adminPasswordHash,
    },
  });

  const demoPasswordHash = await bcrypt.hash("Demo123!", 10);
  await prisma.user.upsert({
    where: { email: "demo@ppuwtr.org" },
    update: {},
    create: {
      email: "demo@ppuwtr.org",
      name: "Ahli Demo",
      phone: "012-3456789",
      role: "CUSTOMER",
      passwordHash: demoPasswordHash,
    },
  });

  console.log("Seed complete.");
  console.log("Admin login: admin@ppuwtr.org / Admin123!");
  console.log("Demo login: demo@ppuwtr.org / Demo123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
