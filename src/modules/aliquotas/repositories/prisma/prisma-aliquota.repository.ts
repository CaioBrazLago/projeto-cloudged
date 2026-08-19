import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../database/prisma.service';
import type { Aliquota as PrismaAliquota } from '../../../../generated/prisma/client';
import { Aliquota } from '../../entities/aliquota.entity';
import { AliquotaRepository } from '../aliquota.repository';

@Injectable()
export class PrismaAliquotaRepository extends AliquotaRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findByUf(uf: string): Promise<Aliquota[]> {
    const aliquotas = await this.prisma.aliquota.findMany({
      where: {
        uf,
      },
    });

    return aliquotas.map((aliquota) => this.toEntity(aliquota));
  }

  private toEntity(aliquota: PrismaAliquota): Aliquota {
    return new Aliquota(
      aliquota.id,
      aliquota.uf,
      aliquota.ncm,
      Number(aliquota.aliquota),
      aliquota.dataInicio,
      aliquota.dataFim,
    );
  }
}
