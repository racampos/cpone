'use client';
import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

import { ConnectWallet } from '@/components/client';

export default function Header() {
  return (
    <header className="bg-opacity-0">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex flex-1">
          <div className="hidden lg:flex lg:gap-x-12">
            <Link
              key="mint-nft"
              href="/collection"
              className="text-sm font-semibold leading-6 text-gray-900"
              prefetch={true}
            >
              Your Collection
            </Link>
          </div>
        </div>
        <Link href="/" className="h-8 w-auto">
          <span className="sr-only">cpone</span>
          <img className="h-10 w-auto rounded-full" src="/logo.png" alt="" />
        </Link>
        <div className="flex flex-1 justify-end">
          <ConnectWallet />
        </div>
      </nav>
      {/* <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex items-center gap-x-6">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">cpone</span>
            <img className="h-8 w-auto rounded-full" src="/logo.png" alt="" />
          </Link>
          <div className="flex gap-x-12">
            <Link
              key="mint-nft"
              href="/collection"
              className="text-sm font-semibold leading-6 text-gray-900"
              prefetch={true}
            >
              Your Collection
            </Link>
          </div>
        </div>
        <div className="flex">
          <ConnectWallet />
        </div>
      </nav> */}
    </header>
  );
}
