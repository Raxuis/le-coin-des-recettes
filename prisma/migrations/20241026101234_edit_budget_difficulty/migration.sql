/*
  Warnings:

  - You are about to drop the column `prepTime` on the `Recipes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Recipes" DROP COLUMN "prepTime",
ALTER COLUMN "budget" SET DATA TYPE TEXT,
ALTER COLUMN "difficulty" SET DATA TYPE TEXT;
