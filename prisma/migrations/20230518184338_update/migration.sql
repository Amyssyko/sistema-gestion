/*
  Warnings:

  - You are about to drop the `Gasto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Ingreso` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Tipo" AS ENUM ('Ingreso', 'Egreso');

-- DropForeignKey
ALTER TABLE "Gasto" DROP CONSTRAINT "Gasto_id_bus_fkey";

-- DropForeignKey
ALTER TABLE "Ingreso" DROP CONSTRAINT "Ingreso_id_bus_fkey";

-- DropTable
DROP TABLE "Gasto";

-- DropTable
DROP TABLE "Ingreso";

-- CreateTable
CREATE TABLE "Transacion" (
    "id" TEXT NOT NULL,
    "tipo" "Tipo" NOT NULL,
    "fecha" DATE NOT NULL,
    "descripcion" TEXT NOT NULL,
    "monto" MONEY NOT NULL,
    "id_bus" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Transacion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transacion" ADD CONSTRAINT "Transacion_id_bus_fkey" FOREIGN KEY ("id_bus") REFERENCES "Bus"("placa") ON DELETE SET NULL ON UPDATE CASCADE;
