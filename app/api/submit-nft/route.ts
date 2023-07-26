import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface SubmitNftBody {
  address: string;
  title: string;
  author: string;
  description: string;
  hash: string;
  imageUrl: string;
}

export async function POST(request: Request) {
  const { address, title, author, description, hash, imageUrl }: SubmitNftBody =
    await request.json();

  console.log({ address, title, author, description, hash, imageUrl });

  // const user = await prisma.user.findUnique({
  //   where: {
  //     address: address,
  //   },
  // });

  // if (!user) return { status: 404 };

  const nft = await prisma.nft.create({
    data: {
      title,
      author,
      description,
      imageUrl,
      hash,
      owner: {
        connect: {
          address: address,
        },
      },
    },
  });

  return NextResponse.json({ nft });
}
