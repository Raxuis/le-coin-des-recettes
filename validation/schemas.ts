import { z } from "zod";
import { budget, category, difficulty, SPECIAL_EVENTS } from "@/constants";

export const searchSpecialEventsRecipes = z.object({
  eventType: z.enum(SPECIAL_EVENTS, {
    errorMap: () => ({ message: `L'évènement est obligatoire et doit être une des valeurs : ${SPECIAL_EVENTS.join(", ")}.` }),
  }),
});

export const newRecipe = z.object({
  title: z.string().min(1).max(100).trim(),
  description: z.string().optional(),
  eventType: z.enum(category),
  people: z.number().optional(),
  ingredients: z.array(z.string()).min(1),
  steps: z.array(z.string()).min(1),
  preparationTime: z.number().min(0),
  restingTime: z.number().min(0),
  cookingTime: z.number().min(0),
  difficulty: z.enum(difficulty),
  budget: z.enum(budget),
  specialEvent: z.enum(SPECIAL_EVENTS).optional(),
  slug: z.string().optional(),
});
