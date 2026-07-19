import { fromJson } from "@/lib/utils/json";
import type { Court, Sport } from "@/generated/prisma/client";

export function shapeCourt(court: Court & { sport: Sport }) {
  return {
    id: court.id,
    facilityId: court.facilityId,
    name: court.name,
    description: court.description,
    capacity: court.capacity,
    hourlyPriceCents: court.hourlyPriceCents,
    amenities: fromJson<string[]>(court.amenitiesJson, []),
    photos: fromJson<string[]>(court.photosJson, []),
    slotMinutes: court.slotMinutes,
    openTime: court.openTime,
    closeTime: court.closeTime,
    isActive: court.isActive,
    sport: { id: court.sport.id, name: court.sport.name, slug: court.sport.slug, icon: court.sport.icon },
  };
}
