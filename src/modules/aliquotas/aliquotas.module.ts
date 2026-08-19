import { Module } from '@nestjs/common';

import { PrismaModule } from '../../database/prisma.module';
import { AliquotaRepository } from './repositories/aliquota.repository';
import { PrismaAliquotaRepository } from './repositories/prisma/prisma-aliquota.repository';
import { AliquotaResolverService } from './services/aliquota-resolver.service';

@Module({
  imports: [PrismaModule],
  providers: [
    AliquotaResolverService,
    {
      provide: AliquotaRepository,
      useClass: PrismaAliquotaRepository,
    },
  ],
  exports: [AliquotaResolverService],
})
export class AliquotasModule {}
