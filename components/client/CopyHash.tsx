'use client';
import { useState } from 'react';
import {
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline';

export default function CopyHash({ hash }: { hash: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
  };

  return (
    <>
      {hash.slice(0, 16) + '...'}
      <span
        className="inline-block ml-2 text-gray-500 cursor-pointer"
        onClick={handleCopy}
      >
        {copied ? (
          <ClipboardDocumentCheckIcon className="w-4 h-4 text-green-500" />
        ) : (
          <ClipboardDocumentIcon className="w-4 h-4 text-gray-500" />
        )}
      </span>
    </>
  );
}
