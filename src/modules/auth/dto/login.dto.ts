import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'ana',
    description: 'Usuário utilizado para autenticação',
  })
  @IsString({ message: 'usuario deve ser uma string' })
  @IsNotEmpty({ message: 'usuario não pode estar vazio' })
  usuario!: string;

  @ApiProperty({
    example: 'operador123',
    description: 'Senha do usuário',
  })
  @IsString({ message: 'senha deve ser uma string' })
  @IsNotEmpty({ message: 'senha não pode estar vazia' })
  senha!: string;
}
