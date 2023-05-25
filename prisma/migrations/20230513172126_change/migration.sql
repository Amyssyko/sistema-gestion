/*
  Warnings:

  - You are about to drop the `Buses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Buses" DROP CONSTRAINT "Buses_id_chofer_fkey";

-- DropForeignKey
ALTER TABLE "Gasto" DROP CONSTRAINT "Gasto_id_bus_fkey";

-- DropForeignKey
ALTER TABLE "Ingreso" DROP CONSTRAINT "Ingreso_id_bus_fkey";

-- DropTable
DROP TABLE "Buses";

-- CreateTable
CREATE TABLE "Bus" (
    "placa" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "capacidad" INTEGER NOT NULL,
    "anio" INTEGER NOT NULL,
    "id_chofer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Bus_pkey" PRIMARY KEY ("placa")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bus_placa_key" ON "Bus"("placa");

-- AddForeignKey
ALTER TABLE "Bus" ADD CONSTRAINT "Bus_id_chofer_fkey" FOREIGN KEY ("id_chofer") REFERENCES "Chofer"("dni") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gasto" ADD CONSTRAINT "Gasto_id_bus_fkey" FOREIGN KEY ("id_bus") REFERENCES "Bus"("placa") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingreso" ADD CONSTRAINT "Ingreso_id_bus_fkey" FOREIGN KEY ("id_bus") REFERENCES "Bus"("placa") ON DELETE SET NULL ON UPDATE CASCADE;
