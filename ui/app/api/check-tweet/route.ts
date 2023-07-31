// import {
//   Field,
//   CircuitString,
//   Poseidon,
//   Mina,
//   PrivateKey,
//   PublicKey,
//   AccountUpdate,
// } from 'snarkyjs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
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

  const address = userCookie.value;

  //   const endorserCS = CircuitString.fromString(endorser);
  //   const endorserHash = Poseidon.hash(endorserCS.toFields());

  //   const nftHashCS = CircuitString.fromString(nftHash);
  //   const nftPosiedonHash = Poseidon.hash(nftHashCS.toFields());

  const res = await fetch(
    `https://cpone-oracle2-7eeba98fba7a.herokuapp.com/getTweetByUrl?url=${tweetUrl}`
  );

  const data = await res.json();

  console.log('data', data);
  console.log(`nftHash: ${nftHash}`);

  return NextResponse.json({ data });

  //   const fetchedNftHash = Field(data.signedData.nftPoseidonHash);
  //   const fetchedEndorserHash = Field(data.signedData.endorserHash);

  //   const signature = data.signature;

  //   const valid =
  //     endorserHash.equals(fetchedEndorserHash).toBoolean() &&
  //     nftPosiedonHash.equals(fetchedNftHash).toBoolean();

  //   console.log('valid', valid);
  //   console.log('endorserHash', endorserHash.toString());
  //   console.log('nftPosiedonHash', nftPosiedonHash.toString());

  //   console.log('fetchedNftHash', fetchedNftHash.toString());
  //   console.log('fetchedEndorserHash', fetchedEndorserHash.toString());

  //   if (valid) {
  //     const nft = await prisma.nft.update({
  //       where: {
  //         nftHash: nftHash,
  //         authorId: address,
  //       },
  //       data: {
  //         endorsed: true,
  //       },
  //     });
  //   }

  //   return NextResponse.json({ valid });

  // for now just checking here, but will call the verify function on the mina smart contract
}
