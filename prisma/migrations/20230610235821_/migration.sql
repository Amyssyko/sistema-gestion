/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Proveedor` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Proveedor_direccion_key";

-- CreateIndex
CREATE UNIQUE INDEX "Proveedor_email_key" ON "Proveedor"("email");
