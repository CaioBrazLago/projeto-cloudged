import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';

import { CreateNotaItemDto } from './create-nota-item.dto';

export class CreateNotaDto {
  @IsString()
  @IsNotEmpty()
  numeroNota!: string;

  @IsString()
  @Matches(/^[A-Za-z]{2}$/, {
    message: 'uf deve possuir exatamente 2 letras',
  })
  uf!: string;

  @IsDateString(
    {},
    {
      message: 'dataEmissao deve ser uma data válida',
    },
  )
  dataEmissao!: string;

  @IsArray()
  @ArrayMinSize(1, {
    message: 'a nota deve possuir pelo menos um item',
  })
  @ValidateNested({ each: true })
  @Type(() => CreateNotaItemDto)
  itens!: CreateNotaItemDto[];
}
