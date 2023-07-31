/*
  Warnings:

  - You are about to drop the `NFT` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "NFT" DROP CONSTRAINT "NFT_authorId_fkey";

-- DropTable
DROP TABLE "NFT";

-- CreateTable
CREATE TABLE "Nft" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "hash" TEXT,
    "minted" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "Nft_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Nft" ADD CONSTRAINT "Nft_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("address") ON DELETE RESTRICT ON UPDATE CASCADE;
