export const SPORT_IMAGES: Record<string, { src: string; alt: string }> = {
  badminton: {
    src: "/images/badminton-hd.jpg",
    alt: "Raket badminton di atas gelanggang berwarna",
  },
  pickleball: {
    src: "/images/pickleball-hd.jpg",
    alt: "Bet pickleball dan bola di atas gelanggang hijau",
  },
  futsal: {
    src: "/images/futsal-hd.jpg",
    alt: "Bola futsal di depan gol di gelanggang dalam dewan",
  },
  "ping-pong": {
    src: "/images/ping-pong-hd.jpg",
    alt: "Bet ping pong merah dan bola di atas meja biru",
  },
  "dewan-seminar": {
    src: "/images/seminar-hall.jpg",
    alt: "Dewan seminar dengan susunan kerusi yang kemas",
  },
};

export const FALLBACK_SPORT_IMAGE = {
  src: "/images/badminton-rackets.jpg",
  alt: "Raket badminton dan bulu tangkis di atas gelanggang hijau",
};

export function sportImage(slug: string) {
  return SPORT_IMAGES[slug] ?? FALLBACK_SPORT_IMAGE;
}
