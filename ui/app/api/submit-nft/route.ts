import { NextResponse } from 'next/server';
import { CircuitString, Poseidon } from 'snarkyjs';
import crypto from 'crypto';

import { prisma } from '@/lib/db';

interface SubmitNftBody {
  title: string;
  author: string;
  description: string;
  endorser: string;
  date: string;
  address: string;
  imageUrl: string;
  zkAppPrivateKey: string;
}

export async function POST(request: Request) {
  const {
    title,
    author,
    description,
    endorser,
    date,
    address,
    // prehash,
    imageUrl,
    zkAppPrivateKey,
  }: SubmitNftBody = await request.json();

  const preHashString = {
    address,
    title,
    author,
    description,
    imageUrl,
    endorser,
  };

  const nftSha256Hash = crypto.createHash('sha256');

  const nftSha256Digested = nftSha256Hash
    .update(JSON.stringify(preHashString))
    .digest('hex');

  const nft = await prisma.nft.create({
    data: {
      title,
      author,
      description,
      endorser,
      date,
      imageUrl,
      zkAppPrivateKey,
      nftHash: nftSha256Digested,
      owner: {
        connect: {
          address: address,
        },
      },
    },
  });

  return NextResponse.json({ ...nft });
}
