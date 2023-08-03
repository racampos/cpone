'use client';
import { useContext, useState, useEffect } from 'react';
import { PrismaNFT } from '@/lib/types';
import { MinaContext } from '@/lib/MinaContext';

export default function UpdateCurrentNft({
  nft,
  children,
}: {
  nft: PrismaNFT;
  children: React.ReactNode;
}) {
  const mina = useContext(MinaContext);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    mina.setCurrentNft(nft);
    setIsMounted(true);
  }, []);

  //   console.log(mina);

  return <>{isMounted && children}</>;
}
