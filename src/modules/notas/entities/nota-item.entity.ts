import Decimal from 'decimal.js';
import { ItemStatus } from '../enums/item-status.enum';

export class NotaItem {
  constructor(
    private readonly _id: string | null,
    private readonly _ncm: string,
    private readonly _quantidade: number,
    private readonly _valorUnitario: number,
    private _aliquota: number | null,
    private _credito: number | null,
    private _status: ItemStatus,
  ) {}

  get id(): string | null {
    return this._id;
  }

  get ncm(): string {
    return this._ncm;
  }

  get quantidade(): number {
    return this._quantidade;
  }

  get valorUnitario(): number {
    return this._valorUnitario;
  }

  get aliquota(): number | null {
    return this._aliquota;
  }

  get credito(): number | null {
    return this._credito;
  }

  get status(): ItemStatus {
    return this._status;
  }

  calcularCredito(aliquota: number): void {
    const credito = new Decimal(this._quantidade)
      .mul(this._valorUnitario)
      .mul(aliquota)
      .toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

    this._aliquota = aliquota;
    this._credito = credito.toNumber();
    this._status = ItemStatus.CALCULADO;
  }

  marcarComoPendente(): void {
    this._aliquota = null;
    this._credito = null;
    this._status = ItemStatus.PENDENTE_ALIQUOTA;
  }
}
