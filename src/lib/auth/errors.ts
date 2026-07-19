export class UnauthorizedError extends Error {
  constructor(message = "Sila log masuk untuk meneruskan.") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message = "Anda tidak mempunyai kebenaran untuk tindakan ini.") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class EmailInUseError extends Error {
  constructor(message = "Emel ini telah didaftarkan.") {
    super(message);
    this.name = "EmailInUseError";
  }
}

export class InvalidCredentialsError extends Error {
  constructor(message = "Emel atau kata laluan tidak sah.") {
    super(message);
    this.name = "InvalidCredentialsError";
  }
}
