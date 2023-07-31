import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';

import { prisma } from '@/lib/db';

export const config = {
  matcher: ['/collection/:path'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url);

  if (request.nextUrl.pathname.startsWith('/collection')) {
    revalidatePath('/collection');
  }
}
