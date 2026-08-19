import { Injectable } from '@nestjs/common';

import { Aliquota } from '../entities/aliquota.entity';
import { AliquotaRepository } from '../repositories/aliquota.repository';

@Injectable()
export class AliquotaResolverService {
  constructor(private readonly aliquotaRepository: AliquotaRepository) {}

  async execute(
    uf: string,
    ncm: string,
    dataEmissao: Date,
  ): Promise<Aliquota | null> {
    const ncmNormalizado = this.normalizeNcm(ncm);

    const aliquotas = await this.aliquotaRepository.findByUf(uf.toUpperCase());

    const aliquotasCompativeis = aliquotas.filter(
      (aliquota) =>
        this.isVigente(aliquota, dataEmissao) &&
        ncmNormalizado.startsWith(aliquota.ncm),
    );

    if (aliquotasCompativeis.length === 0) {
      return null;
    }

    return aliquotasCompativeis.reduce((maisEspecifica, atual) => {
      if (atual.ncm.length > maisEspecifica.ncm.length) {
        return atual;
      }

      return maisEspecifica;
    });
  }

  private isVigente(aliquota: Aliquota, dataEmissao: Date): boolean {
    const iniciouVigencia = dataEmissao >= aliquota.dataInicio;

    const naoTerminouVigencia =
      aliquota.dataFim === null || dataEmissao <= aliquota.dataFim;

    return iniciouVigencia && naoTerminouVigencia;
  }

  private normalizeNcm(ncm: string): string {
    return ncm.replace(/\./g, '');
  }
}
