import { UserRole } from '../enums/user-role.enum';

export class User {
  constructor(
    public readonly usuario: string,
    public readonly passwordHash: string,
    public readonly role: UserRole,
  ) {}
}
