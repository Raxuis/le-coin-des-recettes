import type { RecipeTypes } from "@prisma/client";

export const SPECIAL_EVENTS = [
  'HALLOWEEN',
  'NOEL',
  'ANNIVERSAIRE',
  'SOIREE_ENTRE_AMIS',
  'REPAS_ETUDIANT',
  'REPAS_FAMILLE',
] as const;

export const difficulty = ['très facile', 'facile', 'moyenne']; // TODO: Add difficulties if found

export const budget = ['bon marché', "moyen", "assez cher"]; // TODO: Add budget if found

export const category: RecipeTypes[] = [
  "PLAT",
  "DESSERT"
];
