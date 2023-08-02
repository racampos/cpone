'use client';
import { useState, useEffect, useContext } from 'react';
import { useAccount, useConnect, useWalletClient } from 'wagmi';
import { useRouter } from 'next/navigation';

import { bytecode, CponeAbi } from '@/lib/contract/CponeABI';
import { MinaContext } from '@/lib/MinaContext';
import { cn } from '@/lib/utils';
import { PrismaNFT } from '@/lib/types';
import { LinkToaster } from '@/components/client';

export default function MintNftButton({
  nft,
  contractDeployed,
  contractAddress,
}: {
  nft: PrismaNFT;
  contractDeployed: boolean;
  contractAddress: string | null;
}) {
  const {
    nftHash,
    title,
    description,
    imageUrl,
    endorser,
    date,
    minted,
    endorsed,
    ipfsLink,
    etherscanLink,
  } = nft;

  const mina = useContext(MinaContext);
  const [showLinkToaster, setShowLinkToaster] = useState(false);

  const { address, connector, isConnected } = useAccount();
  const { connect } = useConnect();
  const {
    data: walletClient,
    isError,
    isSuccess,
    isFetching,
    isFetched,
    isLoading,
    status,
  } = useWalletClient();

  const router = useRouter();

  useEffect(() => {
    if (!isConnected) router.replace('/');
  }, [isConnected]);

  const uploadToIPFS = async () => {
    const res = await fetch('/api/upload-to-ipfs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nftHash,
        imageUrl,
        title,
        description,
        endorser,
        date,
        zkAppPublicKey: mina.zkAppPublicKey,
      }),
    });

    const { error, ipfsMetadataLink } = await res.json();

    if (error) {
      console.log(error);
      return;
    }

    console.log(ipfsLink); // will then post ipfs link

    return ipfsLink;
  };

  // mint NFT as a single new contract here
  const handleMintNFT = async () => {
    console.log('minting NFT');

    if (!isConnected) {
      return;
    }

    const newIpfsLink = await uploadToIPFS();

    console.log('done');

    const hash = await walletClient?.deployContract({
      bytecode,
      abi: CponeAbi,
      args: [ipfsLink!],
    });

    console.log(hash);
  };

  const handleDeployContract = async () => {};

  return (
    <>
      {!minted ? (
        <button
          type="button"
          className={`${cn(
            endorsed
              ? 'bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600'
              : 'bg-gray-300 cursor-not-allowed'
          )} rounded-md px-3.5 w-1/2 py-2.5 text-base font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 `}
          disabled={!endorsed}
          onClick={handleMintNFT}
        >
          {!endorsed
            ? 'Not Endorsed Yet'
            : contractDeployed
            ? 'Deploy Contract'
            : 'Mint'}
        </button>
      ) : (
        <div className="flex items-center justify-center">
          <a
            href={ipfsLink!}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-md bg-indigo-600 px-3.5 w-1/2 py-2.5 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            View Metadata
          </a>
          <a
            href={etherscanLink!}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-md bg-pink-600 px-3.5 w-1/2 py-2.5 text-base font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
          >
            Etherscan Link
          </a>
        </div>
      )}
      {showLinkToaster && (
        <LinkToaster
          showLinkToaster={showLinkToaster}
          setShowLinkToaster={setShowLinkToaster}
          ipfsLink={ipfsLink!}
          etherscanLink={etherscanLink!}
        />
      )}
    </>
  );
}
