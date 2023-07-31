-- CreateTable
CREATE TABLE "NFT" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "hash" TEXT,
    "minted" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "NFT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "address" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("address")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_address_key" ON "User"("address");

-- AddForeignKey
ALTER TABLE "NFT" ADD CONSTRAINT "NFT_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("address") ON DELETE RESTRICT ON UPDATE CASCADE;
