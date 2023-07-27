import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';

// get the user
export async function GET(
  request: Request,
  context: { params: { address: string } }
) {
  const { address } = context.params;
  const user = await prisma.user.findUnique({
    where: {
      address: address,
    },
  });

  if (user) {
    cookies().set('user', user.address, {});
  }

  return NextResponse.json({ user });
  //   return {
  //     body: user,
  //   };
}

// create the user
export async function POST(
  request: Request,
  context: { params: { address: string } }
) {
  const { address } = context.params;

  const user = await prisma.user.create({
    data: {
      address: address,
    },
  });

  return NextResponse.json({ user });
}
