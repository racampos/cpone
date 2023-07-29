import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';

import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

import { MintNftButton, InputTweet } from '@/components/client';

import { NftInfoCard } from '@/components/server';

export default async function MintNftPage({
  params,
}: {
  params: { nftTitle: string };
}) {
  const { nftTitle } = params;

  const originalTitle = nftTitle.split('-').join(' ');

  const cookiesStore = cookies();
  const addressCookie = cookiesStore.get('user');

  const address = addressCookie!.value;

  const nft = await prisma.nft.findFirst({
    where: {
      authorId: address,
      title: originalTitle,
    },
  });

  return (
    <div className="flex flex-col items-center justify-center content-center align-middle w-full">
      <h1 className="text-3xl font-bold my-4">{nft?.title}</h1>
      <div className="flex flex-col w-full h-full">
        <div className="flex flex-row">
          <div className="flex w-1/2 items-center justify-center">
            <img src={nft?.imageUrl} alt="selected image" className="" />
          </div>
          <div className="w-1/2">
            <div className="flex flex-col h-full items-center justify-center p-4 gap-y-10">
              <div className="w-full h-1/2 max-w-2xl px-6 shadow-md bg-white flex flex-col rounded-xl overflow-scroll relative">
                <NftInfoCard nft={nft!} />
              </div>
              <div className="w-full max-w-2xl p-6 shadow-md bg-white flex flex-col rounded-xl">
                <div className="flex flex-col items-center content-center justify-center gap-y-2 ">
                  <div className="flex gap-x-2 align-middle content-center items-center">
                    {nft?.endorsed ? (
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
                          <XMarkIcon
                            className="w-4 h-4 text-red-500"
                            aria-hidden="true"
                          />
                        </div>
                        <p className="text-lg">Not Endorsed</p>
                      </>
                    )}
                  </div>
                  <InputTweet endorser={nft!.endorser} nftHash={nft!.nftHash} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full">
          <MintNftButton
            endorsed={nft!.endorsed}
            minted={nft!.minted}
            ipfsLink={nft!.ipfsLink}
            etherscanLink={nft!.etherscanLink}
          />
        </div>
      </div>
    </div>
  );
}
