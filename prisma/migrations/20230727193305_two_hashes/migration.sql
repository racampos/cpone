/*
  Warnings:

  - You are about to drop the column `hash` on the `Nft` table. All the data in the column will be lost.
  - Added the required column `endorserHash` to the `Nft` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nftHash` to the `Nft` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Nft" DROP COLUMN "hash",
ADD COLUMN     "endorserHash" TEXT NOT NULL,
ADD COLUMN     "nftHash" TEXT NOT NULL;
