import { z } from "zod";
import { SPECIAL_EVENTS } from "@/constants";

export const searchSpecialEventsRecipes = z.object({
  eventType: z.enum(SPECIAL_EVENTS, {
    errorMap: () => ({ message: `L'évènement est obligatoire et doit être une des valeurs : ${SPECIAL_EVENTS.join(", ")}.` }),
  }),
});
