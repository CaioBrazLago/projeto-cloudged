import { User } from '../entities/user.entity';

export abstract class UserRepository {
  abstract findByUser(usuario: string): Promise<User | null>;
}
