"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var axios_1 = require("axios");
var cheerio = require("cheerio");
var dishUrl = 'https://www.marmiton.org/recettes/index/categorie/plat-principal';
var dessertUrl = 'https://www.marmiton.org/recettes/index/categorie/dessert';
var prisma = new client_1.PrismaClient();
function slugTitle(title) {
    return title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .replace(/^-+|-+$/g, '');
}
function createUniqueSlug(title) {
    return __awaiter(this, void 0, void 0, function () {
        var baseSlug, uniqueSlug, count;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    baseSlug = slugTitle(title);
                    uniqueSlug = baseSlug;
                    count = 1;
                    _a.label = 1;
                case 1: return [4 /*yield*/, prisma.recipes.findUnique({ where: { slug: uniqueSlug } })];
                case 2:
                    if (!_a.sent()) return [3 /*break*/, 3];
                    uniqueSlug = "".concat(baseSlug, "-").concat(count);
                    count++;
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/, uniqueSlug];
            }
        });
    });
}
function scrapeRecipeDetails(link) {
    return __awaiter(this, void 0, void 0, function () {
        var data, $_1, ingredients_1, steps_1, preparationTime_1, restingTime_1, cookingTime_1, totalTime, difficulty_1, budget_1, people, value, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.get(link)];
                case 1:
                    data = (_a.sent()).data;
                    $_1 = cheerio.load(data);
                    ingredients_1 = [];
                    steps_1 = [];
                    preparationTime_1 = 0;
                    restingTime_1 = 0;
                    cookingTime_1 = 0;
                    totalTime = 0;
                    difficulty_1 = null;
                    budget_1 = null;
                    people = 0;
                    $_1('.card-ingredient-title').each(function (_, element) {
                        var quantity = $_1(element).find('.card-ingredient-quantity .count').text().trim();
                        var unit = $_1(element).find('.card-ingredient-quantity .unit').text().trim();
                        var name = $_1(element).find('.ingredient-name').text().trim();
                        var complement = $_1(element).find('.ingredient-complement').text().trim();
                        var ingredient = quantity && unit ? "".concat(quantity, " ").concat(unit, " de ").concat(name)
                            : quantity ? "".concat(quantity, " ").concat(name)
                                : name;
                        if (complement) {
                            ingredient += " ".concat(complement);
                        }
                        ingredients_1.push(ingredient.trim());
                    });
                    // Extract times
                    $_1('.time__details > div').each(function (_, element) {
                        var label = $_1(element).find('span').text().trim();
                        var timeText = $_1(element).find('div').text().trim();
                        var timeInMinutes = 0;
                        if (timeText !== '-') {
                            var timeMatch = timeText.match(/(\d+)\s*h\s*(\d+)?|(\d+)\s*min/);
                            if (timeMatch) {
                                var hours = parseInt(timeMatch[1]) || 0;
                                var minutes = parseInt(timeMatch[2]) || parseInt(timeMatch[3]) || 0;
                                timeInMinutes = (hours * 60) + minutes;
                            }
                        }
                        if (label.includes('Préparation')) {
                            preparationTime_1 = timeInMinutes;
                        }
                        else if (label.includes('Repos')) {
                            restingTime_1 = timeInMinutes;
                        }
                        else if (label.includes('Cuisson')) {
                            cookingTime_1 = timeInMinutes;
                        }
                    });
                    // Total time
                    totalTime = preparationTime_1 + restingTime_1 + cookingTime_1;
                    // Difficulty and budget
                    $_1('.recipe-primary__item .icon-difficulty + span').each(function (_, element) {
                        difficulty_1 = $_1(element).text().trim() || null;
                    });
                    $_1('.recipe-primary__item .icon-price + span').each(function (_, element) {
                        budget_1 = $_1(element).text().trim() || null;
                    });
                    // Steps
                    $_1('.recipe-step-list__container > p').each(function (_, element) {
                        var step = $_1(element).text().trim();
                        if (step)
                            steps_1.push(step);
                    });
                    value = $_1('input.recipe-ingredients__qt-counter__value.title-5').attr('value');
                    people = parseInt(value || '0');
                    return [2 /*return*/, {
                            preparationTime: preparationTime_1,
                            restingTime: restingTime_1,
                            cookingTime: cookingTime_1,
                            totalTime: totalTime,
                            ingredients: ingredients_1,
                            steps: steps_1,
                            difficulty: difficulty_1,
                            budget: budget_1,
                            people: people,
                        }];
                case 2:
                    error_1 = _a.sent();
                    console.error("Error fetching recipe details from ".concat(link, ":"), error_1);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function scrapeRecipes(url, type) {
    return __awaiter(this, void 0, void 0, function () {
        var page, hasMorePages, _loop_1, state_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    page = 1;
                    hasMorePages = true;
                    _loop_1 = function () {
                        var currentPageUrl, data, $_2, recipes_3, _i, recipes_1, recipe, details, _b, _c, recipes_2, recipe, existingRecipe, error_2, error_3;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    _d.trys.push([0, 15, , 16]);
                                    currentPageUrl = "".concat(url, "/").concat(page);
                                    return [4 /*yield*/, axios_1.default.get(currentPageUrl)];
                                case 1:
                                    data = (_d.sent()).data;
                                    $_2 = cheerio.load(data);
                                    recipes_3 = [];
                                    $_2('.recipe-card').each(function (index, element) {
                                        var title = $_2(element).find('.recipe-card__title').text().trim();
                                        var link = $_2(element).find('a').attr('href');
                                        var image = $_2(element).find('img').attr('src');
                                        if (link) {
                                            recipes_3.push({ title: title, link: link, image: image });
                                        }
                                    });
                                    if (recipes_3.length === 0) {
                                        hasMorePages = false;
                                        console.log('No more recipes found. Stopping the scraper.');
                                        return [2 /*return*/, "break"];
                                    }
                                    _i = 0, recipes_1 = recipes_3;
                                    _d.label = 2;
                                case 2:
                                    if (!(_i < recipes_1.length)) return [3 /*break*/, 6];
                                    recipe = recipes_1[_i];
                                    return [4 /*yield*/, scrapeRecipeDetails(recipe.link)];
                                case 3:
                                    details = _d.sent();
                                    if (!details) return [3 /*break*/, 5];
                                    Object.assign(recipe, details);
                                    _b = recipe;
                                    return [4 /*yield*/, createUniqueSlug(recipe.title)];
                                case 4:
                                    _b.slug = _d.sent();
                                    _d.label = 5;
                                case 5:
                                    _i++;
                                    return [3 /*break*/, 2];
                                case 6:
                                    _d.trys.push([6, 13, , 14]);
                                    _c = 0, recipes_2 = recipes_3;
                                    _d.label = 7;
                                case 7:
                                    if (!(_c < recipes_2.length)) return [3 /*break*/, 12];
                                    recipe = recipes_2[_c];
                                    return [4 /*yield*/, prisma.recipes.findUnique({
                                            where: { title: recipe.title },
                                        })];
                                case 8:
                                    existingRecipe = _d.sent();
                                    if (!!existingRecipe) return [3 /*break*/, 10];
                                    return [4 /*yield*/, prisma.recipes.create({
                                            data: {
                                                title: recipe.title,
                                                type: type,
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
                                        })];
                                case 9:
                                    _d.sent();
                                    console.log("Recipe '".concat(recipe.title, "' added to the database with type '").concat(type, "' and slug '").concat(recipe.slug, "'."));
                                    return [3 /*break*/, 11];
                                case 10:
                                    console.log("Recipe '".concat(recipe.title, "' already exists. Skipping insertion."));
                                    _d.label = 11;
                                case 11:
                                    _c++;
                                    return [3 /*break*/, 7];
                                case 12: return [3 /*break*/, 14];
                                case 13:
                                    error_2 = _d.sent();
                                    console.error('Error while adding data to the database:', error_2);
                                    return [3 /*break*/, 14];
                                case 14:
                                    page += 1;
                                    return [3 /*break*/, 16];
                                case 15:
                                    error_3 = _d.sent();
                                    console.error("Error fetching page ".concat(page, ": "), error_3);
                                    hasMorePages = false;
                                    return [3 /*break*/, 16];
                                case 16: return [2 /*return*/];
                            }
                        });
                    };
                    _a.label = 1;
                case 1:
                    if (!hasMorePages) return [3 /*break*/, 3];
                    return [5 /*yield**/, _loop_1()];
                case 2:
                    state_1 = _a.sent();
                    if (state_1 === "break")
                        return [3 /*break*/, 3];
                    return [3 /*break*/, 1];
                case 3: return [4 /*yield*/, prisma.$disconnect()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
scrapeRecipes(dishUrl, "DISH");
scrapeRecipes(dessertUrl, "DESSERT");
