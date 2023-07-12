import { DropZone } from '@/components/client';

export default function RootPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 ">
      <h1 className="text-3xl font-bold mb-2">cpone</h1>
      <p className="mb-8 text-center text-gray-700">
        Turn your images to endorsed NFTs
      </p>
      <div className="w-full max-w-2xl p-8 rounded shadow-md z-50 bg-white">
        <DropZone />
      </div>
    </div>
  );
}
