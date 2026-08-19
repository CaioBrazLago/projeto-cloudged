import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Matches,
  Min,
} from 'class-validator';

export class CreateNotaItemDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^(\d{8}|\d{4}\.\d{2}\.\d{2})$/, {
    message: 'ncm deve possuir 8 dígitos, com ou sem pontuação',
  })
  ncm!: string;

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
