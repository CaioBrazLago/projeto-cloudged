import type { Server } from 'node:http';

import type { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';

describe('POST /notas', () => {
  let app!: INestApplication;
  let prisma!: PrismaService;

  const numeroNota = 'TEST-POST-NOTA';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get(PrismaService);

    await app.init();
  });

  beforeEach(async () => {
    await prisma.nota.deleteMany({
      where: {
        numeroNota,
      },
    });
  });

  afterAll(async () => {
    await prisma.nota.deleteMany({
      where: {
        numeroNota,
      },
    });

    await app.close();
  });

  it('deve calcular e persistir uma nota fiscal', async () => {
    const payload = {
      numeroNota,
      uf: 'SP',
      dataEmissao: '2024-06-01',
      itens: [
        {
          ncm: '1006.30.00',
          quantidade: 10,
          valorUnitario: 50,
        },
        {
          ncm: '9999.99.99',
          quantidade: 5,
          valorUnitario: 20,
        },
      ],
    };

    const httpServer = app.getHttpServer() as Server;

    const response = await request(httpServer)
      .post('/notas')
      .send(payload)
      .expect(201);

    expect(response.body).toEqual({
      numeroNota,
      creditoTotal: 20,
      itens: [
        {
          ncm: '1006.30.00',
          aliquota: 0.04,
          credito: 20,
        },
        {
          ncm: '9999.99.99',
          status: 'PENDENTE_ALIQUOTA',
        },
      ],
    });

    const notaPersistida = await prisma.nota.findUnique({
      where: {
        numeroNota,
      },
    });

    expect(notaPersistida).not.toBeNull();
  });
});
