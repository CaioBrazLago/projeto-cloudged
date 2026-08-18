import { ItemStatus } from './item-status.enum';

export class NotaItem {
  constructor(
    public readonly id: string,
    public readonly ncm: string,
    public readonly quantidade: number,
    public readonly valorUnitario: number,
    public readonly aliquota: number | null,
    public readonly credito: number | null,
    public readonly status: ItemStatus,
  ) {}
}
