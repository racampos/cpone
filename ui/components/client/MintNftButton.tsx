'use client';
import { useState, useEffect, useContext } from 'react';
import {
  useAccount,
  useConnect,
  useWalletClient,
  useContractWrite,
  usePrepareContractWrite,
} from 'wagmi';
import { useRouter } from 'next/navigation';

import { bytecode, CponeContract } from '@/lib/contract/CponeABI';
import { cponeContractAddress } from '@/lib/contants';
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
  const { address, connector, isConnected } = useAccount();

  const [showLinkToaster, setShowLinkToaster] = useState(false);

  const { config } = usePrepareContractWrite({
    address: cponeContractAddress,
    abi: CponeContract.abi,
    functionName: 'safeMint',
    args: [address!, mina.currentNft!.ipfsLink?.split('/')[4]!],
  });

  const {
    data,
    isLoading: isMintLoading,
    isSuccess: isMintSuccess,
    write,
  } = useContractWrite(config);

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

    console.log(`IPFS link: ${ipfsMetadataLink}`);

    mina.setCurrentNft((nft) => ({ ...nft!, ipfsLink: ipfsMetadataLink }));

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

    write!();
  };

  useEffect(() => {
    if (!isMintSuccess) return;
    console.log(JSON.stringify(data));

    const txHash = data?.hash;

    (async () => {
      const res = await fetch('/api/update-etherscan-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nftHash,
          txHash,
        }),
      });

      const { etherscanLink }: { etherscanLink: string } = await res.json();

      if (etherscanLink) {
        mina.setCurrentNft((nft) => ({
          ...nft!,
          etherscanLink: etherscanLink,
          minted: true,
        }));
      }
    })();
  }, [isMintSuccess]);

  return (
    <>
      {!mina.currentNft!.minted ? (
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
        <div className="flex border rounded-md overflow-hidden">
          <a
            href={mina.currentNft!.ipfsLink!}
            target="_blank"
            rel="noreferrer noopener"
            className="flex-1 flex items-center justify-center text-center py-2 px-5 border-r text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            IPFS Link
          </a>
          <a
            href={mina.currentNft!.etherscanLink!}
            target="_blank"
            rel="noreferrer noopener"
            className="flex-1 flex items-center justify-center text-center py-2 px-4 text-base font-semibold text-white bg-pink-600 hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 align-middle"
          >
            Etherscan
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
