'use client';

import { useState, useEffect, useContext } from 'react';
import {
  CheckIcon,
  XMarkIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

import { InputTweet } from '@/components/client';
import { MinaContext } from '@/lib/MinaContext';
// import type { PrivateKey } from 'snarkyjs';

interface EndorseSectionProps {
  endorser: string;
  nftHash: string;
  endorsed: boolean;
  zkAppPrivateKey58: string;
}

export default function EndorseSection({
  //   id,
  //   title,
  endorser,
  nftHash,
  endorsed,
  zkAppPrivateKey58,
}: //   authorId,
EndorseSectionProps) {
  const mina = useContext(MinaContext);
  const [isEndorsed, setIsEndorsed] = useState<boolean>(endorsed);
  const [correctZkAppPrivateKey, setCorrectZkAppPrivateKey] =
    useState<boolean>(false);
  // while initializing, change button to loading
  const [initializingZkApp, setInitializingZkApp] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const { PrivateKey } = await import('snarkyjs');

      const fetchedPrivateKey = PrivateKey.fromBase58(zkAppPrivateKey58);

      if (fetchedPrivateKey.equals(mina.zkAppPrivateKey!).toBoolean()) {
        console.log('zkAppPrivateKey is correct');
        setCorrectZkAppPrivateKey(true);
        setInitializingZkApp(false);
        return;
      }

      const fetchedPublicKey = fetchedPrivateKey.toPublicKey();

      await mina.ZkappWorkerClient!.fetchAccount({
        publicKey: fetchedPublicKey!,
      });

      console.log(`loading contract`);
      await mina.ZkappWorkerClient!.loadContract();
      console.log(`loading contract done`);

      console.log(`compiling contract`);
      await mina.ZkappWorkerClient!.compileContract();
      console.log(`compiling contract done`);

      console.log(`initZkappInstance`);
      await mina.ZkappWorkerClient!.initZkappInstance(fetchedPublicKey);
      console.log(`initZkappInstance done`);

      mina.setMinaState((state) => ({
        ...state,
        zkAppPrivateKey: fetchedPrivateKey,
        zkAppPublicKey: fetchedPublicKey,
      }));

      setInitializingZkApp(false);
      setCorrectZkAppPrivateKey(true);
    })();
  }, []);

  const handleCheckEndorse = async () => {
    if (initializingZkApp) return;
    if (!correctZkAppPrivateKey) return;

    const isEndorsedBool = await mina.ZkappWorkerClient!.getIsEndorsed();

    const isEndorsed = isEndorsedBool.toBoolean();

    console.log('isEndorsed', isEndorsed);

    setIsEndorsed(isEndorsed);

    if (isEndorsed) {
      console.log('isEndorsed');
      const res = await fetch('/api/endorse-nft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nftHash,
        }),
      });

      const { isEndorsed: isEndorsedServer }: { isEndorsed: string } =
        await res.json();
      mina.setCurrentNft((nft) => ({
        ...nft!,
        endorsed: isEndorsedServer === 'true' ? true : false,
      }));

      console.log(`isEndorsedServer: ${isEndorsedServer}`);
    }
  };

  return (
    <div className="flex flex-col items-center content-center justify-center gap-y-2 ">
      <div className="flex gap-x-2 align-middle content-center items-center">
        {mina.currentNft!.endorsed ? (
          <>
            <div className="mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
              <CheckIcon
                className="w-4 h-4 text-green-500"
                aria-hidden="true"
              />
            </div>
            <p className="text-lg">Endorsed</p>
          </>
        ) : (
          <>
            <div className="mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-100">
              <XMarkIcon className="w-4 h-4 text-red-500" aria-hidden="true" />
            </div>
            <p className="text-lg">Not Endorsed</p>
          </>
        )}
        <ArrowPathIcon
          className="h-5 w-5 text-gray-500 hover:cursor-pointer"
          onClick={handleCheckEndorse}
        />
      </div>
      <InputTweet
        endorser={mina.currentNft!.endorser}
        nftHash={mina.currentNft!.nftHash}
        isEndorsed={mina.currentNft!.endorsed}
        setIsEndorsed={setIsEndorsed}
        initializingZkApp={initializingZkApp}
      />
    </div>
  );
}
