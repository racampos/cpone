import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const {
    tweetUrl,
    endorser,
    nftHash,
  }: { tweetUrl: string; endorser: string; nftHash: string } =
    await request.json();

  const cookiesList = cookies();

  const userCookie = cookiesList.get('user');

  if (!userCookie) {
    return NextResponse.redirect('/');
  }
  const res = await fetch(
    `https://cpone-oracle2-7eeba98fba7a.herokuapp.com/getTweetByUrl?url=${tweetUrl}`
  );

  const data = await res.json();

  const oracleNftHash: string = data.signedData.nftPoseidonHash;
  const oracleEndorserHash: string = data.signedData.endorserHash;
  const oracleSignature: string = data.signature;

  return NextResponse.json({
    oracleNftHash,
    oracleEndorserHash,
    oracleSignature: oracleSignature,
  });
}
