import { ItemStatus } from '../enums/item-status.enum';
import { NotaItem } from './nota-item.entity';

describe('NotaItem', () => {
  it('deve calcular o crédito e arredondar para 2 casas usando round-half-up', () => {
    const item = new NotaItem(
      null,
      '10063000',
      1,
      100.05,
      null,
      null,
      ItemStatus.PENDENTE_ALIQUOTA,
    );

    item.calcularCredito(0.1);

    expect(item.aliquota).toBe(0.1);
    expect(item.credito).toBe(10.01);
    expect(item.status).toBe(ItemStatus.CALCULADO);
  });
});
