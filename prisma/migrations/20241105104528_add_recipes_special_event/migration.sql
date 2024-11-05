-- CreateEnum
CREATE TYPE "SpecialEvents" AS ENUM ('HALLOWEEN', 'NOEL', 'ANNIVERSAIRE');

-- AlterTable
ALTER TABLE "Recipes" ADD COLUMN     "specialEvent" "SpecialEvents";
