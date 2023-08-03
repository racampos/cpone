import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { nftHash, txHash } = await request.json();

  const etherscanLink = `https://sepolia.etherscan.io/tx/${txHash}`;

  const nft = await prisma.nft.update({
    where: {
      nftHash,
    },
    data: {
      etherscanLink: etherscanLink,
      minted: true,
    },
  });

  return NextResponse.json({ etherscanLink: nft.etherscanLink });
}
