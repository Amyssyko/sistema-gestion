/*
  Warnings:

  - The values [Ingreso,Egreso] on the enum `Tipo` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Tipo_new" AS ENUM ('INGRESO', 'EGRESO');
ALTER TABLE "Transacion" ALTER COLUMN "tipo" TYPE "Tipo_new" USING ("tipo"::text::"Tipo_new");
ALTER TYPE "Tipo" RENAME TO "Tipo_old";
ALTER TYPE "Tipo_new" RENAME TO "Tipo";
DROP TYPE "Tipo_old";
COMMIT;
