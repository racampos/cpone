import Link from 'next/link';

import { CopyHash } from '@/components/client';

interface Nft {
  id: number;
  title: string;
  author: string;
  description: string;
  imageUrl: string;
  nftHash: string;
  minted: boolean;
  endorser: string;
  endorsed: boolean;
  authorId: string;
}

export default async function NftInfoCard({ nft }: { nft: Nft }) {
  const { author, description, nftHash, endorser } = nft;

  return (
    <div className="flex max-h-[40vh] border-gray-100">
      <dl className=" divide-y divide-gray-100">
        <div className="px-6 py-4 grid grid-cols-3 gap-4">
          <dt className="text-sm font-medium text-gray-900">Creator</dt>
          <dd className=" text-sm leading-6 text-gray-700 col-span-2 mt-0">
            {author}
          </dd>
        </div>
        <div className="px-6 py-4 grid grid-cols-3 gap-4">
          <dt className="text-sm font-medium text-gray-900">Description</dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
            {description}
          </dd>
        </div>
        <div className="px-6 py-4 grid grid-cols-3 gap-4">
          <dt className="text-sm font-medium text-gray-900">Endorser</dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
            <a
              href={`https://twitter.com/${endorser}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              {endorser}
            </a>
          </dd>
        </div>
        <div className="px-6 py-4 grid grid-cols-3 gap-4">
          <dt className="text-sm font-medium text-gray-900">NFT Hash</dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
            <CopyHash hash={nftHash} />
          </dd>
        </div>
      </dl>
    </div>
  );
}

// 0x9ad8a1f25fe8c6db83e0b86b175e3d5a3509cb1ab773807b217eb683ec9f0ebc
