import { ItemStatus } from '../../enums/item-status.enum';

export class NotaItemResponseDto {
  ncm!: string;
  aliquota?: number;
  credito?: number;
  status?: ItemStatus;
}
