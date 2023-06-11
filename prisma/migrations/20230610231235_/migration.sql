/*
  Warnings:

  - A unique constraint covering the columns `[direccion]` on the table `Proveedor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Proveedor_direccion_key" ON "Proveedor"("direccion");
