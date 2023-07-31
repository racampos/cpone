import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import Image from 'next/image';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

export const revalidate = 1;

export default async function MintPage() {
  revalidatePath('/collection');

  const cookiesStore = cookies();
  const addressCookie = cookiesStore.get('user');

  const nfts = await prisma.nft.findMany({
    where: {
      authorId: addressCookie!.value,
    },
  });

  const handleNftLink = (title: string) => {
    const slug = title.split(' ').join('-');

    return `/collection/${slug}`;
  };

  return (
    <div className="flex flex-col mt-4 content-center items-center">
      <h1 className="sticky text-3xl font-bold mb-8">NFTs</h1>
      <ul
        role="list"
        className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8 w-11/12 max-h-[75vh] overflow-y-scroll"
      >
        {nfts.map((nft) => (
          <li key={`${nft.nftHash}`} className="relative px-3">
            <div className="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
              <img
                src={nft.imageUrl}
                alt=""
                className="pointer-events-none object-cover group-hover:opacity-75"
              />
              <Link
                href={{
                  pathname: handleNftLink(nft.title),
                  // query: { nft: nft.title },
                }}
                prefetch
                type="button"
                className="absolute inset-0 focus:outline-none"
              >
                <span className="sr-only">View details for {nft.title}</span>
              </Link>
            </div>
            <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">
              {nft.title}
            </p>
            <p className="pointer-events-none block text-sm font-medium text-gray-500">
              {nft.author}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
