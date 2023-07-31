'use client';
import { useState } from 'react';

import { cn } from '@/lib/utils';

export default function MintNftButton({
  endorsed,
  minted,
  etherscanLink,
  ipfsLink,
}: {
  endorsed: boolean;
  minted: boolean;
  etherscanLink: string | null;
  ipfsLink: string | null;
}) {
  return !minted ? (
    <button
      type="button"
      className={`${cn(
        endorsed
          ? 'bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600'
          : 'bg-gray-300 cursor-not-allowed'
      )} rounded-md px-3.5 w-1/2 py-2.5 text-base font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 `}
      disabled={!endorsed}
    >
      {!endorsed ? 'Not Endorsed Yet' : 'Mint'}
    </button>
  ) : (
    <div className="flex items-center justify-center">
      <a
        href={ipfsLink!}
        target="_blank"
        rel="noreferrer noopener"
        className="rounded-md bg-indigo-600 px-3.5 w-1/2 py-2.5 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        View NFT
      </a>
      <a
        href={etherscanLink!}
        target="_blank"
        rel="noreferrer noopener"
        className="rounded-md bg-pink-600 px-3.5 w-1/2 py-2.5 text-base font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
      >
        Etherscan Link
      </a>
    </div>
  );
}
