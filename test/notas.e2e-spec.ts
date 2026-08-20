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

describe('POST /notas', () => {
  let app!: INestApplication;
  let prisma!: PrismaService;
  let accessToken: string;

  const numeroNota = 'TEST-POST-NOTA';

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
      .set('Authorization', `Bearer ${accessToken}`)
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
