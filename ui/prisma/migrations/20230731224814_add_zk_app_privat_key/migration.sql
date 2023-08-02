/*
  Warnings:

  - Added the required column `zkAppPrivateKey` to the `Nft` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Nft" ADD COLUMN     "etherscanLink" TEXT,
ADD COLUMN     "ipfsLink" TEXT,
ADD COLUMN     "zkAppPrivateKey" TEXT NOT NULL;
