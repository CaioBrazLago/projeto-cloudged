import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from '../dto/login.dto';
import type { AuthResponse } from '../services/auth.service';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Autenticar usuário',
    description: 'Autentica um operador ou auditor e retorna um token JWT.',
  })
  @ApiOkResponse({
    description: 'Autenticação realizada com sucesso',
    schema: {
      example: {
        role: 'operador',
        access: 'eyJhbGciOiJIUzI1NiIs...',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Usuário ou senha inválidos',
  })
  async Login(@Body() data: LoginDto): Promise<AuthResponse> {
    const response = await this.authService.execute(data);

    return response;
  }
}
