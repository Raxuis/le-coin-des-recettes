-- CreateTable
CREATE TABLE "Recipes" (
    "id" TEXT NOT NULL,
    "author" TEXT,
    "tags" TEXT[],
    "ingredients" TEXT[],
    "steps" TEXT[],
    "people" INTEGER NOT NULL,
    "budget" INTEGER NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "prepTime" INTEGER NOT NULL,
    "totalTime" INTEGER NOT NULL,
    "creatorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recipes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Recipes" ADD CONSTRAINT "Recipes_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
