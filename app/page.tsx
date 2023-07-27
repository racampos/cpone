import { DropZone, ConnectWallet } from '@/components/client';
import { Header } from '@/components/client';

export default function RootPage() {
  return (
    <>
      {/* <div className="absolute top-5 right-10">
        <ConnectWallet />
      </div> */}

      <div className="flex flex-col items-center justify-center h-full min-w-screen p-4">
        <h1 className="sticky text-3xl font-bold mb-2 ">cpone</h1>
        <p className="sticky mb-8 text-center text-gray-700 ">
          Turn your images to endorsed NFTs
        </p>
        <DropZone />
      </div>
    </>
  );
}
