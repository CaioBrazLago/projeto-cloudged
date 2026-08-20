import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { AppError } from '../../../shared/errors/app-error';
import { UserRepository } from '../../user/repositories/user.repository';
import { LoginDto } from '../dto/login.dto';

export interface AuthResponse {
  role: string;
  access: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(data: LoginDto): Promise<AuthResponse> {
    const { usuario, senha } = data;
    const user = await this.userRepository.findByUser(usuario);

    if (!user) {
      throw new AppError('Usuário ou senha inválidos', 401);
    }

    const isValidPassword = await bcrypt.compare(senha, user.passwordHash);

    if (!isValidPassword) {
      throw new AppError('Usuário ou senha inválidos', 401);
    }

    const payload = {
      id: user.id,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    return {
      role: user.role,
      access: token,
    };
  }
}
