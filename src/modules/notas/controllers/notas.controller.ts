import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';

import { Roles } from '../../auth/decorators/roles.decorator';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '../../user/enums/user-role.enum';
import { CreateNotaDto } from '../dto/request/create-nota.dto';
import { NotaItemResponseDto } from '../dto/response/nota-item-response.dto';
import { NotaResponseDto } from '../dto/response/nota-response.dto';
import { NotaItem } from '../entities/nota-item.entity';
import { Nota } from '../entities/nota.entity';
import { ItemStatus } from '../enums/item-status.enum';
import {
  FindAllNotasResult,
  FindAllNotasService,
} from '../services/find-all-notas.service';
import { FindNotaResult, FindNotaService } from '../services/find-nota.service';
import { NotasService } from '../services/notas.service';

@Controller('notas')
export class NotasController {
  constructor(
    private readonly notasService: NotasService,
    private readonly findAllNotasService: FindAllNotasService,
    private readonly findNotaService: FindNotaService,
  ) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.OPERADOR)
  async create(
    @Body() dto: CreateNotaDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<NotaResponseDto> {
    const result = await this.notasService.execute(dto);

    response.status(result.created ? HttpStatus.CREATED : HttpStatus.OK);

    return this.toResponse(result.nota);
  }

  private toResponse(nota: Nota): NotaResponseDto {
    return {
      numeroNota: nota.numeroNota,
      creditoTotal: nota.creditoTotal,
      itens: nota.itens.map((item) => this.toItemResponse(item)),
    };
  }

  private toItemResponse(item: NotaItem): NotaItemResponseDto {
    if (item.status === ItemStatus.PENDENTE_ALIQUOTA) {
      return {
        ncm: this.formatNcm(item.ncm),
        status: ItemStatus.PENDENTE_ALIQUOTA,
      };
    }

    return {
      ncm: this.formatNcm(item.ncm),
      aliquota: item.aliquota ?? undefined,
      credito: item.credito ?? undefined,
    };
  }

  private formatNcm(ncm: string): string {
    return `${ncm.slice(0, 4)}.${ncm.slice(4, 6)}.${ncm.slice(6, 8)}`;
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.AUDITOR)
  async findAll(): Promise<FindAllNotasResult[]> {
    const notas = await this.findAllNotasService.execute();
    return notas;
  }

  @Get(':numeroNota')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.AUDITOR)
  async findByNumeroNota(
    @Param('numeroNota') numeroNota: string,
  ): Promise<FindNotaResult> {
    const nota = await this.findNotaService.execute(numeroNota);
    return nota;
  }
}
