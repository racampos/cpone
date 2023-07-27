'use client';
import { useState } from 'react';

export default function MintNft() {
  return (
    <button
      type="button"
      className="rounded-md bg-indigo-600 px-3.5 w-1/2 py-2.5 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      Mint
    </button>
  );
}
