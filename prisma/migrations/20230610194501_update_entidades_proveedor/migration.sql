/*
  Warnings:

  - You are about to drop the column `proveedorId` on the `Egreso` table. All the data in the column will be lost.
  - You are about to drop the column `cantidad` on the `Proveedor` table. All the data in the column will be lost.
  - You are about to drop the column `descripcion` on the `Proveedor` table. All the data in the column will be lost.
  - You are about to drop the column `fecha` on the `Proveedor` table. All the data in the column will be lost.
  - You are about to drop the column `precio` on the `Proveedor` table. All the data in the column will be lost.
  - You are about to drop the column `titulo` on the `Proveedor` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_usuario]` on the table `Bus` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[licencia]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Egreso" DROP CONSTRAINT "Egreso_proveedorId_fkey";

-- AlterTable
ALTER TABLE "Egreso" DROP COLUMN "proveedorId",
ADD COLUMN     "productoId" INTEGER;

-- AlterTable
ALTER TABLE "Proveedor" DROP COLUMN "cantidad",
DROP COLUMN "descripcion",
DROP COLUMN "fecha",
DROP COLUMN "precio",
DROP COLUMN "titulo";

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "licencia" TEXT;

-- CreateTable
CREATE TABLE "Producto" (
    "id" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "proveedorId" INTEGER,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bus_id_usuario_key" ON "Bus"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_licencia_key" ON "Usuario"("licencia");

-- AddForeignKey
ALTER TABLE "Egreso" ADD CONSTRAINT "Egreso_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Proveedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
