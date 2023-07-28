'use client';
import { useState } from 'react';

export default function InputTweet({
  endorser,
  nftHash,
}: {
  endorser: string;
  nftHash: string;
}) {
  const [tweetUrl, setTweetUrl] = useState('');
  const [fetching, setFetching] = useState(false);

  const handleTweetCheck = async () => {
    const res = await fetch('/api/check-tweet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tweetUrl, endorser, nftHash }),
    });

    setFetching(false);

    const { valid } = await res.json();
  };

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
