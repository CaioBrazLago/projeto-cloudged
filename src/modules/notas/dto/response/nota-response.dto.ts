import { NotaItemResponseDto } from './nota-item-response.dto';

export class NotaResponseDto {
  numeroNota!: string;
  creditoTotal!: number;
  itens!: NotaItemResponseDto[];
}
