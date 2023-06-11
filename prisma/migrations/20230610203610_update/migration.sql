/*
  Warnings:

  - You are about to drop the column `licencia` on the `Usuario` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Usuario_licencia_key";

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "licencia";
