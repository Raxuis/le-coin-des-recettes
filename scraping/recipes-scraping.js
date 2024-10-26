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
var axios_1 = require("axios");
var cheerio = require("cheerio");
var url = 'https://www.marmiton.org/recettes/index/categorie/plat-principal/';
function scrapeRecipeDetails(link) {
    return __awaiter(this, void 0, void 0, function () {
        var data, $_1, ingredients_1, steps_1, error_1;
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
                    // Extraction des ingrédients car div pour chaque élément sur site marmiton
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
                    $_1('.recipe-step-list__container > p').each(function (_, element) {
                        var step = $_1(element).text().trim();
                        if (step)
                            steps_1.push(step);
                    });
                    $_1('.recipe-primary__item > span');
                    return [2 /*return*/, { ingredients: ingredients_1, steps: steps_1 }];
                case 2:
                    error_1 = _a.sent();
                    console.error("Error fetching recipe details from ".concat(link, ":"), error_1);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function scrapeRecipes() {
    return __awaiter(this, void 0, void 0, function () {
        var data, $_2, recipes_2, _i, recipes_1, recipe, details, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, axios_1.default.get(url)];
                case 1:
                    data = (_a.sent()).data;
                    $_2 = cheerio.load(data);
                    recipes_2 = [];
                    $_2('.recipe-card').each(function (index, element) {
                        var title = $_2(element).find('.recipe-card__title').text().trim();
                        var link = $_2(element).find('a').attr('href');
                        var image = $_2(element).find('img').attr('src');
                        if (link) {
                            recipes_2.push({ title: title, link: link, image: image });
                        }
                    });
                    _i = 0, recipes_1 = recipes_2;
                    _a.label = 2;
                case 2:
                    if (!(_i < recipes_1.length)) return [3 /*break*/, 5];
                    recipe = recipes_1[_i];
                    return [4 /*yield*/, scrapeRecipeDetails(recipe.link)];
                case 3:
                    details = _a.sent();
                    recipe.details = details;
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    console.log(JSON.stringify(recipes_2, null, 2));
                    return [3 /*break*/, 7];
                case 6:
                    error_2 = _a.sent();
                    console.error('Error scraping the recipes:', error_2);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
scrapeRecipes();
