/*
  Warnings:

  - Added the required column `zkAppPrivateKey` to the `Nft` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Nft" ADD COLUMN     "zkAppPrivateKey" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "contractAddress" TEXT,
ADD COLUMN     "contractDeployed" BOOLEAN NOT NULL DEFAULT false;
