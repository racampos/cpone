'use client';
import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

import { ConnectWallet } from '@/components/client';

const navigation = [
  { name: 'Product', href: '#' },
  { name: 'Features', href: '#' },
  { name: 'Marketplace', href: '#' },
  { name: 'Company', href: '#' },
];

export default function Header() {
  return (
    <header className="bg-white bg-opacity-0">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex items-center gap-x-12">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img className="h-8 w-auto rounded-full" src="/logo.png" alt="" />
          </Link>
          <div className="hidden lg:flex lg:gap-x-12">
            <Link
              key="mint-nft"
              href="/mint"
              className="text-sm font-semibold leading-6 text-gray-900"
              prefetch={true}
            >
              Verify NFT
            </Link>
          </div>
        </div>
        <div className="flex">
          <ConnectWallet />
        </div>
      </nav>
    </header>
  );
}
