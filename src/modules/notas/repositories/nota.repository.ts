import { Nota } from '../entities/nota.entity';

export abstract class NotaRepository {
  abstract create(nota: Nota): Promise<Nota>;

  abstract findByNumeroNota(numeroNota: string): Promise<Nota | null>;

  abstract findAll(): Promise<Nota[]>;
}
