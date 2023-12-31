import { DropZone } from '@/components/client';

export default function RootPage() {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-full min-w-screen p-4">
        <div className="flex flex-col">
          <h1 className="sticky text-3xl font-bold mb-2 ">cpone</h1>
          <p className="sticky mb-8 text-center text-gray-700 ">
            Turn your images to endorsed NFTs
          </p>
        </div>
        <DropZone />
      </div>
    </>
  );
}
