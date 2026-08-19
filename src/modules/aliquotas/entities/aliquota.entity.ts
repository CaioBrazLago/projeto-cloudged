export class Aliquota {
  constructor(
    public readonly id: string,
    public readonly uf: string,
    public readonly ncm: string,
    public readonly aliquota: number,
    public readonly dataInicio: Date,
    public readonly dataFim: Date | null,
  ) {}
}
