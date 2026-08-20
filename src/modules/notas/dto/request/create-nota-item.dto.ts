import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Matches,
  Min,
} from 'class-validator';

export class CreateNotaItemDto {
  @ApiProperty({
    example: '1006.30.00',
    description: 'NCM completo do item',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(\d{8}|\d{4}\.\d{2}\.\d{2})$/, {
    message: 'ncm deve possuir 8 dígitos, com ou sem pontuação',
  })
  ncm!: string;

  @ApiProperty({
    example: 10,
    description: 'Quantidade do item',
  })
  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false,
      maxDecimalPlaces: 4,
    },
    {
      message: 'quantidade deve ser um número válido',
    },
  )
  @IsPositive({
    message: 'quantidade deve ser maior que zero',
  })
  quantidade!: number;

  @ApiProperty({
    example: 50,
    description: 'Valor unitário do item',
  })
  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false,
      maxDecimalPlaces: 2,
    },
    {
      message: 'valorUnitario deve ser um número válido',
    },
  )
  @Min(0, {
    message: 'valorUnitario não pode ser negativo',
  })
  valorUnitario!: number;
}
