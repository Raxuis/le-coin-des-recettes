import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    if (!body) throw createError({ statusCode: 500, statusMessage: 'An error occurred, try again.' });
    return body;
});
