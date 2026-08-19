import { NotaItem } from './nota-item.entity';

export class Nota {
  constructor(
    private readonly _id: string | null,
    private readonly _numeroNota: string,
    private readonly _uf: string,
    private readonly _dataEmissao: Date,
    private _creditoTotal: number,
    private readonly _payloadHash: string,
    private readonly _itens: NotaItem[],
  ) {}

  get id(): string | null {
    return this._id;
  }

  get numeroNota(): string {
    return this._numeroNota;
  }

  get uf(): string {
    return this._uf;
  }

  get dataEmissao(): Date {
    return this._dataEmissao;
  }

  get creditoTotal(): number {
    return this._creditoTotal;
  }

  get payloadHash(): string {
    return this._payloadHash;
  }

  get itens(): ReadonlyArray<NotaItem> {
    return this._itens;
  }

  calcularCreditoTotal(): void {
    this._creditoTotal = this._itens.reduce(
      (total, item) => total + (item.credito ?? 0),
      0,
    );
  }
}
