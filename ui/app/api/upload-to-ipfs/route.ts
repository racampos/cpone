import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { Readable } from 'stream';
import FormData from 'form-data';
import axios from 'axios';

import { dataURLtoBuffer } from '@/lib/utils';

const JWT = process.env.PINATA_JWT_KEY!;

export async function POST(request: Request) {
  const {
    nftHash,
    imageUrl,
    title,
    description,
    endorser,
    date,
    zkAppPublicKey,
  }: {
    nftHash: string;
    imageUrl: string;
    title: string;
    description: string;
    endorser: string;
    date: string;
    zkAppPublicKey: string;
  } = await request.json();

  const nft = await prisma.nft.findUnique({
    where: {
      nftHash,
    },
  });

  if (!nft) {
    return NextResponse.json({
      error: new Error('NFT not found'),
      ipfsLink: '',
    });
  }
  const buffer = dataURLtoBuffer(imageUrl);

  const stream = Readable.from(buffer);
  const nftImageData = new FormData();

  nftImageData.append('file', stream, {
    filepath: `${title.split(' ').join('-')}.png`,
  });

  const res = await axios.post(
    'https://api.pinata.cloud/pinning/pinFileToIPFS',
    nftImageData,
    {
      maxBodyLength: Infinity,
      headers: {
        'Content-Type': `multipart/form-data; boundary=${nftImageData.getBoundary()}`,
        Authorization: `Bearer ${JWT}`,
      },
    }
  );

  const {
    IpfsHash,
    PinSize,
    Timestamp,
  }: { IpfsHash: string; PinSize: any; Timestamp: string } = res.data;

  const ledgerStateRes = await fetch(
    'https://zkbridge-api-9ce348502e1e.herokuapp.com/mina_ledger_state'
  );
  const ledgerState = await ledgerStateRes.json();

  const accountStateRes = await fetch(
    `https://zkbridge-api-9ce348502e1e.herokuapp.com/mina_account_state?address=${zkAppPublicKey}`
  );
  const accountState = await accountStateRes.json();

  const requestToolsLedgerRes = await fetch(
    'https://zkbridge-api-9ce348502e1e.herokuapp.com/request_tools',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: '32292',
        cost: '10',
        state: { ...ledgerState },
      }),
    }
  );

  const requestToolsLedger = await requestToolsLedgerRes.json();

  const requestToolsAccountRes = await fetch(
    'https://zkbridge-api-9ce348502e1e.herokuapp.com/request_tools',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: '79169223',
        cost: '10',
        state: { ...accountState },
      }),
    }
  );
  const requestToolsAccount = await requestToolsAccountRes.json();

  const proofLedgerRes = await fetch(
    `https://zkbridge-api-9ce348502e1e.herokuapp.com/get_proof?key=${requestToolsLedger._key}`
  );
  const proofLedger = await proofLedgerRes.json();

  const proofAccountRes = await fetch(
    `https://zkbridge-api-9ce348502e1e.herokuapp.com/get_proof?key=${requestToolsAccount._key}`
  );
  const proofAccount = await proofAccountRes.json();

  const metadata = JSON.stringify({
    title,
    imageUrl: `https://ipfs.io/ipfs/${IpfsHash}`,
    description,
    endorser,
    date,
    proofs: {
      ledger: proofLedger,
      account: proofAccount,
    },
  });

  const fullBuffer = Buffer.from(metadata, 'utf8');

  const fullNftFormData = new FormData();

  fullNftFormData.append('metadata', metadata);

  const metadataRes = await fetch(
    'https://api.pinata.cloud/pinning/pinJSONToIPFS',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JWT}`,
      },
      body: metadata,
    }
  );

  const ipfsMetadataLink = await metadataRes.json();

  console.log(ipfsMetadataLink);

  const updateNftIPFS = await prisma.nft.update({
    where: {
      nftHash,
    },
    data: {
      ipfsLink: ipfsMetadataLink.IpfsHash,
    },
  });

  return NextResponse.json({ ipfsMetadataLink: ipfsMetadataLink.IpfsHash });
}
