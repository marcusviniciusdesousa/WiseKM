-- CreateEnum
CREATE TYPE "TipoVeiculo" AS ENUM ('CARRO', 'MOTO');

-- CreateTable
CREATE TABLE "veiculos" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "tipo" "TipoVeiculo" NOT NULL,
    "codigoFipe" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "ano" TEXT NOT NULL,
    "valorFipeAtual" DOUBLE PRECISION NOT NULL,
    "quilometragem" INTEGER NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "veiculos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "veiculos_usuarioId_key" ON "veiculos"("usuarioId");

-- AddForeignKey
ALTER TABLE "veiculos" ADD CONSTRAINT "veiculos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
