/*
  Warnings:

  - The values [user] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `id_usuario` on the `Bus` table. All the data in the column will be lost.
  - The primary key for the `Usuario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[busPlaca]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('empleado', 'admin');
ALTER TABLE "Usuario" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "Usuario" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "Usuario" ALTER COLUMN "role" SET DEFAULT 'empleado';
COMMIT;

-- DropForeignKey
ALTER TABLE "Bus" DROP CONSTRAINT "Bus_id_usuario_fkey";

-- DropIndex
DROP INDEX "Bus_id_usuario_key";

-- AlterTable
ALTER TABLE "Bus" DROP COLUMN "id_usuario";

-- AlterTable
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_pkey",
ADD COLUMN     "busPlaca" TEXT,
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "dni" DROP NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'empleado',
ADD CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_busPlaca_key" ON "Usuario"("busPlaca");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_busPlaca_fkey" FOREIGN KEY ("busPlaca") REFERENCES "Bus"("placa") ON DELETE SET NULL ON UPDATE CASCADE;
