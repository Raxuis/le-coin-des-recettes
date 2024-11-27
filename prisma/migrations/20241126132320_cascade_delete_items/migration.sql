-- DropForeignKey
ALTER TABLE "Items" DROP CONSTRAINT "Items_ShoppingListId_fkey";

-- AddForeignKey
ALTER TABLE "Items" ADD CONSTRAINT "Items_ShoppingListId_fkey" FOREIGN KEY ("ShoppingListId") REFERENCES "ShoppingList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
