'use client';
import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import type ZkappWorkerClient from '@/lib/zkappWorkerClient';
import { Bool, Field } from 'snarkyjs';
import type { PublicKey, PrivateKey } from 'snarkyjs';

import { MinaContext } from '@/lib/MinaContext';

interface minaState {
  ZkappWorkerClient: ZkappWorkerClient | null;
  hasWallet: boolean | null;
  hasBeenSetup: boolean;
  accountExists: boolean;
  currentIsEndorsed: null | Bool;
  currentNftHash: null | Field;
  currentEndorserHash: null | Field;
  userPublicKey: null | PublicKey;
  zkAppPublicKey: null | PublicKey;
  zkAppPrivateKey: null | PrivateKey;
  creatingTransaction: false;
}

interface MinaContext extends minaState {
  setMinaState: Dispatch<SetStateAction<minaState>>;
}

export default function MinaProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [minaState, setMinaState] = useState<minaState>({
    ZkappWorkerClient: null,
    hasWallet: null,
    hasBeenSetup: false,
    accountExists: false,
    currentIsEndorsed: null,
    currentNftHash: null,
    currentEndorserHash: null,
    userPublicKey: null,
    zkAppPublicKey: null,
    zkAppPrivateKey: null,
    creatingTransaction: false,
  });

  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');

  useEffect(() => {
    async function timeout(seconds: number): Promise<void> {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, seconds * 1000);
      });
    }
    (async () => {
      if (!minaState.hasBeenSetup) {
        const { PublicKey, PrivateKey } = await import('snarkyjs');
        const ZkappWorkerClient = (await import('@/lib/zkappWorkerClient'))
          .default;
        const zkappWorkerClient = new ZkappWorkerClient();
        await timeout(5);
        const mina = (window as any).mina;
        await zkappWorkerClient.setActiveInstanceToBerkeley();

        if (!mina) {
          setMinaState({
            ...minaState,
            hasWallet: false,
          });
          return;
        }
        const publicKeyBase58: string = (await mina.requestAccounts())[0];

        const publicKey = PublicKey.fromBase58(publicKeyBase58);
        const res = await zkappWorkerClient.fetchAccount({
          publicKey: publicKey!,
        });
        const accountExists = res.error == null;
        console.log('accountExists', accountExists);

        const zkAppPrivateKey = PrivateKey.random();
        const zkAppPublicKey = zkAppPrivateKey.toPublicKey();

        setMinaState((state) => ({
          ...state,
          hasWallet: true,
          accountExists,
          userPublicKey: publicKey,
          zkAppPublicKey,
          zkAppPrivateKey,
          ZkappWorkerClient: zkappWorkerClient,
          hasBeenSetup: true,
        }));
      }
    })();
  }, []);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <MinaContext.Provider
      value={{
        ...minaState,
        setMinaState,
      }}
    >
      {mounted && children}
    </MinaContext.Provider>
  );
}
