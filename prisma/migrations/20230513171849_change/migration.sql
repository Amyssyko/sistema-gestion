/*
  Warnings:

  - The primary key for the `Buses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Buses` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Gasto" DROP CONSTRAINT "Gasto_id_bus_fkey";

-- DropForeignKey
ALTER TABLE "Ingreso" DROP CONSTRAINT "Ingreso_id_bus_fkey";

-- AlterTable
ALTER TABLE "Buses" DROP CONSTRAINT "Buses_pkey",
DROP COLUMN "id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD CONSTRAINT "Buses_pkey" PRIMARY KEY ("placa");

-- AlterTable
ALTER TABLE "Chofer" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Gasto" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Ingreso" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "Gasto" ADD CONSTRAINT "Gasto_id_bus_fkey" FOREIGN KEY ("id_bus") REFERENCES "Buses"("placa") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingreso" ADD CONSTRAINT "Ingreso_id_bus_fkey" FOREIGN KEY ("id_bus") REFERENCES "Buses"("placa") ON DELETE SET NULL ON UPDATE CASCADE;
