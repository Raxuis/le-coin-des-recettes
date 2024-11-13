import { z } from "zod";
import { budget, category, difficulty, SPECIAL_EVENTS } from "@/constants";

export const searchSpecialEventsRecipes = z.object({
  eventType: z.enum(SPECIAL_EVENTS, {
    errorMap: () => ({ message: `L'évènement est obligatoire et doit être une des valeurs : ${SPECIAL_EVENTS.join(", ")}.` }),
  }),
});

export const newRecipe = z.object({
  title: z.string().min(1, {
    "message": "Le titre est nécessaire."
  }).max(100, {
    "message": "Doucement sur le titre..."
  }).trim(),
  description: z.string().optional(),
  eventType: z.enum(category, {
    "message": "La catégorie est nécessaire."
  }),
  people: z.number({
    "message": "Le nombre de personnes est requis."
  }).min(0, {
    "message": "Doit être supérieur à 0."
  }),
  ingredients: z.string().min(1, {
    "message": "Au moins un ingrédient est nécessaire."
  }),
  steps: z.string().min(1, {
    "message": "Au moins une étape est nécessaire."
  }),
  preparationTime: z.number({
    "message": "Le temps est requis."
  }).min(0, {
    "message": "La temps doit être supérieur à 0."
  }),
  restingTime: z.number({
    "message": "Le temps est requis."
  }).min(0, {
    "message": "La temps doit être supérieur à 0."
  }),
  cookingTime: z.number({
    "message": "Le temps est requis."
  }).min(0, {
    "message": "La temps doit être supérieur à 0."
  }),
  difficulty: z.enum(difficulty, {
    "message": "Le difficulté est nécessaire."
  }),
  budget: z.enum(budget, {
    "message": "Le budget est nécessaire."
  }),
  specialEvent: z.enum(SPECIAL_EVENTS).optional(),
  slug: z.string().optional(),
});
