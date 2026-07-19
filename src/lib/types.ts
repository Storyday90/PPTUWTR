export interface SportDTO {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

export interface CourtDTO {
  id: string;
  facilityId?: string;
  name: string;
  description?: string | null;
  capacity: number;
  hourlyPriceCents: number;
  amenities: string[];
  photos: string[];
  slotMinutes: number;
  openTime: string;
  closeTime: string;
  isActive?: boolean;
  sport: SportDTO;
}

export interface FacilityDTO {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  mapUrl: string | null;
  heroImage: string | null;
  courts: CourtDTO[];
}

export type SlotStatus = "AVAILABLE" | "HELD" | "CONFIRMED" | "CLOSED";

export interface SlotAvailabilityDTO {
  slotStart: string;
  slotEnd: string;
  status: SlotStatus;
}
