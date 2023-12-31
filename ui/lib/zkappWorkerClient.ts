import {
  fetchAccount,
  PublicKey,
  Field,
  Signature,
  Bool,
  PrivateKey,
} from 'snarkyjs';

import type {
  ZkappWorkerRequest,
  ZkappWorkerReponse,
  WorkerFunctions,
} from './zkappWorker';

export default class ZkappWorkerClient {
  // ---------------------------------------------------------------------------------------

  setActiveInstanceToBerkeley() {
    return this._call('setActiveInstanceToBerkeley', {});
  }

  loadContract() {
    return this._call('loadContract', {});
  }

  compileContract() {
    return this._call('compileContract', {});
  }

  fetchAccount({
    publicKey,
  }: {
    publicKey: PublicKey;
  }): ReturnType<typeof fetchAccount> {
    const result = this._call('fetchAccount', {
      publicKey58: publicKey.toBase58(),
    });
    return result as ReturnType<typeof fetchAccount>;
  }

  initZkappInstance(publicKey: PublicKey) {
    return this._call('initZkappInstance', {
      publicKey58: publicKey.toBase58(),
    });
  }

  async getNftHash(): Promise<Field> {
    const result = await this._call('getNftHash', {});
    return Field.fromJSON(JSON.parse(result as string));
  }

  async getEndorserHash(): Promise<Field> {
    const result = await this._call('getEndorserHash', {});
    return Field.fromJSON(JSON.parse(result as string));
  }

  async getOraclePublicKey(): Promise<PublicKey> {
    const result = await this._call('getOraclePublicKey', {});
    return PublicKey.fromJSON(JSON.parse(result as string));
  }

  async getIsEndorsed(): Promise<Bool> {
    const result = await this._call('getIsEndorsed', {});
    return Bool.fromJSON(JSON.parse(result as string));
  }

  createUpdateHashesTransaction(nftHash: string, endorserHash: string) {
    console.log({ nftHash, endorserHash });
    return this._call('createUpdateHashesTransaction', {
      nftHash: nftHash,
      endorserHash: endorserHash,
    });
  }

  createVerifyTransaction(
    feePayerPublicKey58: PublicKey,
    oracleNftHash: string,
    oracleEndorserHash: string,
    oracleSignature: string
  ) {
    return this._call('createVerifyTransaction', {
      feePayerPublicKey58: feePayerPublicKey58.toBase58(),
      nftHash: oracleNftHash,
      endorserHash: oracleEndorserHash,
      signature: oracleSignature,
    });
  }

  createDeployContract(
    privateKey58: PrivateKey,
    feePayerPublicKey58: PublicKey,
    nftHash: string,
    endorserHash: string
  ) {
    return this._call('createDeployContract', {
      privateKey58: privateKey58.toBase58(),
      feePayerPublicKey58: feePayerPublicKey58.toBase58(),
      nftHash: nftHash,
      endorserHash: endorserHash,
    });
  }

  createAttemptedUpdateIsEndorsedTransaction() {
    return this._call('createAttemptedUpdateIsEndorsedTransaction', {});
  }

  createProveTransaction() {
    return this._call('createProveTransaction', {});
  }

  async getTransactionJSON() {
    const result = await this._call('getTransactionJSON', {});
    return result;
  }

  async getEvents(): Promise<String> {
    const result = await this._call('getEvents', {});
    return result as string;
  }

  // ---------------------------------------------------------------------------------------

  worker: Worker;

  promises: {
    [id: number]: { resolve: (res: any) => void; reject: (err: any) => void };
  };

  nextId: number;

  constructor() {
    this.worker = new Worker(new URL('./zkappWorker.ts', import.meta.url));
    this.promises = {};
    this.nextId = 0;
    this.worker.onmessageerror = (event: MessageEvent) => {
      console.log(event);
    };
    this.worker.onmessage = (event: MessageEvent<ZkappWorkerReponse>) => {
      console.log(event);
      this.promises[event.data.id].resolve(event.data.data);
      delete this.promises[event.data.id];
    };
  }

  _call(fn: WorkerFunctions, args: any) {
    return new Promise((resolve, reject) => {
      this.promises[this.nextId] = { resolve, reject };
      const message: ZkappWorkerRequest = {
        id: this.nextId,
        fn,
        args,
      };
      console.log(message);
      this.worker.postMessage(message);
      this.nextId++;
    });
    // return '';
  }
}
