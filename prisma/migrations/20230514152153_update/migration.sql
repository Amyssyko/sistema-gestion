/*
  Warnings:

  - You are about to drop the column `correo` on the `Chofer` table. All the data in the column will be lost.
  - You are about to drop the column `dirrecion` on the `Chofer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chofer" DROP COLUMN "correo",
DROP COLUMN "dirrecion",
ADD COLUMN     "calle" TEXT,
ADD COLUMN     "ciudad" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "provincia" TEXT;
