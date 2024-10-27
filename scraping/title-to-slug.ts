import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export function slugTitle(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function updateRecipeSlugs() {
  try {
    const recipes = await prisma.recipes.findMany();

    for (const recipe of recipes) {
      let slug = slugTitle(recipe.title);
      let uniqueSlug = slug;
      let count = 1;

      // Checking if the slug is unique, if not, modify it
      while (await prisma.recipes.findUnique({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${slug}-${count}`;
        count++;
      }

      await prisma.recipes.update({
        where: { id: recipe.id },
        data: { slug: uniqueSlug },
      });

      console.log(`Updated slug for recipe: ${recipe.title} -> ${uniqueSlug}`);
    }
  } catch (error) {
    console.error('Error updating recipe slugs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateRecipeSlugs();
