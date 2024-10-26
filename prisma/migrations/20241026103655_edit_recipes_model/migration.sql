/*
  Warnings:

  - You are about to drop the column `people` on the `Recipes` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Recipes` table. All the data in the column will be lost.
  - Added the required column `cookingTime` to the `Recipes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preparationTime` to the `Recipes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `restingTime` to the `Recipes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Recipes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Recipes" DROP COLUMN "people",
DROP COLUMN "tags",
ADD COLUMN     "cookingTime" INTEGER NOT NULL,
ADD COLUMN     "preparationTime" INTEGER NOT NULL,
ADD COLUMN     "restingTime" INTEGER NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
