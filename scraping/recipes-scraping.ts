import { PrismaClient, RecipeTypes, type Recipes } from '@prisma/client';
import axios from 'axios';
import * as cheerio from 'cheerio';

const dishUrl = 'https://www.marmiton.org/recettes/index/categorie/plat-principal';
const dessertUrl = 'https://www.marmiton.org/recettes/index/categorie/dessert';
const prisma = new PrismaClient();

function slugTitle(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function createUniqueSlug(title: string): Promise<string> {
  const baseSlug = slugTitle(title);
  let uniqueSlug = baseSlug;
  let count = 1;

  while (await prisma.recipes.findUnique({ where: { slug: uniqueSlug } })) {
    uniqueSlug = `${baseSlug}-${count}`;
    count++;
  }

  return uniqueSlug;
}

async function scrapeRecipeDetails(link: string) {
  try {
    const { data } = await axios.get(link);
    const $ = cheerio.load(data);

    const ingredients: string[] = [];
    const steps: string[] = [];
    let preparationTime = 0;
    let restingTime = 0;
    let cookingTime = 0;
    let totalTime = 0;
    let difficulty: string | null = null;
    let budget: string | null = null;
    let people = 0;

    // Extraction des ingrédients car div pour chaque élément sur site marmiton
    $('.card-ingredient-title').each((_, element) => {
      const quantity = $(element).find('.card-ingredient-quantity .count').text().trim();
      const unit = $(element).find('.card-ingredient-quantity .unit').text().trim();
      const name = $(element).find('.ingredient-name').text().trim();
      const complement = $(element).find('.ingredient-complement').text().trim();

      let ingredient = quantity && unit ? `${quantity} ${unit} de ${name}`
        : quantity ? `${quantity} ${name}`
          : name;

      if (complement) {
        ingredient += ` ${complement}`;
      }

      ingredients.push(ingredient.trim());
    });

    // Extraction des temps (préparation, repos, cuisson)
    $('.time__details > div').each((_, element) => {
      const label = $(element).find('span').text().trim();
      const timeText = $(element).find('div').text().trim();
      let timeInMinutes = 0;

      if (timeText !== '-') {
        const timeMatch = timeText.match(/(\d+)\s*h\s*(\d+)?|(\d+)\s*min/);
        if (timeMatch) {
          const hours = parseInt(timeMatch[1]) || 0;
          const minutes = parseInt(timeMatch[2]) || parseInt(timeMatch[3]) || 0;
          timeInMinutes = (hours * 60) + minutes;
        }
      }

      // Attribue le temps en fonction du label
      if (label.includes('Préparation')) {
        preparationTime = timeInMinutes;
      } else if (label.includes('Repos')) {
        restingTime = timeInMinutes;
      } else if (label.includes('Cuisson')) {
        cookingTime = timeInMinutes;
      }
    });

    // Calcul du temps total pour éviter de rechercher dans le DOM
    totalTime = preparationTime + restingTime + cookingTime;

    $('.recipe-primary__item .icon-difficulty + span').each((_, element) => {
      difficulty = $(element).text().trim() || null;
    });

    $('.recipe-primary__item .icon-price + span').each((_, element) => {
      budget = $(element).text().trim() || null;
    });

    $('.recipe-step-list__container > p').each((_, element) => {
      const step = $(element).text().trim();
      if (step) steps.push(step);
    });

    const value = $('input.recipe-ingredients__qt-counter__value.title-5').attr('value');
    people = parseInt(value || '0');

    return {
      preparationTime,
      restingTime,
      cookingTime,
      totalTime,
      ingredients,
      steps,
      difficulty,
      budget,
      people,
    };
  } catch (error) {
    console.error(`Error fetching recipe details from ${link}:`, error);
    return null;
  }
}

async function scrapeRecipes(url: string, type: RecipeTypes) {
  let page = 1;
  let hasMorePages = true;

  while (hasMorePages) {
    try {
      const currentPageUrl = `${url}/${page}`;
      const { data } = await axios.get(currentPageUrl);
      const $ = cheerio.load(data);
      const recipes: any[] = [];

      $('.recipe-card').each((index, element) => {
        const title = $(element).find('.recipe-card__title').text().trim();
        const link = $(element).find('a').attr('href');
        const image = $(element).find('img').attr('src');

        if (link) {
          recipes.push({ title, link, image });
        }
      });

      if (recipes.length === 0) {
        hasMorePages = false;
        console.log('No more recipes found. Stopping the scraper.');
        break;
      }

      for (const recipe of recipes) {
        const details = await scrapeRecipeDetails(recipe.link);
        if (details) {
          Object.assign(recipe, details);
          recipe.slug = await createUniqueSlug(recipe.title);
        }
      }

      try {
        for (const recipe of recipes) {
          const existingRecipe = await prisma.recipes.findUnique({
            where: { title: recipe.title },
          });

          if (!existingRecipe) {
            await prisma.recipes.create({
              data: {
                title: recipe.title,
                type,
                slug: recipe.slug,
                people: recipe.people,
                preparationTime: recipe.preparationTime,
                restingTime: recipe.restingTime,
                cookingTime: recipe.cookingTime,
                totalTime: recipe.totalTime,
                ingredients: recipe.ingredients,
                steps: recipe.steps,
                difficulty: recipe.difficulty || '',
                budget: recipe.budget || '',
              },
            });
            console.log(`Recipe '${recipe.title}' added to the database with type '${type}' and slug '${recipe.slug}'.`);
          } else {
            console.log(`Recipe '${recipe.title}' already exists. Skipping insertion.`);
          }
        }
      } catch (error) {
        console.error('Error while adding data to the database:', error);
      }

      page += 1;
    } catch (error) {
      console.error(`Error fetching page ${page}: `, error);
      hasMorePages = false;
    }
  }

  await prisma.$disconnect();
}

scrapeRecipes(dishUrl, "DISH");
scrapeRecipes(dessertUrl, "DESSERT");
