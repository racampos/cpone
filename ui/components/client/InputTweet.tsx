'use client';
import { useState, useEffect, useContext } from 'react';
import crypto from 'crypto';

import { MinaContext } from '@/lib/MinaContext';
import type { PrivateKey, Signature } from 'snarkyjs';

/**
 * @TODO - pass in a useState to change whether it has been endorsed or not, as well if it was minted.
 *
 *
 */
export default function InputTweet({
  endorser,
  nftHash,
  isEndorsed,
  setIsEndorsed,
  initializingZkApp,
}: {
  endorser: string;
  nftHash: string;
  isEndorsed: boolean;
  setIsEndorsed: React.Dispatch<React.SetStateAction<boolean>>;
  initializingZkApp: boolean;
}) {
  const [tweetUrl, setTweetUrl] = useState('');
  const [fetching, setFetching] = useState(false);
  const [fetchComplete, setFetchComplete] = useState(false);
  const [runVerify, setRunVerify] = useState(false);
  const [fetchedNFTData, setFetchedNFTData] = useState<{
    oracleNftHash: string;
    oracleEndorserHash: string;
    oracleSignature: string; // fix later
  }>({
    oracleNftHash: '',
    oracleEndorserHash: '',
    oracleSignature: '',
  });
  const mina = useContext(MinaContext);
  let transactionFee = 0.1;

  const handleVerify = async ({
    oracleNftHash,
    oracleEndorserHash,
    oracleSignature,
  }: {
    oracleNftHash: string;
    oracleEndorserHash: string;
    oracleSignature: string;
  }) => {
    const { Signature, PublicKey } = await import('snarkyjs');

    const minaWindow = (window as any).mina;
    console.log(`minaWindow: ${minaWindow}`);

    console.log('getting nftHash');
    const _nftHash = await mina.ZkappWorkerClient?.getNftHash();

    console.log(`nftHash: ${_nftHash}`);

    console.log('getting endorserHash');
    const _endorserHash = await mina.ZkappWorkerClient?.getEndorserHash();
    console.log(`endorserHash: ${_endorserHash}`);

    console.log('creating verify transaction');
    await mina.ZkappWorkerClient?.createVerifyTransaction(
      mina.zkAppPublicKey!,
      oracleNftHash,
      oracleEndorserHash,
      oracleSignature
    );
    console.log('created verify transaction');
    console.log('creating prove transaction');
    await mina.ZkappWorkerClient?.createProveTransaction();
    console.log('created prove transaction');
    const verifyTransactionJSON =
      await mina.ZkappWorkerClient?.getTransactionJSON();
    console.log('created transaction json');
    console.log('sending transaction');
    const { hash: verifyHash } = await (window as any).mina.sendTransaction({
      transaction: verifyTransactionJSON,
      feePayer: {
        fee: transactionFee,
        memo: '',
      },
    });
    console.log('sent transaction');
    console.log(
      'See transaction at https://berkeley.minaexplorer.com/transaction/' +
        verifyHash
    );
    setFetchComplete(true);
    const isNowEndorsed = (
      await mina.ZkappWorkerClient!.getIsEndorsed()
    ).toBoolean();
    isNowEndorsed ? console.log('Endorsed!') : console.log('Not endorsed!');

    // setIsEndorsed(isNowEndorsed);
  };

  const handleTweetCheck = async () => {
    const res = await fetch('/api/check-tweet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tweetUrl, endorser, nftHash }),
    });

    if (res.ok) {
      const {
        oracleNftHash,
        oracleEndorserHash,
        oracleSignature,
      }: {
        oracleNftHash: string;
        oracleEndorserHash: string;
        oracleSignature: any;
      } = await res.json();

      setFetchedNFTData({
        oracleNftHash,
        oracleEndorserHash,
        oracleSignature,
      });

      setRunVerify(true);

      // await handleVerify({
      //   oracleNftHash,
      //   oracleEndorserHash,
      //   oracleSignature,
      // });
    }
  };

  useEffect(() => {
    if (initializingZkApp || !runVerify) return;

    const { oracleNftHash, oracleEndorserHash, oracleSignature } =
      fetchedNFTData;

    (async () => {
      const { CircuitString, Poseidon } = await import('snarkyjs');

      try {
        console.log('creating verify transaction');
        await mina.ZkappWorkerClient?.createVerifyTransaction(
          mina.zkAppPublicKey!,
          oracleNftHash,
          oracleEndorserHash,
          oracleSignature
        );
        console.log('created verify transaction');

        console.log('creating prove transaction');
        await mina.ZkappWorkerClient?.createProveTransaction();
        console.log('created prove transaction');

        console.log('creating transaction json');
        const verifyTransactionJSON =
          await mina.ZkappWorkerClient?.getTransactionJSON();
        console.log('created transaction json');

        console.log('sending transaction');
        const { hash: verifyHash } = await (window as any).mina.sendTransaction(
          {
            transaction: verifyTransactionJSON,
            feePayer: {
              fee: transactionFee,
              memo: '',
            },
          }
        );
        console.log('sent transaction');

        console.log(
          'See transaction at https://berkeley.minaexplorer.com/transaction/' +
            verifyHash
        );

        setFetchComplete(true);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [initializingZkApp, runVerify]);

  return (
    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
      <input
        className="flex-grow px-3 py-2 outline-none"
        type="text"
        placeholder="https://twitter.com/..."
        value={tweetUrl}
        onChange={(e) => setTweetUrl(e.target.value)}
      />
      <button
        className="bg-gray-300 h-full text-gray-700 px-4 text-sm"
        onClick={() => {
          setFetching(true);
          handleTweetCheck();
        }}
        disabled={fetching || isEndorsed}
      >
        {fetching ? (
          <span className="animate-pulse ">
            <svg className="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
          </span>
        ) : (
          'Check Tweet'
        )}
      </button>
    </div>
  );
}
