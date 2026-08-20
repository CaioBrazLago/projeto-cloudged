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
              status: item.status,
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
      orderBy: {
        dataEmissao: 'desc',
      },
    });

    return notas.map(
      (nota) =>
        new Nota(
          nota.id,
          nota.numeroNota,
          nota.uf,
          nota.dataEmissao,
          nota.creditoTotal.toNumber(),
          nota.payloadHash,
          [],
        ),
    );
  }

  private toEntity(nota: PrismaNotaComItens): Nota {
    const itens = nota.itens.map(
      (item) =>
        new NotaItem(
          item.id,
          item.ncm,
          item.quantidade.toNumber(),
          item.valorUnitario.toNumber(),
          item.aliquota !== null ? item.aliquota.toNumber() : null,
          item.credito !== null ? item.credito.toNumber() : null,
          this.toEntityStatus(item.status),
        ),
    );

    return new Nota(
      nota.id,
      nota.numeroNota,
      nota.uf,
      nota.dataEmissao,
      nota.creditoTotal.toNumber(),
      nota.payloadHash,
      itens,
    );
  }

  private toEntityStatus(status: PrismaItemStatus): ItemStatus {
    if (status === PrismaItemStatus.CALCULADO) {
      return ItemStatus.CALCULADO;
    }

    return ItemStatus.PENDENTE_ALIQUOTA;
  }
}
