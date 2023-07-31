/*
  Warnings:

  - A unique constraint covering the columns `[nftHash]` on the table `Nft` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Nft_nftHash_key" ON "Nft"("nftHash");
