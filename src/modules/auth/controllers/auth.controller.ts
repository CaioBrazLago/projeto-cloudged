import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import type { AuthResponse } from '../services/auth.service';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async Login(@Body() data: LoginDto): Promise<AuthResponse> {
    const response = await this.authService.execute(data);

    return response;
  }
}
