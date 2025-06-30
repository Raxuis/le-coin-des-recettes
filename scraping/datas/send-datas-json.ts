import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import type { Recipes } from '@prisma/client';

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadRecipesFromFile = (): Omit<Recipes, 'id'>[] => {
  const filePath = path.join(__dirname, 'recipes.json');
  const fileData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileData);
};

async function main() {
  try {
    const recipesData = loadRecipesFromFile();

    for (const recipe of recipesData) {
      const alreadyExistingRecipe = await prisma.recipes.findUnique({
        where: {
          slug: recipe.slug ?? '',
        },
      });
      if (alreadyExistingRecipe) {
        console.log(`La recette "${recipe.title}" existe déjà !`);
        continue;
      }
      await prisma.recipes.create({
        data: recipe,
      });
      console.log(`Recette "${recipe.title}" ajoutée avec succès !`);
    }
    console.log('Toutes les recettes ont été ajoutées !');
  } catch (error) {
    console.error('Erreur lors de l\'insertion des recettes : ', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
