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
        "title": "Rôti de boeuf aux légumes",
        author: "Auteur inconnu",
        "type": "PLAT",
        "people": 6,
        "slug": "roti-de-boeuf-aux-legumes",
        "ingredients": [
            "1,5 kg de rôti de boeuf",
            "4 carottes",
            "4 pommes de terre",
            "2 oignons",
            "3 gousses d'ail",
            "1 bouquet garni",
            "Huile d'olive",
            "Sel",
            "Poivre"
        ],
        "steps": [
            "Préchauffer le four à 200°C.",
            "Éplucher et couper les carottes et les pommes de terre en morceaux.",
            "Dans un plat allant au four, disposer les légumes, les oignons émincés et l'ail en chemise.",
            "Arroser d'huile d'olive, saler et poivrer.",
            "Poser le rôti sur les légumes, ajouter le bouquet garni.",
            "Enfourner pendant 50 minutes, en retournant le rôti à mi-cuisson."
        ],
        "preparationTime": 20,
        "restingTime": 0,
        "cookingTime": 50,
        "totalTime": 70,
        "difficulty": "Moyen",
        "budget": "Élevé",
        "specialEvent": "REPAS_FAMILLE",
        "creatorId": null,
        createdAt: new Date("2024-11-05T13:40:00.000Z"),
        updatedAt: new Date("2024-11-05T13:40:00.000Z")
    },
    {
        "title": "Gratin dauphinois",
        author: "Auteur inconnu",
        "type": "PLAT",
        "people": 6,
        "slug": "gratin-dauphinois",
        "ingredients": [
            "1 kg de pommes de terre",
            "50 cl de crème fraîche",
            "2 gousses d'ail",
            "30g de beurre",
            "Sel",
            "Poivre",
            "Noix de muscade"
        ],
        "steps": [
            "Préchauffer le four à 160°C.",
            "Éplucher et couper les pommes de terre en fines rondelles.",
            "Frotter un plat à gratin avec une gousse d'ail, puis beurrer le fond.",
            "Disposer les pommes de terre en couches dans le plat.",
            "Verser la crème, saler, poivrer et ajouter une pincée de noix de muscade.",
            "Cuire au four pendant 1h30."
        ],
        "preparationTime": 15,
        "restingTime": 0,
        "cookingTime": 90,
        "totalTime": 105,
        "difficulty": "Facile",
        "budget": "Bon marché",
        "specialEvent": "REPAS_FAMILLE",
        "creatorId": null,
        createdAt: new Date("2024-11-05T13:40:00.000Z"),
        updatedAt: new Date("2024-11-05T13:40:00.000Z")
    },
    {
        "title": "Poulet rôti au four",
        author: "Auteur inconnu",
        "type": "PLAT",
        "people": 4,
        "slug": "poulet-roti-au-four",
        "ingredients": [
            "1 poulet entier",
            "50g de beurre",
            "4 branches de thym",
            "Sel",
            "Poivre"
        ],
        "steps": [
            "Préchauffer le four à 200°C.",
            "Enduire le poulet de beurre ramolli, saler et poivrer.",
            "Insérer le thym dans la cavité du poulet.",
            "Placer le poulet dans un plat et enfourner pendant 1 heure en l'arrosant régulièrement de son jus.",
            "Laisser reposer 10 minutes avant de découper."
        ],
        "preparationTime": 10,
        "restingTime": 10,
        "cookingTime": 60,
        "totalTime": 80,
        "difficulty": "Facile",
        "budget": "Bon marché",
        "specialEvent": "REPAS_FAMILLE",
        "creatorId": null,
        createdAt: new Date("2024-11-05T13:40:00.000Z"),
        updatedAt: new Date("2024-11-05T13:40:00.000Z")
    },
    {
        "title": "Gâteau au chocolat fondant",
        author: "Auteur inconnu",
        "type": "DESSERT",
        "people": 8,
        "slug": "gateau-au-chocolat-fondant",
        "ingredients": [
            "200g de chocolat noir",
            "150g de beurre",
            "150g de sucre",
            "3 œufs",
            "50g de farine"
        ],
        "steps": [
            "Préchauffer le four à 180°C.",
            "Faire fondre le chocolat avec le beurre au bain-marie.",
            "Battre les œufs avec le sucre jusqu'à blanchiment.",
            "Ajouter le chocolat fondu et la farine au mélange.",
            "Verser la préparation dans un moule et cuire 20 minutes."
        ],
        "preparationTime": 15,
        "restingTime": 0,
        "cookingTime": 20,
        "totalTime": 35,
        "difficulty": "Facile",
        "budget": "Moyen",
        "specialEvent": "REPAS_FAMILLE",
        "creatorId": null,
        createdAt: new Date("2024-11-05T13:40:00.000Z"),
        updatedAt: new Date("2024-11-05T13:40:00.000Z")
    },
    {
        "title": "Quiche lorraine",
        author: "Auteur inconnu",
        "type": "PLAT",
        "people": 6,
        "slug": "quiche-lorraine",
        "ingredients": [
            "1 pâte brisée",
            "200g de lardons",
            "3 œufs",
            "20 cl de crème fraîche",
            "Sel",
            "Poivre",
            "Noix de muscade"
        ],
        "steps": [
            "Préchauffer le four à 180°C.",
            "Faire revenir les lardons dans une poêle.",
            "Dans un bol, battre les œufs avec la crème, le sel, le poivre et la noix de muscade.",
            "Étaler la pâte dans un moule, ajouter les lardons et verser la préparation.",
            "Enfourner pendant 30 minutes."
        ],
        "preparationTime": 10,
        "restingTime": 0,
        "cookingTime": 30,
        "totalTime": 40,
        "difficulty": "Facile",
        "budget": "Bon marché",
        "specialEvent": "REPAS_FAMILLE",
        "creatorId": null,
        createdAt: new Date("2024-11-05T13:40:00.000Z"),
        updatedAt: new Date("2024-11-05T13:40:00.000Z")
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
