import { Aliquota } from '../entities/aliquota.entity';
import { AliquotaRepository } from '../repositories/aliquota.repository';
import { AliquotaResolverService } from './aliquota-resolver.service';

describe('AliquotaResolverService', () => {
  let service: AliquotaResolverService;
  let aliquotaRepository: AliquotaRepository;

  let findByUfMock: jest.MockedFunction<AliquotaRepository['findByUf']>;

  beforeEach(() => {
    findByUfMock = jest.fn();

    aliquotaRepository = {
      findByUf: findByUfMock,
    };

    service = new AliquotaResolverService(aliquotaRepository);
  });

  it('deve escolher a alíquota mais específica pela hierarquia do NCM', async () => {
    findByUfMock.mockResolvedValue([
      new Aliquota('1', 'SP', '10', 0.03, new Date('2022-01-01'), null),
      new Aliquota('2', 'SP', '10063000', 0.04, new Date('2024-01-01'), null),
    ]);

    const result = await service.execute(
      'SP',
      '1006.30.00',
      new Date('2024-06-01'),
    );

    expect(result?.aliquota).toBe(0.04);
  });

  it('deve considerar os limites da vigência como inclusivos', async () => {
    findByUfMock.mockResolvedValue([
      new Aliquota(
        '1',
        'SP',
        '22',
        0.1,
        new Date('2023-01-01'),
        new Date('2025-12-31'),
      ),
    ]);

    const inicio = await service.execute(
      'SP',
      '2203.00.00',
      new Date('2023-01-01'),
    );

    const fim = await service.execute(
      'SP',
      '2203.00.00',
      new Date('2025-12-31'),
    );

    expect(inicio?.aliquota).toBe(0.1);
    expect(fim?.aliquota).toBe(0.1);
  });

  it('não deve considerar alíquota fora da vigência', async () => {
    findByUfMock.mockResolvedValue([
      new Aliquota(
        '1',
        'SP',
        '22',
        0.1,
        new Date('2023-01-01'),
        new Date('2025-12-31'),
      ),
    ]);

    const result = await service.execute(
      'SP',
      '2203.00.00',
      new Date('2026-01-01'),
    );

    expect(result).toBeNull();
  });

  it('deve retornar null quando não existir alíquota compatível', async () => {
    findByUfMock.mockResolvedValue([
      new Aliquota('1', 'SP', '10', 0.03, new Date('2022-01-01'), null),
    ]);

    const result = await service.execute(
      'SP',
      '9999.99.99',
      new Date('2024-06-01'),
    );

    expect(result).toBeNull();
  });
});
