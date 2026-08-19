import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../database/prisma.service';
import {
  Prisma,
  ItemStatus as PrismaItemStatus,
} from '../../../../generated/prisma/client';
import { AppError } from '../../../../shared/errors/app-error';
import { ErrorCode } from '../../../../shared/errors/error-code.enum';
import { NotaItem } from '../../entities/nota-item.entity';
import { Nota } from '../../entities/nota.entity';
import { ItemStatus } from '../../enums/item-status.enum';
import { NotaRepository } from '../nota.repository';

type PrismaNotaComItens = Prisma.NotaGetPayload<{
  include: {
    itens: true;
  };
}>;

@Injectable()
export class PrismaNotaRepository extends NotaRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(nota: Nota): Promise<Nota> {
    try {
      const notaCriada = await this.prisma.nota.create({
        data: {
          numeroNota: nota.numeroNota,
          uf: nota.uf,
          dataEmissao: nota.dataEmissao,
          creditoTotal: nota.creditoTotal,
          payloadHash: nota.payloadHash,

          itens: {
            create: nota.itens.map((item) => ({
              ncm: item.ncm,
              quantidade: item.quantidade,
              valorUnitario: item.valorUnitario,
              aliquota: item.aliquota,
              credito: item.credito,
              status: this.toPrismaStatus(item.status),
            })),
          },
        },

        include: {
          itens: true,
        },
      });

      return this.toEntity(notaCriada);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new AppError(
          'Já existe uma nota com este número',
          409,
          ErrorCode.NOTA_ALREADY_EXISTS,
        );
      }

      throw error;
    }
  }

  async findByNumeroNota(numeroNota: string): Promise<Nota | null> {
    const nota = await this.prisma.nota.findUnique({
      where: {
        numeroNota,
      },
      include: {
        itens: true,
      },
    });

    if (!nota) {
      return null;
    }

    return this.toEntity(nota);
  }

  async findAll(): Promise<Nota[]> {
    const notas = await this.prisma.nota.findMany({
      include: {
        itens: true,
      },
      orderBy: {
        dataEmissao: 'desc',
      },
    });

    return notas.map((nota) => this.toEntity(nota));
  }

  private toEntity(nota: PrismaNotaComItens): Nota {
    const itens = nota.itens.map(
      (item) =>
        new NotaItem(
          item.id,
          item.ncm,
          Number(item.quantidade),
          Number(item.valorUnitario),
          item.aliquota !== null ? Number(item.aliquota) : null,
          item.credito !== null ? Number(item.credito) : null,
          this.toDomainStatus(item.status),
        ),
    );

    return new Nota(
      nota.id,
      nota.numeroNota,
      nota.uf,
      nota.dataEmissao,
      Number(nota.creditoTotal),
      nota.payloadHash,
      itens,
    );
  }

  private toPrismaStatus(status: ItemStatus): PrismaItemStatus {
    switch (status) {
      case ItemStatus.CALCULADO:
        return PrismaItemStatus.CALCULADO;

      case ItemStatus.PENDENTE_ALIQUOTA:
        return PrismaItemStatus.PENDENTE_ALIQUOTA;
    }
  }

  private toDomainStatus(status: PrismaItemStatus): ItemStatus {
    switch (status) {
      case PrismaItemStatus.CALCULADO:
        return ItemStatus.CALCULADO;

      case PrismaItemStatus.PENDENTE_ALIQUOTA:
        return ItemStatus.PENDENTE_ALIQUOTA;
    }
  }
}
