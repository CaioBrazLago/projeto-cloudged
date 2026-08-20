import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString({ message: 'usuario deve ser uma string' })
  @IsNotEmpty({ message: 'usuario não pode estar vazio' })
  usuario!: string;

  @IsString({ message: 'senha deve ser uma string' })
  @IsNotEmpty({ message: 'senha não pode estar vazia' })
  senha!: string;
}
