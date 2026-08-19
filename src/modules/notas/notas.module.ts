import { Module } from '@nestjs/common';

import { PrismaModule } from '../../database/prisma.module';
import { AliquotasModule } from '../aliquotas/aliquotas.module';
import { NotasController } from './controllers/notas.controller';
import { NotaRepository } from './repositories/nota.repository';
import { PrismaNotaRepository } from './repositories/prisma/prisma-nota.repository';
import { NotasService } from './services/notas.service';

@Module({
  imports: [PrismaModule, AliquotasModule],
  controllers: [NotasController],
  providers: [
    NotasService,
    {
      provide: NotaRepository,
      useClass: PrismaNotaRepository,
    },
  ],
})
export class NotasModule {}
