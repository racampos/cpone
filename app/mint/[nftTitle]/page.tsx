import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';

import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

import { MintNft } from '@/components/client';

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
    <div className="tems-center justify-center h-full w-full ">
      <div className="flex flex-row">
        <div className="flex w-1/2 items-center justify-center">
          <img src={nft?.imageUrl} alt="selected image" className="" />
        </div>
        <div className="w-1/2">
          <div className="flex flex-col items-center justify-center p-4 gap-y-10">
            <div className="w-full max-w-2xl p-8 shadow-md z-50 bg-white flex flex-col rounded-xl">
              <div className="flex flex-col items-center content-center justify-center gap-y-1 ">
                <h1 className="text-3xl font-bold">{nft?.title}</h1>
                <p className="text-xl">{nft?.author}</p>
              </div>
            </div>
            <div className="w-full max-w-2xl p-8 shadow-md z-50 bg-white flex flex-col rounded-xl">
              <div className="flex flex-col items-center content-center justify-center gap-y-1 ">
                <div className="flex gap-x-2 align-middle content-center items-center">
                  {nft?.endorsed || true ? (
                    <>
                      <div className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                        <CheckIcon
                          className="w-4 h-4 text-green-500"
                          aria-hidden="true"
                        />
                      </div>
                      <p className="text-xl">Endorsed</p>
                    </>
                  ) : (
                    <>
                      {/* <XCircleIcon
                      className="w-6 h-6 bg-red-300"
                      aria-hidden="true"
                    /> */}
                      <div className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
                        <XMarkIcon
                          className="w-4 h-4 text-red-500"
                          aria-hidden="true"
                        />
                      </div>
                      <p className="text-xl">Not Endorsed</p>
                    </>
                  )}
                </div>
                <div className=" w-full pt-4">
                  <MintNft />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
