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
var prisma = new client_1.PrismaClient();
var recipesData = [
    {
        "title": "Doigts de sorcière ensanglantés",
        "type": "PLAT",
        "people": 6,
        "slug": "doigts-de-sorciere-ensanglantes",
        "author": "Chef Halloween",
        "ingredients": [
            "1 pâte feuilletée",
            "12 saucisses de Strasbourg",
            "Amandes effilées",
            "Ketchup pour le sang"
        ],
        "steps": [
            "Préchauffe le four à 180°C.",
            "Enroule une bande de pâte feuilletée autour de chaque saucisse, en laissant un bout découvert pour former l'ongle.",
            "Place une amande effilée au bout de chaque saucisse pour imiter un ongle.",
            "Fais cuire au four pendant 15 minutes jusqu'à ce que la pâte soit dorée.",
            "Sers avec du ketchup pour un effet ‘ensanglanté’."
        ],
        "preparationTime": 10,
        "restingTime": 0,
        "cookingTime": 15,
        "totalTime": 25,
        "difficulty": "Facile",
        "budget": "Bon marché",
        "creatorId": null,
        "createdAt": new Date("2024-11-05T13:40:00.000Z"),
        "updatedAt": new Date("2024-11-05T13:40:00.000Z"),
        "specialEvent": "HALLOWEEN"
    },
    {
        "title": "Pizza momies",
        "type": "PLAT",
        "people": 4,
        "slug": "pizza-momies",
        "author": "Chef Halloween",
        "ingredients": [
            "4 pains pita",
            "Sauce tomate",
            "Tranches de fromage",
            "Olives noires coupées en rondelles"
        ],
        "steps": [
            "Préchauffe le four à 200°C.",
            "Étale de la sauce tomate sur chaque pain pita.",
            "Dispose les tranches de fromage en bandes pour imiter les bandelettes de momie.",
            "Place des rondelles d'olives pour les yeux.",
            "Fais cuire au four pendant 10 minutes."
        ],
        "preparationTime": 5,
        "restingTime": 0,
        "cookingTime": 10,
        "totalTime": 15,
        "difficulty": "Facile",
        "budget": "Bon marché",
        "creatorId": null,
        "createdAt": new Date("2024-11-05T13:40:00.000Z"),
        "updatedAt": new Date("2024-11-05T13:40:00.000Z"),
        "specialEvent": "HALLOWEEN"
    },
    {
        "title": "Cupcakes citrouille d’Halloween",
        "type": "DESSERT",
        "people": 6,
        "slug": "cupcakes-citrouille-halloween",
        "author": "Chef Halloween",
        "ingredients": [
            "150g de sucre",
            "2 œufs",
            "100g de beurre fondu",
            "120ml de lait",
            "200g de farine",
            "1 cuillère à café de levure",
            "Colorant orange pour glaçage",
            "Pâte d’amande verte pour la décoration"
        ],
        "steps": [
            "Préchauffe le four à 180°C.",
            "Mélange le sucre, les œufs, le beurre fondu, le lait, la farine et la levure jusqu’à obtenir une pâte lisse.",
            "Verse la pâte dans des moules à cupcakes et fais cuire 15-20 minutes.",
            "Laisse refroidir, puis décore avec du glaçage coloré en orange et ajoute une tige en pâte d’amande verte pour imiter une citrouille."
        ],
        "preparationTime": 15,
        "restingTime": 0,
        "cookingTime": 20,
        "totalTime": 35,
        "difficulty": "Facile",
        "budget": "Moyen",
        "creatorId": null,
        "createdAt": new Date("2024-11-05T13:40:00.000Z"),
        "updatedAt": new Date("2024-11-05T13:40:00.000Z"),
        "specialEvent": "HALLOWEEN"
    },
    {
        "title": "Fantômes en meringue",
        "type": "DESSERT",
        "people": 4,
        "slug": "fantomes-meringue",
        "author": "Chef Halloween",
        "ingredients": [
            "2 blancs d’œufs",
            "100g de sucre",
            "Pépites de chocolat pour les yeux"
        ],
        "steps": [
            "Préchauffe le four à 100°C.",
            "Monte les blancs en neige en ajoutant le sucre progressivement jusqu'à obtenir une meringue ferme.",
            "Utilise une poche à douille pour former des petits fantômes sur une plaque de cuisson.",
            "Ajoute des pépites de chocolat pour faire les yeux.",
            "Fais cuire pendant 1h30 à 100°C jusqu'à ce que les meringues soient sèches."
        ],
        "preparationTime": 15,
        "restingTime": 0,
        "cookingTime": 90,
        "totalTime": 105,
        "difficulty": "Facile",
        "budget": "Bon marché",
        "creatorId": null,
        "createdAt": new Date("2024-11-05T13:40:00.000Z"),
        "updatedAt": new Date("2024-11-05T13:40:00.000Z"),
        "specialEvent": "HALLOWEEN"
    }
];
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, recipesData_1, recipe, alreadyExistingRecipe, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 6, 7, 9]);
                    _i = 0, recipesData_1 = recipesData;
                    _b.label = 1;
                case 1:
                    if (!(_i < recipesData_1.length)) return [3 /*break*/, 5];
                    recipe = recipesData_1[_i];
                    return [4 /*yield*/, prisma.recipes.findUnique({
                            where: {
                                slug: (_a = recipe.slug) !== null && _a !== void 0 ? _a : "",
                            },
                        })];
                case 2:
                    alreadyExistingRecipe = _b.sent();
                    if (alreadyExistingRecipe) {
                        console.log("La recette \"".concat(recipe.title, "\" existe d\u00E9j\u00E0 !"));
                        return [3 /*break*/, 4];
                    }
                    return [4 /*yield*/, prisma.recipes.create({
                            data: recipe,
                        })];
                case 3:
                    _b.sent();
                    console.log("Recette \"".concat(recipe.title, "\" ajout\u00E9e avec succ\u00E8s !"));
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 1];
                case 5:
                    console.log("Toutes les recettes ont été ajoutées !");
                    return [3 /*break*/, 9];
                case 6:
                    error_1 = _b.sent();
                    console.error("Erreur lors de l'insertion des recettes : ", error_1);
                    return [3 /*break*/, 9];
                case 7: return [4 /*yield*/, prisma.$disconnect()];
                case 8:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    });
}
main();
