import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

import { AppError } from '../../../shared/errors/app-error';
import { UserRole } from '../../user/enums/user-role.enum';

interface JwtPayload {
  sub: string;
  role: UserRole;
}

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new AppError('Token não fornecido', 401);
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);

      request.user = payload;
    } catch {
      throw new AppError('Token inválido ou expirado', 401);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] =
      request.headers.authorization?.trim().split(/\s+/) ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
