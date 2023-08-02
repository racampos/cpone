import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { nftHash } = await request.json();

  const nft = await prisma.nft.update({
    where: {
      nftHash,
    },
    data: {
      endorsed: true,
    },
  });

  return NextResponse.json({ isEndorsed: nft.endorsed });
}
