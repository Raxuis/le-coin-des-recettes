import axios from 'axios';
import * as cheerio from 'cheerio';

const url = 'https://www.marmiton.org/recettes/index/categorie/plat-principal/';

async function scrapeRecipes() {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const recipes: any[] = [];

    $('.recipe-card').each((index, element) => {
      const title = $(element).find('.recipe-card__title').text().trim();
      const link = $(element).find('a').attr('href');

      recipes.push({
        title,
        link: link || ''
      });
    });

    console.log(recipes);
  } catch (error) {
    console.error('Error scraping the recipes:', error);
  }
}

scrapeRecipes();
