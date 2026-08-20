import { Module } from '@nestjs/common';

import { PrismaModule } from '../../database/prisma.module';
import { AliquotasModule } from '../aliquotas/aliquotas.module';
import { AuthModule } from '../auth/auth.module';
import { NotasController } from './controllers/notas.controller';
import { NotaRepository } from './repositories/nota.repository';
import { PrismaNotaRepository } from './repositories/prisma/prisma-nota.repository';
import { FindAllNotasService } from './services/find-all-notas.service';
import { FindNotaService } from './services/find-nota.service';
import { NotasService } from './services/notas.service';

@Module({
  imports: [PrismaModule, AliquotasModule, AuthModule],
  controllers: [NotasController],
  providers: [
    NotasService,
    FindAllNotasService,
    FindNotaService,
    {
      provide: NotaRepository,
      useClass: PrismaNotaRepository,
    },
  ],
})
export class NotasModule {}
