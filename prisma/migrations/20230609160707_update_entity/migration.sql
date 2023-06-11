/*
  Warnings:

  - You are about to drop the column `id_chofer` on the `Bus` table. All the data in the column will be lost.
  - You are about to drop the `Chofer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transacion` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin');

-- DropForeignKey
ALTER TABLE "Bus" DROP CONSTRAINT "Bus_id_chofer_fkey";

-- DropForeignKey
ALTER TABLE "Transacion" DROP CONSTRAINT "Transacion_id_bus_fkey";

-- AlterTable
ALTER TABLE "Bus" DROP COLUMN "id_chofer",
ADD COLUMN     "id_usuario" TEXT;

-- DropTable
DROP TABLE "Chofer";

-- DropTable
DROP TABLE "Transacion";

-- DropEnum
DROP TYPE "Tipo";

-- CreateTable
CREATE TABLE "Ingreso" (
    "id" SERIAL NOT NULL,
    "fecha" DATE NOT NULL,
    "descripcion" TEXT NOT NULL,
    "monto" MONEY NOT NULL,
    "id_bus" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Ingreso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Egreso" (
    "id" SERIAL NOT NULL,
    "fecha" DATE NOT NULL,
    "descripcion" TEXT NOT NULL,
    "monto" MONEY NOT NULL,
    "id_bus" TEXT,
    "proveedorId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Egreso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "dni" VARCHAR(10) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'user',
    "nombre" TEXT,
    "apellido" TEXT,
    "telefono" VARCHAR(10),
    "email" TEXT,
    "password" TEXT,
    "provincia" TEXT,
    "ciudad" TEXT,
    "calle" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("dni")
);

-- CreateTable
CREATE TABLE "Proveedor" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "precio" MONEY NOT NULL,
    "nombre" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "direccion" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Proveedor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bus" ADD CONSTRAINT "Bus_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("dni") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingreso" ADD CONSTRAINT "Ingreso_id_bus_fkey" FOREIGN KEY ("id_bus") REFERENCES "Bus"("placa") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Egreso" ADD CONSTRAINT "Egreso_id_bus_fkey" FOREIGN KEY ("id_bus") REFERENCES "Bus"("placa") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Egreso" ADD CONSTRAINT "Egreso_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Proveedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
