import { z } from "zod";
import { SpecialEvents } from "@prisma/client";

export const searchSpecialEventsRecipes = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters'),
  eventType: z.enum(Object.values(SpecialEvents) as [SpecialEvents, ...SpecialEvents[]]),
});
