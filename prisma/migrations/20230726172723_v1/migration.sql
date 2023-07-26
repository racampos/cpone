/*
  Warnings:

  - Added the required column `author` to the `NFT` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `NFT` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "NFT" ADD COLUMN     "author" TEXT NOT NULL,
ALTER COLUMN "description" SET NOT NULL;
