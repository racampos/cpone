'use client';

import * as React from 'react';
import { Config, WagmiConfig } from 'wagmi';

import { config } from '@/lib/wagmi';

export default function WagmiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return <WagmiConfig config={config}>{mounted && children}</WagmiConfig>;
}
