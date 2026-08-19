import { UserRole } from '../enums/user-role.enum';

export class User {
  constructor(
    private readonly _id: string,
    private readonly _usuario: string,
    private readonly _passwordHash: string,
    private readonly _role: UserRole,
  ) {}

  get id(): string {
    return this._id;
  }

  get usuario(): string {
    return this._usuario;
  }

  get passwordHash(): string {
    return this._passwordHash;
  }

  get role(): UserRole {
    return this._role;
  }
}
