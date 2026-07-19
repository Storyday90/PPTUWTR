export const SPORT_IMAGES: Record<string, { src: string; alt: string }> = {
  badminton: {
    src: "/images/badminton-player.jpg",
    alt: "Pemain badminton beraksi di atas gelanggang dalam dewan",
  },
  pickleball: {
    src: "/images/pickleball-player.jpg",
    alt: "Pemain pickleball memukul bola di gelanggang tertutup",
  },
  futsal: {
    src: "/images/futsal-match.jpg",
    alt: "Perlawanan futsal rancak di gelanggang dalam dewan",
  },
  "ping-pong": {
    src: "/images/ping-pong.jpg",
    alt: "Bet ping pong merah dan bola di atas meja",
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
