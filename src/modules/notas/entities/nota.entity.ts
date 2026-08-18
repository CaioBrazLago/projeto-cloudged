import { NotaItem } from './nota-item.entity';

export class Nota {
  constructor(
    public readonly id: string,
    public readonly numeroNota: string,
    public readonly uf: string,
    public readonly dataEmissao: Date,
    public readonly creditoTotal: number,
    public readonly payloadHash: string,
    public readonly itens: NotaItem[],
  ) {}
}
