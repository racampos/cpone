export interface PrismaNFT {
  id: number;
  title: string;
  author: string;
  description: string;
  endorser: string;
  date: string;
  imageUrl: string;
  nftHash: string;
  minted: boolean;
  endorsed: boolean;
  etherscanLink: string | null;
  ipfsLink: string | null;
  zkAppPrivateKey: string;
  authorId: string;
}
