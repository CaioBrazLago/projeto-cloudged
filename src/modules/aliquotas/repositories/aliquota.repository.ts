import { Aliquota } from '../entities/aliquota.entity';

export abstract class AliquotaRepository {
  abstract findByUf(uf: string): Promise<Aliquota[]>;
}
