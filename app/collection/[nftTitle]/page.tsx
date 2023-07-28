import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';

import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

import { MintNft, InputTweet } from '@/components/client';

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
      <div className="flex flex-row">
        <div className="flex w-1/2 items-center justify-center">
          <img src={nft?.imageUrl} alt="selected image" className="" />
        </div>
        <div className="w-1/2">
          <div className="flex flex-col h-full items-center justify-center p-4 gap-y-10">
            <div className="w-full h-1/2 max-w-2xl px-8 shadow-md z-50 bg-white flex flex-col rounded-xl overflow-scroll relative">
              {/* <div className="flex flex-col items-center content-center justify-center gap-y-1 ">
                <h1 className="text-3xl font-bold">{nft?.title}</h1>
                <p className="text-xl">{nft?.author}</p>
              </div> */}
              <NftInfoCard nft={nft!} />
            </div>
            <div className="w-full max-w-2xl p-6 shadow-md z-50 bg-white flex flex-col rounded-xl">
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
                      {/* <XCircleIcon
                      className="w-6 h-6 bg-red-300"
                      aria-hidden="true"
                    /> */}
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
                {/* <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                  <input
                    className="flex-grow px-3 py-2 outline-none"
                    type="text"
                    placeholder="https://twitter.com/..."
                    value={tweetLink}
                    onChange={}
                  />
                  <button className="bg-gray-300 h-full text-gray-700 px-4 text-sm">
                    Check Tweet
                  </button>
                </div> */}

                {/* <div className=" w-full pt-4">
                  <MintNft />
                </div> */}
                <InputTweet endorser={nft!.endorser} nftHash={nft!.nftHash} />
              </div>
            </div>
            <div className="w-full">
              <MintNft />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
