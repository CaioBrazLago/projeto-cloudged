import { ConflictException, Injectable } from '@nestjs/common';
import { createHash } from 'node:crypto';

import { AppError } from '../../../shared/errors/app-error';
import { ErrorCode } from '../../../shared/errors/error-code.enum';
import { AliquotaResolverService } from '../../aliquotas/services/aliquota-resolver.service';
import { CreateNotaDto } from '../dto/request/create-nota.dto';
import { NotaItem } from '../entities/nota-item.entity';
import { Nota } from '../entities/nota.entity';
import { ItemStatus } from '../enums/item-status.enum';
import { NotaRepository } from '../repositories/nota.repository';

export interface CreateNotaResult {
  nota: Nota;
  created: boolean;
}

@Injectable()
export class NotasService {
  constructor(
    private readonly notaRepository: NotaRepository,
    private readonly aliquotaResolverService: AliquotaResolverService,
  ) {}

  async execute(dataRequest: CreateNotaDto): Promise<CreateNotaResult> {
    const payloadHash = this.generatePayloadHash(dataRequest);

    const notaExistente = await this.notaRepository.findByNumeroNota(
      dataRequest.numeroNota,
    );

    if (notaExistente) {
      return this.resolveExistingNota(notaExistente, payloadHash);
    }

    const dataEmissao = new Date(dataRequest.dataEmissao);

    const itens = await this.calculateItems(dataRequest, dataEmissao);

    const nota = new Nota(
      null,
      dataRequest.numeroNota,
      dataRequest.uf.toUpperCase(),
      dataEmissao,
      0,
      payloadHash,
      itens,
    );

    nota.calcularCreditoTotal();

    try {
      const notaCriada = await this.notaRepository.create(nota);

      return {
        nota: notaCriada,
        created: true,
      };
    } catch (error) {
      if (!this.isNotaAlreadyExistsError(error)) {
        throw error;
      }

      const notaConcorrente = await this.notaRepository.findByNumeroNota(
        dataRequest.numeroNota,
      );

      if (!notaConcorrente) {
        throw error;
      }

      return this.resolveExistingNota(notaConcorrente, payloadHash);
    }
  }

  private async calculateItems(
    dataRequest: CreateNotaDto,
    dataEmissao: Date,
  ): Promise<NotaItem[]> {
    const itens: NotaItem[] = [];

    for (const itemDto of dataRequest.itens) {
      const item = new NotaItem(
        null,
        this.normalizeNcm(itemDto.ncm),
        itemDto.quantidade,
        itemDto.valorUnitario,
        null,
        null,
        ItemStatus.PENDENTE_ALIQUOTA,
      );

      const aliquota = await this.aliquotaResolverService.execute(
        dataRequest.uf,
        itemDto.ncm,
        dataEmissao,
      );

      if (aliquota) {
        item.calcularCredito(aliquota.aliquota);
      }

      itens.push(item);
    }

    return itens;
  }

  private resolveExistingNota(
    nota: Nota,
    payloadHash: string,
  ): CreateNotaResult {
    if (nota.payloadHash !== payloadHash) {
      throw new ConflictException(
        'Já existe uma nota com este número e payload diferente',
      );
    }

    return {
      nota,
      created: false,
    };
  }

  private isNotaAlreadyExistsError(error: unknown): boolean {
    return (
      error instanceof AppError && error.code === ErrorCode.NOTA_ALREADY_EXISTS
    );
  }

  private generatePayloadHash(dto: CreateNotaDto): string {
    const payloadNormalizado = {
      numeroNota: dto.numeroNota,
      uf: dto.uf.toUpperCase(),
      dataEmissao: dto.dataEmissao,
      itens: dto.itens.map((item) => ({
        ncm: this.normalizeNcm(item.ncm),
        quantidade: item.quantidade,
        valorUnitario: item.valorUnitario,
      })),
    };

    return createHash('sha256')
      .update(JSON.stringify(payloadNormalizado))
      .digest('hex');
  }

  private normalizeNcm(ncm: string): string {
    return ncm.replace(/\./g, '');
  }
}
