import { Injectable } from '@nestjs/common';

import { AppError } from '../../../shared/errors/app-error';
import { ItemStatus } from '../enums/item-status.enum';
import { NotaRepository } from '../repositories/nota.repository';

export interface FindNotaResult {
  numeroNota: string;
  uf: string;
  dataEmissao: Date;
  creditoTotal: number;
  itens: {
    ncm: string;
    quantidade: number;
    valorUnitario: number;
    aliquota: number | null;
    credito: number | null;
    status: ItemStatus;
  }[];
}

@Injectable()
export class FindNotaService {
  constructor(private readonly notaRepository: NotaRepository) {}

  async execute(numeroNota: string): Promise<FindNotaResult> {
    const nota = await this.notaRepository.findByNumeroNota(numeroNota);

    if (!nota) {
      throw new AppError(
        `Nenhuma nota fiscal encontrada com o número ${numeroNota}`,
        404,
      );
    }

    return {
      numeroNota: nota.numeroNota,
      uf: nota.uf,
      dataEmissao: nota.dataEmissao,
      creditoTotal: nota.creditoTotal,
      itens: nota.itens.map((item) => ({
        ncm: item.ncm,
        quantidade: item.quantidade,
        valorUnitario: item.valorUnitario,
        aliquota: item.aliquota,
        credito: item.credito,
        status: item.status,
      })),
    };
  }
}
