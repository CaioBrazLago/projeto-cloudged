import { Injectable } from '@nestjs/common';

import { NotaRepository } from '../repositories/nota.repository';

export interface FindAllNotasResult {
  numeroNota: string;
  uf: string;
  dataEmissao: Date;
  creditoTotal: number;
}

@Injectable()
export class FindAllNotasService {
  constructor(private readonly notasRepository: NotaRepository) {}

  async execute(): Promise<FindAllNotasResult[]> {
    const notas = await this.notasRepository.findAll();

    return notas.map((nota) => ({
      numeroNota: nota.numeroNota,
      uf: nota.uf,
      dataEmissao: nota.dataEmissao,
      creditoTotal: nota.creditoTotal,
    }));
  }
}
