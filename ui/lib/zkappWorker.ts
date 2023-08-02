import {
  Mina,
  PublicKey,
  fetchAccount,
  Field,
  Signature,
  Bool,
  PrivateKey,
  AccountUpdate,
} from 'snarkyjs';

type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

// ---------------------------------------------------------------------------------------

import { Cpone } from '@/lib/Cpone';

const state = {
  Cpone: null as null | typeof Cpone,
  zkapp: null as null | Cpone,
  transaction: null as null | Transaction,
};

// ---------------------------------------------------------------------------------------

const functions = {
  setActiveInstanceToBerkeley: async (args: {}) => {
    const Berkeley = Mina.Network(
      'https://proxy.berkeley.minaexplorer.com/graphql'
    );
    console.log('Berkeley Instance Created');
    Mina.setActiveInstance(Berkeley);
  },
  loadContract: async (args: {}) => {
    const { Cpone } = await import('@/lib/Cpone');
    state.Cpone = Cpone;
  },
  compileContract: async (args: {}) => {
    await state.Cpone!.compile();
  },
  fetchAccount: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    return await fetchAccount({ publicKey });
  },
  initZkappInstance: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    state.zkapp = new state.Cpone!(publicKey);
  },
  getNftHash: async (args: {}) => {
    const currentValue = await state.zkapp!.nftHash.get();
    return JSON.stringify(currentValue.toJSON());
  },
  getEndorserHash: async (args: {}) => {
    const currentValue = await state.zkapp!.endorserHash.get();
    return JSON.stringify(currentValue.toJSON());
  },
  getOraclePublicKey: async (args: {}) => {
    const currentValue = await state.zkapp!.oraclePublicKey.get();
    return JSON.stringify(currentValue.toJSON());
  },
  getIsEndorsed: async (args: {}) => {
    const currentValue = await state.zkapp!.isEndorsed.get();
    return JSON.stringify(currentValue.toJSON());
  },
  createUpdateHashesTransaction: async (args: {
    nftHash: string;
    endorserHash: string;
  }) => {
    console.log({ args });
    const transaction = await Mina.transaction(() => {
      state.zkapp!.setNftHash(Field(args.nftHash));
      state.zkapp!.setEndorserHash(Field(args.endorserHash));
    });
    state.transaction = transaction;
  },
  createVerifyTransaction: async (args: {
    feePayerPublicKey58: string;
    nftHash: string;
    endorserHash: string;
    signature: string;
  }) => {
    const feePayer: PublicKey = PublicKey.fromBase58(args.feePayerPublicKey58);

    console.log({ args });

    const transaction = await Mina.transaction(feePayer, () => {
      state.zkapp!.verify(
        Field(args.nftHash),
        Field(args.endorserHash),
        Signature.fromJSON(args.signature)
      );
    });
    state.transaction = transaction;
  },
  // Try to reset the isEndorsed flag back to false. Should fail.
  createAttemptedUpdateIsEndorsedTransaction: async (args: {}) => {
    const transaction = await Mina.transaction(() => {
      state.zkapp!.isEndorsed.set(Bool(false));
    });
    state.transaction = transaction;
  },

  createDeployContract: async (args: {
    privateKey58: string;
    feePayerPublicKey58: string;
    nftHash: string;
    endorserHash: string;
  }) => {
    const feePayer: PublicKey = PublicKey.fromBase58(args.feePayerPublicKey58);
    const zkAppPrivateKey: PrivateKey = PrivateKey.fromBase58(
      args.privateKey58
    );

    const transaction = await Mina.transaction(feePayer, () => {
      AccountUpdate.fundNewAccount(feePayer);
      state.zkapp!.deploy({});
      state.zkapp!.setNftHash(Field(args.nftHash));
      state.zkapp!.setEndorserHash(Field(args.endorserHash));
    });

    transaction.sign([zkAppPrivateKey]);
    state.transaction = transaction;
  },

  createProveTransaction: async (args: {}) => {
    await state.transaction!.prove();
  },
  getTransactionJSON: async (args: {}) => {
    return state.transaction!.toJSON();
  },
  getEvents: async (args: {}) => {
    const events = await state.zkapp!.fetchEvents();
    return events;
  },
};

// ---------------------------------------------------------------------------------------

export type WorkerFunctions = keyof typeof functions;

export type ZkappWorkerRequest = {
  id: number;
  fn: WorkerFunctions;
  args: any;
};

export type ZkappWorkerReponse = {
  id: number;
  data: any;
};

if (typeof window !== 'undefined') {
  addEventListener(
    'message',
    async (event: MessageEvent<ZkappWorkerRequest>) => {
      const returnData = await functions[event.data.fn](event.data.args);

      const message: ZkappWorkerReponse = {
        id: event.data.id,
        data: returnData,
      };
      console.log('Web Worker Response:', message);
      postMessage(message);
    }
  );
}

console.log('Web Worker Successfully Initialized.');
