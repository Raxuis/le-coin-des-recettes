/*
  Warnings:

  - The values [DISH] on the enum `RecipeTypes` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RecipeTypes_new" AS ENUM ('PLAT', 'DESSERT');
ALTER TABLE "Recipes" ALTER COLUMN "type" TYPE "RecipeTypes_new" USING ("type"::text::"RecipeTypes_new");
ALTER TYPE "RecipeTypes" RENAME TO "RecipeTypes_old";
ALTER TYPE "RecipeTypes_new" RENAME TO "RecipeTypes";
DROP TYPE "RecipeTypes_old";
COMMIT;
