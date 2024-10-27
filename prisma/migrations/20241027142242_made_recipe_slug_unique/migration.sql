/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Recipes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Recipes_slug_key" ON "Recipes"("slug");
