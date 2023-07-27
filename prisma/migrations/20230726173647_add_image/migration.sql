/*
  Warnings:

  - Added the required column `imageUrl` to the `Nft` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Nft" ADD COLUMN     "imageUrl" TEXT NOT NULL;
