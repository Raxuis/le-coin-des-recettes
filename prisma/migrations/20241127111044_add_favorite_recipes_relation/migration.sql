-- CreateTable
CREATE TABLE "_FavoriteRecipes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FavoriteRecipes_AB_unique" ON "_FavoriteRecipes"("A", "B");

-- CreateIndex
CREATE INDEX "_FavoriteRecipes_B_index" ON "_FavoriteRecipes"("B");

-- AddForeignKey
ALTER TABLE "_FavoriteRecipes" ADD CONSTRAINT "_FavoriteRecipes_A_fkey" FOREIGN KEY ("A") REFERENCES "Recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavoriteRecipes" ADD CONSTRAINT "_FavoriteRecipes_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
