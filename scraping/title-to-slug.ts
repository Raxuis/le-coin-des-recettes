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
      const slug = slugTitle(recipe.title);

      await prisma.recipes.update({
        where: { id: recipe.id },
        data: { slug: slug },
      });

      console.log(`Updated slug for recipe: ${recipe.title} -> ${slug}`);
    }
  } catch (error) {
    console.error('Error updating recipe slugs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateRecipeSlugs();
