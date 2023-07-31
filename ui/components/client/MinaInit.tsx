'use client';
import { useEffect, useState } from 'react';
import type ZkappWorkerClient from '@/lib/zkappWorkerClient';
import { Bool, Field, PublicKey, Struct } from 'snarkyjs';

interface minaState {
  ZkappWorkerClient: ZkappWorkerClient | null;
  hasWallet: boolean | null;
  hasBeenSetup: boolean;
  accountExists: boolean;
  currentIsEndorsed: null | Bool;
  currentNftHash: null | Field;
  currentEndorserHash: null | Field;
  publicKey: null | PublicKey;
  zkappPublicKey: null | PublicKey;
  creatingTransaction: false;
}

export default function MinaInit() {
  const [minaState, setMinaState] = useState<minaState>({
    ZkappWorkerClient: null,
    hasWallet: null,
    hasBeenSetup: false,
    accountExists: false,
    currentIsEndorsed: null,
    currentNftHash: null,
    currentEndorserHash: null,
    publicKey: null,
    zkappPublicKey: null,
    creatingTransaction: false,
  });

  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');

  useEffect(() => {
    (async () => {
      if (!minaState.hasBeenSetup) {
        const ZkappWorkerClient = (await import('@/lib/zkappWorkerClient'))
          .default;
        const zkappWorkerClient = new ZkappWorkerClient();
        console.log(zkappWorkerClient);
        console.log('hi');
        const mina = (window as any).mina;
        // await zkappWorkerClient.setActiveInstanceToBerkeley(); // nothing seems to run after this

        // if (!mina) {
        //   setMinaState({
        //     ...minaState,
        //     hasWallet: false,
        //   });
        //   return;
        // }
        // const publicKeyBase58: string = (await mina.requestAccounts())[0];
        // const publicKey = Struct;
        // console.log(publicKeyBase58);
        // console.log(publicKey);
        // const res = await zkappWorkerClient.fetchAccount({
        //   publicKey: publicKey!,
        // });
        // const accountExists = res.error == null;
        // console.log('accountExists', accountExists);
      }
    })();
  }, []);

  return <></>;
}
