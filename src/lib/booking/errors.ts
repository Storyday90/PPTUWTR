export class SlotConflictError extends Error {
  constructor(message = "Maaf, slot ini baru sahaja ditempah oleh pengguna lain.") {
    super(message);
    this.name = "SlotConflictError";
  }
}

export class HoldExpiredError extends Error {
  constructor(message = "Tempahan anda telah tamat tempoh, sila cuba semula.") {
    super(message);
    this.name = "HoldExpiredError";
  }
}

export class NotFoundError extends Error {
  constructor(message = "Tidak dijumpai.") {
    super(message);
    this.name = "NotFoundError";
  }
}
