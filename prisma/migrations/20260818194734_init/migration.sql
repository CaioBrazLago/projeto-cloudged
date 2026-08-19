-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('CALCULADO', 'PENDENTE_ALIQUOTA');

-- CreateTable
CREATE TABLE "aliquotas" (
    "id" TEXT NOT NULL,
    "uf" VARCHAR(2) NOT NULL,
    "ncm" VARCHAR(8) NOT NULL,
    "aliquota" DECIMAL(5,4) NOT NULL,
    "dataInicio" DATE NOT NULL,
    "dataFim" DATE,

    CONSTRAINT "aliquotas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notas" (
    "id" TEXT NOT NULL,
    "numeroNota" TEXT NOT NULL,
    "uf" VARCHAR(2) NOT NULL,
    "dataEmissao" DATE NOT NULL,
    "creditoTotal" DECIMAL(15,2) NOT NULL,
    "payloadHash" VARCHAR(64) NOT NULL,

    CONSTRAINT "notas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nota_itens" (
    "id" TEXT NOT NULL,
    "ncm" VARCHAR(8) NOT NULL,
    "quantidade" DECIMAL(15,4) NOT NULL,
    "valorUnitario" DECIMAL(15,2) NOT NULL,
    "aliquota" DECIMAL(5,4),
    "credito" DECIMAL(15,2),
    "status" "ItemStatus" NOT NULL,
    "notaId" TEXT NOT NULL,

    CONSTRAINT "nota_itens_pkey" PRIMARY KEY ("id")
);

CREATE TYPE "UserRole" AS ENUM ('OPERADOR', 'AUDITOR');

CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "usuario" VARCHAR(100) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role" "UserRole" NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_usuario_key"
ON "users"("usuario");


-- CreateIndex
CREATE INDEX "aliquotas_uf_ncm_idx" ON "aliquotas"("uf", "ncm");

-- CreateIndex
CREATE UNIQUE INDEX "notas_numeroNota_key" ON "notas"("numeroNota");

-- CreateIndex
CREATE INDEX "nota_itens_notaId_idx" ON "nota_itens"("notaId");

-- AddForeignKey
ALTER TABLE "nota_itens" ADD CONSTRAINT "nota_itens_notaId_fkey" FOREIGN KEY ("notaId") REFERENCES "notas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
