import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    example: '12345',
    description: 'Número único da nota fiscal',
  })
  @IsString()
  @IsNotEmpty()
  numeroNota!: string;

  @ApiProperty({
    example: 'SP',
    description: 'UF da nota fiscal',
  })
  @IsString()
  @Matches(/^[A-Za-z]{2}$/, {
    message: 'uf deve possuir exatamente 2 letras',
  })
  uf!: string;

  @ApiProperty({
    example: '2024-06-01',
    description: 'Data de emissão da nota fiscal',
  })
  @IsDateString(
    {},
    {
      message: 'dataEmissao deve ser uma data válida',
    },
  )
  dataEmissao!: string;

  @ApiProperty({
    type: [CreateNotaItemDto],
    description: 'Itens da nota fiscal',
  })
  @IsArray()
  @ArrayMinSize(1, {
    message: 'a nota deve possuir pelo menos um item',
  })
  @ValidateNested({ each: true })
  @Type(() => CreateNotaItemDto)
  itens!: CreateNotaItemDto[];
}
