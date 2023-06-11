/*
  Warnings:

  - You are about to drop the column `id_bus` on the `Egreso` table. All the data in the column will be lost.
  - You are about to drop the column `id_bus` on the `Ingreso` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Egreso" DROP CONSTRAINT "Egreso_id_bus_fkey";

-- DropForeignKey
ALTER TABLE "Ingreso" DROP CONSTRAINT "Ingreso_id_bus_fkey";

-- AlterTable
ALTER TABLE "Egreso" DROP COLUMN "id_bus",
ADD COLUMN     "busId" TEXT;

-- AlterTable
ALTER TABLE "Ingreso" DROP COLUMN "id_bus",
ADD COLUMN     "busId" TEXT;

-- AddForeignKey
ALTER TABLE "Ingreso" ADD CONSTRAINT "Ingreso_busId_fkey" FOREIGN KEY ("busId") REFERENCES "Bus"("placa") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Egreso" ADD CONSTRAINT "Egreso_busId_fkey" FOREIGN KEY ("busId") REFERENCES "Bus"("placa") ON DELETE SET NULL ON UPDATE CASCADE;
