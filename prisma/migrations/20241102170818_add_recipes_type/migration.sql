/*
  Warnings:

  - Added the required column `type` to the `Recipes` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RecipeTypes" AS ENUM ('DISH', 'DESSERT');

-- AlterTable
ALTER TABLE "Recipes" ADD COLUMN     "type" "RecipeTypes" NOT NULL;
