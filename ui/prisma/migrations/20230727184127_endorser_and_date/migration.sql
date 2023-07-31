/*
  Warnings:

  - Added the required column `date` to the `Nft` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endorser` to the `Nft` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Nft" ADD COLUMN     "date" TEXT NOT NULL,
ADD COLUMN     "endorser" TEXT NOT NULL;
