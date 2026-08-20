import type { Server } from 'node:http';

import type { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';

interface LoginResponse {
  role: string;
  access: string;
}

describe('Notas - Concorrência e idempotência', () => {
  let app!: INestApplication;
  let prisma!: PrismaService;
  let accessToken: string;

  const numeroNota = 'TEST-CONCORRENCIA';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    prisma = moduleFixture.get(PrismaService);

    await app.init();

    const httpServer = app.getHttpServer() as Server;

    const loginResponse = await request(httpServer)
      .post('/auth/login')
      .send({
        usuario: 'ana',
        senha: 'operador123',
      })
      .expect(200);

    const loginBody = loginResponse.body as LoginResponse;

    expect(loginBody.access).toBeDefined();

    accessToken = loginBody.access;
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

  it('deve persistir apenas uma nota em requisições simultâneas com o mesmo payload', async () => {
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
      ],
    };

    const httpServer = app.getHttpServer() as Server;

    const [response1, response2] = await Promise.all([
      request(httpServer)
        .post('/notas')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(payload),

      request(httpServer)
        .post('/notas')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(payload),
    ]);

    const statuses = [response1.status, response2.status].sort();

    expect(statuses).toEqual([200, 201]);

    const quantidadeNotas = await prisma.nota.count({
      where: {
        numeroNota,
      },
    });

    expect(quantidadeNotas).toBe(1);
  });
});
