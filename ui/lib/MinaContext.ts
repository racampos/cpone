import { createContext, Dispatch, SetStateAction } from 'react';
import type ZkappWorkerClient from '@/lib/zkappWorkerClient';
import type { Bool, Field, PublicKey, PrivateKey } from 'snarkyjs';

import { PrismaNFT } from '@/lib/types';

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
  currentNft: PrismaNFT | null;
  setCurrentNft: Dispatch<SetStateAction<PrismaNFT | null>>;
}

export const MinaContext = createContext<MinaContext>({
  setMinaState: () => {},
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
  currentNft: null,
  setCurrentNft: () => {},
});
