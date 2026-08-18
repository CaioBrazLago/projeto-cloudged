export enum UserRole {
  OPERADOR = 'operador',
  AUDITOR = 'auditor',
}

export class User {
  constructor(
    public readonly usuario: string,
    public readonly passwordHash: string,
    public readonly role: UserRole,
  ) {}
}
