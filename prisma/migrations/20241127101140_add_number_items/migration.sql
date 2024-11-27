/*
  Warnings:

  - Added the required column `number` to the `Items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Items" ADD COLUMN     "number" INTEGER NOT NULL;
