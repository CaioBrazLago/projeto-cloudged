import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../database/prisma.service';
import { UserRole as PrismaUserRole } from '../../../../generated/prisma/client';
import { User } from '../../entities/user.entity';
import { UserRole } from '../../enums/user-role.enum';
import { UserRepository } from '../user.repository';

const userRoleMap: Record<PrismaUserRole, UserRole> = {
  OPERADOR: UserRole.OPERADOR,
  AUDITOR: UserRole.AUDITOR,
};

@Injectable()
export class PrismaUserRepository extends UserRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findByUser(usuario: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        usuario,
      },
    });

    if (!user) {
      return null;
    }

    return new User(
      user.id,
      user.usuario,
      user.passwordHash,
      userRoleMap[user.role],
    );
  }
}
